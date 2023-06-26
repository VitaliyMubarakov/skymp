import * as scampNative from "../scampNative";
import { Settings } from "../settings";
import { System } from "../systems/system";
import { MasterClient } from "../systems/masterClient";
import { Spawn } from "../systems/spawn";
import { Login } from "../systems/login";
import { EventEmitter } from "events";
import { pid } from "process";
import * as fs from "fs";
import * as chokidar from "chokidar";
import * as path from "path";
import * as os from "os";
import chalk from "chalk";
import * as manifestGen from "../manifestGen";
import { ScampServer } from "../scampNative";
import { BuildType, JSModule } from "./types";

interface SystemContext {
  svr: ScampServer;
  gm: EventEmitter;
}

let Directory = "./data/modules";
let modulesList: JSModule[] = [];

function addJSModule(module: JSModule, path: string) {
  module.path = path;
  modulesList.push(module);
}

function getModuleByPath(path: string) {
  let index: number = modulesList.findIndex((e) => {
    e.path == path;
  });

  return index != -1 ? modulesList[index] : null;
}

declare let process: { hrtime: () => any };

function now() {
  const hrTime = process.hrtime();
  return hrTime[0] * 1000 + hrTime[1] / 1000000;
}

export class ModulesSystem {
  ctx: SystemContext;

  isFirstWatchPlugins: any = {};

  constructor(ctx: SystemContext) {
    console.log("Modules initialization!");

    this.ctx = ctx;
    let reloadInfo: BuildType = this.ReloadModules();
    console.log("- Modules was Build in: ", reloadInfo.time, " ms.");
    console.log("- Loaded modules count: ", modulesList.length);
    reloadInfo.modules.forEach((e) => {
      console.log("    • ", e.GetInfo());
    });
    this.initHotReload();
  }

  initEvents() {
    this.ctx.svr.on("connect", (userId: number) =>
      modulesList.forEach((module) => module.onServerConnect(userId))
    );
  }

  isModuleChange: boolean = false;
  modulesToRebuild: string[] = [];

  initHotReload() {
    const moduleWatcherHandle = (path: string) => {
      if (!this.isFirstWatchPlugins[path]) {
        this.isFirstWatchPlugins[path] = true;
        return;
      }
      if (this.modulesToRebuild.indexOf(path) == -1)
        this.modulesToRebuild.push(path);

      if (this.isModuleChange) return;

      this.isModuleChange = true;

      setTimeout(() => {
        let reloadInfo: BuildType = this.ReloadModules(this.modulesToRebuild);
        this.modulesToRebuild = [];
        this.isModuleChange = false;

        console.log("- Modules was rebuild in: ", reloadInfo.time, " ms.");
        console.log("- Updated modules count: ", reloadInfo.num);
        reloadInfo.modules.forEach((e) => {
          console.log("    • ", e.GetInfo());
        });

        console.log("- Loaded modules count: ", modulesList.length);
      }, 2000);
    };

    const moduleWatcher = chokidar.watch(path.join("data", "modules"), {
      ignored: /^\./,
      persistent: true,
      awaitWriteFinish: true,
    });

    moduleWatcher.on("error", (error) => {
      console.error("Error happened in chokidar watch", error);
    });

    moduleWatcher.on("all", (event, path) => {
      if (
        event == "add" ||
        event == "addDir" ||
        event == "change" ||
        event == "unlink"
      ) {
        moduleWatcherHandle(path);
      }
    });
  }

  startTime = 0;

  ReloadModules(modulesToReload: string[] = null): BuildType {
    this.startTime = now();
    let updatedModulesCount = 0;

    if (
      modulesToReload &&
      modulesToReload.length > 0 &&
      modulesList.length > 0
    ) {
      modulesList = modulesList.filter((e) => {
        let moduleToClear = modulesToReload.indexOf(e.path) == -1;

        return moduleToClear;
      });
    } else {
      modulesList = [];
    }

    let currentModule: JSModule[] = [];

    //получаем файлы модулей
    fs.readdirSync(Directory, "utf8").forEach((moduleFolderName: any) => {
      const Absolute = path.join(Directory, moduleFolderName);
      if (!fs.statSync(Absolute).isDirectory()) return;

      fs.readdirSync(Absolute, "utf8").forEach((moduleFileName: any) => {
        const modulePath = path.join(Absolute, moduleFileName);

        if (
          modulesToReload &&
          modulesToReload.length > 0 &&
          modulesToReload.indexOf(modulePath) == -1
        )
          return;

        const fileExtension = path.extname(modulePath);

        if (fileExtension == ".js") {
          updatedModulesCount++;
          currentModule.push(this.LoadModule(modulePath));
        }
      });
    });

    this.initEvents();

    return {
      num: updatedModulesCount,
      time: now() - this.startTime,
      modules: currentModule,
    };
  }

  LoadModule(moduleJSPath: string): JSModule {
    const moduleName = moduleJSPath
      .replace("data\\modules\\", "")
      .replace("\\index.js", "");

    try {
      const moduleCode: string = fs.readFileSync(moduleJSPath).toString();
      if (!moduleCode.includes("addJSModule")) {
        console.error(
          `error when initialize module ${moduleName}`,
          'module doesn`t have "addJSModule"'
        );
        return null;
      }
      eval(fs.readFileSync("./" + moduleJSPath, "utf8"));
      return modulesList[modulesList.length - 1];
    } catch (err) {
      console.error(`error when initialize module ${moduleName}`, err);
      return null;
    }
  }
}

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
import { JSModule } from "./types";

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

export class ModulesSystem {
  ctx: SystemContext;

  isFirstWatchPlugins: any = {};

  constructor(ctx: SystemContext) {
    console.log("Modules initialization!");

    this.ctx = ctx;
    this.ReloadModules();
    this.initHotReload();
  }

  initEvents() {
    this.ctx.svr.on("connect", (userId: number) =>
      modulesList.forEach((module) => module.onServerConnect(userId))
    );
  }

  initHotReload() {
    const moduleWatcherHandle = (path: string) => {
      if (!this.isFirstWatchPlugins[path]) {
        this.isFirstWatchPlugins[path] = true;
        return;
      }

      this.ReloadModules([path]);
    };

    const moduleWatcher = chokidar.watch(path.join("data", "modules"), {
      ignored: /^\./,
      persistent: true,
      awaitWriteFinish: true,
    });

    moduleWatcher.on("add", moduleWatcherHandle);
    moduleWatcher.on("addDir", moduleWatcherHandle);
    moduleWatcher.on("change", moduleWatcherHandle);
    moduleWatcher.on("unlink", moduleWatcherHandle);
    moduleWatcher.on("error", (error) => {
      console.error("Error happened in chokidar watch", error);
    });
  }

  ReloadModules(modulesToReload: string[] = null) {
    let updatedModulesCount = 0;

    if (
      modulesToReload &&
      modulesToReload.length > 0 &&
      modulesList.length > 0
    ) {
      modulesList = modulesList.filter((e) => {
        let moduleToClear = modulesToReload.indexOf(e.path) == -1;
        if (moduleToClear)
          console.log(`Module ${chalk.underline(e.moduleName)} is cleared`);

        return moduleToClear;
      });
    } else {
      modulesList = [];
      console.log("Modules cleared");
    }

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
          this.LoadModule(modulePath);
        }
      });
    });

    this.initEvents();

    console.log("- Updated modules count: ", updatedModulesCount);
    console.log("- Loaded modules count: ", modulesList.length);
  }

  LoadModule(moduleJSPath: string) {
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
        return false;
      }
      eval(fs.readFileSync("./" + moduleJSPath, "utf8"));
      return true;
    } catch (err) {
      console.error(`error when initialize module ${moduleName}`, err);
      return false;
    }
  }
}

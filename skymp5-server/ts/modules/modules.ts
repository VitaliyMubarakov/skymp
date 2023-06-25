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

import * as manifestGen from "../manifestGen";
import { ScampServer } from "../scampNative";
import { JSModule } from "./types";

interface SystemContext {
  svr: ScampServer;
  gm: EventEmitter;
}

let Directory = "./data/modules";
let modulesPath: string[] = [];
let modulesList: JSModule[] = [];

let addJSModule = (module: JSModule) => modulesList.push(module);

export class ModulesSystem {
  ctx: SystemContext;
  actorId: number;

  isFirstWatchPlugins: any = {};

  getActorName(): string {
    console.log(this.actorId);
    return this.ctx.svr.getActorName(this.actorId);
  }

  constructor(ctx: SystemContext) {
    console.log("-- Инициалищия данных! --");

    this.ctx = ctx;
    //this.ReloadModules();
    this.initHotReload();

    ctx.gm.on(
      "spawnAllowed",
      (userId: number, userProfileId: number, discordRoleIds: string[]) => {
        let actorId = ctx.svr.getActorsByProfileId(userProfileId)[0];

        if (actorId) this.actorId = actorId;

        console.log("-- Инициалищия модулей! --");

        setTimeout(() => {
          this.ReloadModules();
        }, 1000 * 120);
      }
    );
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

      console.log("Module was updated: ", path);

      //this.ReloadModules();
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

  ReloadModules() {
    modulesList = [];
    modulesPath = [];

    console.log("Модули очищены");

    //получаем файлы модулей
    fs.readdirSync(Directory, "utf8").forEach((moduleFolderName: any) => {
      const Absolute = path.join(Directory, moduleFolderName);
      if (!fs.statSync(Absolute).isDirectory()) return;

      fs.readdirSync(Absolute, "utf8").forEach((moduleFileName: any) => {
        const modulePath = path.join(Absolute, moduleFileName);

        const fileExtension = path.extname(modulePath);

        if (fileExtension == ".js") modulesPath.push(modulePath);
      });
    });

    //проходимся по index'ам  и запускаем
    modulesPath.forEach((moduleJSPath) => {
      console.log(moduleJSPath);

      eval(fs.readFileSync("./" + moduleJSPath, "utf8"));
    });

    this.initEvents();

    console.log("Модули загружены!");
  }
}

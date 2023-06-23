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

interface SystemContext {
  svr: ScampServer;
  gm: EventEmitter;
}

function getActorName(): string {
  console.log(ModulesSystem.actorId);
  return ModulesSystem.ctx.svr.getActorName(ModulesSystem.actorId);
}

let Directory = "./data/modules";


export class ModulesSystem {
  static ctx: SystemContext;
  static actorId: number;

  static init(ctx: SystemContext) {
    console.log("-- Инициалищия данных! --");

    this.ctx = ctx;

    let modulesPath: string[] = [];

    fs.readdirSync(Directory, 'utf8').forEach((moduleFolderName: any) => {
      const Absolute = path.join(Directory, moduleFolderName);
      if (!fs.statSync(Absolute).isDirectory()) return;

      fs.readdirSync(Absolute, 'utf8').forEach((moduleFileName: any) => {
        const modulePath = path.join(Absolute, moduleFileName);
        const fileExtension = path.extname(modulePath);

        if (fileExtension == ".js") modulesPath.push(modulePath);
      });
    });

    modulesPath.forEach((moduleJSPath) => {
      console.log(moduleJSPath);

      eval(fs.readFileSync("./" + moduleJSPath, 'utf8'));
    });
  
    
      
    ctx.gm.on("spawnAllowed", (userId: number, userProfileId: number, discordRoleIds: string[]) => {
      let actorId = ctx.svr.getActorsByProfileId(userProfileId)[0];

      if (actorId) this.actorId = actorId;

      console.log("-- Инициалищия модулей! --");


      


      //eval(fs.readFileSync("./data/modules/index.js", 'utf8'));
    });


    
  }
}

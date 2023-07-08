import { EventEmitter } from "events";
import * as fs from "fs";
import * as chokidar from "chokidar";
import * as path from "path";
import chalk from "chalk";
import { ScampServer } from "../scampNative";

export class JSModule {
  moduleName: string;
  description: string;
  author: string;
  version: string;
  path: string;

  constructor(JSModuleData: any) {
    this.moduleName = JSModuleData.name.replace(/\w/, (c: string) => c.toUpperCase());
    this.description = JSModuleData.description.replace(/\w/, (c: string) => c.toUpperCase());
    this.author = JSModuleData.author;
    this.version = JSModuleData.version;
  }

}

export type BuildType = { num: number; time: number; modules: JSModule[] };

interface SystemContext {
  svr: ScampServer;
  gm: EventEmitter;
}

let modulesList: JSModule[] = [];

function addJSModule(module: JSModule, path: string) {
  module.path = path;
  modulesList.push(module);
}

function now() {
  const hrTime = process.hrtime();
  return hrTime[0] * 1000 + hrTime[1] / 1000000;
}

function printModules(reloadInfo: BuildType) {
  const biggerName: number = reloadInfo.modules.sort((a, b) => b.moduleName.length - a.moduleName.length)[0].moduleName.length;
  const biggerDesc: number = reloadInfo.modules.sort((a, b) => b.description.length - a.description.length)[0].description.length;
  const biggerAuthor: number = reloadInfo.modules.sort((a, b) => b.author.length - a.author.length)[0].author.length;
  const biggerVersion: number = reloadInfo.modules.sort((a, b) => b.version.length - a.version.length)[0].version.length;

  const NamePropText: string = "Name";
  const DescPropText: string = "Description";
  const AuthorPropText: string = "Author";
  const VersionPropText: string = "Version";

  const NamePropSpacesCount : number = NamePropText.length < biggerName ? biggerName - NamePropText.length : 0;
  const DescPropSpacesCount : number = DescPropText.length < biggerDesc ? biggerDesc - DescPropText.length : 0;
  const AuthorPropSpacesCount : number = AuthorPropText.length < biggerAuthor ? biggerAuthor - AuthorPropText.length : 0;
  const VersionPropSpacesCount : number = VersionPropText.length < biggerVersion ? biggerVersion - VersionPropText.length : 0;

  const NamefieldSpacesCountCount : number = NamePropText.length > biggerName ? NamePropText.length - biggerName : 0;
  const DescfieldSpacesCountCount : number = DescPropText.length > biggerDesc ? DescPropText.length - biggerDesc : 0;
  const AuthorfieldSpacesCountCount : number = AuthorPropText.length > biggerAuthor ? AuthorPropText.length - biggerAuthor : 0;
  const VersionfieldSpacesCountCount: number = VersionPropText.length > biggerVersion ? VersionPropText.length - biggerVersion : 0;

  const startSpacesCount: number = 4;
  const fieldSpacesCount: number = 1;

  const startSpaces: string = ' '.repeat(startSpacesCount);
  const fieldSpaces: string = ' '.repeat(fieldSpacesCount);

  const nameProp: string = chalk.green.underline(NamePropText);
  const descriptionProp: string = chalk.green.underline(DescPropText);
  const authorProp: string = chalk.green.underline(AuthorPropText);
  const versionProp: string = chalk.green.underline(VersionPropText);
  const afterNamePropSpaces: string = ' '.repeat(NamePropSpacesCount + fieldSpacesCount);
  const afterDescPropSpaces: string = ' '.repeat(DescPropSpacesCount + fieldSpacesCount);
  const afterAuthorPropSpaces: string = ' '.repeat(AuthorPropSpacesCount + fieldSpacesCount);
  const afterVersionPropSpaces: string = ' '.repeat(VersionPropSpacesCount + fieldSpacesCount);

  const output: string = `${startSpaces}|${fieldSpaces}${nameProp}${afterNamePropSpaces}|${fieldSpaces}${descriptionProp}${afterDescPropSpaces}|${fieldSpaces}${authorProp}${afterAuthorPropSpaces}|${fieldSpaces}${versionProp}${afterVersionPropSpaces}|`;

  console.log(output);

  reloadInfo.modules.forEach((e) => {
    const nameSpaces: string = ' '.repeat(biggerName - e.moduleName.length + NamefieldSpacesCountCount + fieldSpacesCount);
    const descSpaces: string = ' '.repeat(biggerDesc - e.description.length + DescfieldSpacesCountCount + fieldSpacesCount);
    const authorSpaces: string = ' '.repeat(biggerAuthor - e.author.length + AuthorfieldSpacesCountCount + fieldSpacesCount);
    const versionSpaces: string = ' '.repeat(biggerVersion - e.version.length + VersionfieldSpacesCountCount + fieldSpacesCount);

    console.log(`${startSpaces}|${fieldSpaces}${e.moduleName}${nameSpaces}|${fieldSpaces}${e.description}${descSpaces}|${fieldSpaces}${e.author}${authorSpaces}|${fieldSpaces}${e.version}${versionSpaces}|`);
  });

}

export class ModulesSystem {
  ctx: SystemContext;

  readonly directory = "./data/modules";

  isFirstWatchPlugins: any = {};
  isModuleChange: boolean = false;
  modulesToRebuild: string[] = [];

  constructor(ctx: SystemContext) {
    this.ctx = ctx;
    console.log("Modules System initialization!");

    let reloadInfo: BuildType = this.ReloadModules();
    console.log("- Modules was Build in: ", reloadInfo.time, " ms.");
    console.log("- Loaded modules count: ", modulesList.length);
    printModules(reloadInfo);

    this.initHotReload();
  }

  initEvents() {
    this.ctx.svr.on("connect", (userId: number) =>
      modulesList.forEach((module: any) => { if (module.onServerConnect) module.onServerConnect(userId) })
    );

    this.ctx.svr.on("activate", (caster: number, target: number) =>
      modulesList.forEach((module: any) => { if (module.onActivate) module.onActivate(caster, target) })
    );
  }

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
        printModules(reloadInfo);

        console.log("- Loaded modules count: ", modulesList.length);
      }, 500);
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

  ReloadModules(modulesToReload: string[] = null): BuildType {
    let startTime = now();
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

    let currentModules: JSModule[] = [];

    //get files and load every module
    fs.readdirSync(this.directory, "utf8").forEach((moduleFolderName: any) => {
      const Absolute = path.join(this.directory, moduleFolderName);
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
          currentModules.push(this.LoadModule(modulePath));
        }
      });
    });

    this.initEvents();

    return {
      num: updatedModulesCount,
      time: Math.round(now() - startTime),
      modules: currentModules,
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
      console.log(moduleName);

      eval(fs.readFileSync("./" + moduleJSPath, "utf8"));
      return modulesList[modulesList.length - 1];
    } catch (err) {
      console.error(`error when initialize module ${moduleName}`, err);
      return null;
    }
  }
}

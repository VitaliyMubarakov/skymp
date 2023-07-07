import { JSModuleData } from './config.json';

class Module implements JSModule {
  moduleName: string;
  description: string;
  author: string;
  version: string;

  constructor() {
    this.moduleName = JSModuleData.name.replace(/\w/, (c) => c.toUpperCase());
    this.description = JSModuleData.description.replace(/\w/, (c) => c.toUpperCase());
    this.author = JSModuleData.author;
    this.version = JSModuleData.version;
  }

  GetInfo(): string {
    return `Module: ${this.moduleName} | Description: ${this.description} | Author: ${this.author} | Version: ${this.version} `;
  }

  onServerConnect(userId: number): void {
    console.log('Пsерывыыssssй мыsодуsыыль работает тоже ', userId);
  }

  onActivate(caster: number, target: number): void {
    console.log("Caster: ", caster, " Target: ", target);
  }
}

addJSModule(new Module(), moduleJSPath);

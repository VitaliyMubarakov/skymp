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
    console.log('Мsодsыssdfыsыsуsssdsssлassdьs 2 рssаботает', userId);
  }
}

addJSModule(new Module(), moduleJSPath);

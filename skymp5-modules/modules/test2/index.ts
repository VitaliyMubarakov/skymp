import { JSModuleData } from './config.json';

class Module extends JSModule implements IJSModule {
  onServerConnect(userId: number): void {
    console.log('Мsодsыssdfыsыsуsssdsssлassdьs 2 рssаботает', userId);
  }
}

addJSModule(new Module(JSModuleData), moduleJSPath);

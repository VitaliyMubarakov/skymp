import { JSModuleData } from './config.json';

class Module extends JSModule implements IJSModule {
  onServerConnect(userId: number): void {
    console.log('Пsерывыыssssй мыsодуsыыль работает тоже ', userId);
  }

  onActivate(caster: number, target: number): void {
    console.log("Caster: ", caster, " Target: ", target);
  }
}

addJSModule(new Module(JSModuleData), moduleJSPath);

# Structure

1. main.cc | skymp5-server\cpp\addon\main.cc
Создаётся Node модуль scamp

2. ScampServer.cpp | skymp5-server\cpp\addon\ScampServer.cpp
Инициализация методов для js через node api

3. scampNative.ts | skymp5-server\ts\scampNative.ts
Импорт нодовского бинарника и взятие от туда скампКласса из плюсов и конвертация его в тс скампКласс

4. index.ts | skymp5-server\ts\index.ts
Вызывается конструктор сервера из скампКласса, сохраняется в ctx, а далее используется со всеми методами и т.п.

5. Папка Modules
В ней 


# Пример 
```
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
```

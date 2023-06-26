declare interface JSModule {
  moduleName?: string;
  description?: string;
  author?: string;
  version?: string;
  path?: string;

  onServerConnect?(userId: number): void;
}

declare let moduleJSPath: string;

declare function addJSModule(module: JSModule, path: string);

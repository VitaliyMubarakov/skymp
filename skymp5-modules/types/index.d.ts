declare interface JSModule {
  moduleName?: string;
  description?: string;
  author?: string;
  version?: string;

  onServerConnect?(userId: number): void;
}

declare function addJSModule(module: JSModule);

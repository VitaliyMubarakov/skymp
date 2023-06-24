declare interface JSModule {
  moduleName?: string;
  description?: string;
  author?: string;
  version?: string;
}

declare function addJSModule(module: JSModule);

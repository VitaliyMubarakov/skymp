declare interface JSModule {
  moduleName?: string;
  description?: string;
  author?: string;
  version?: string;
  path?: string;

  GetInfo(): string;

  onServerConnect?(userId: number): void;
  onActivate?(caster: number, target: number): void;
}

declare let moduleJSPath: string;

declare function addJSModule(module: JSModule, path: string);


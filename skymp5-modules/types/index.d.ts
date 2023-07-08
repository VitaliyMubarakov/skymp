declare interface IJSModule {
  onServerConnect?(userId: number): void;
  onActivate?(caster: number, target: number): void;
}

declare let moduleJSPath: string;

declare function addJSModule(module: JSModule, path: string);


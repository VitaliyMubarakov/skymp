export interface JSModule {
  moduleName?: string;
  description?: string;
  author?: string;
  version?: string;
  path?: string;

  GetInfo(): string;

  onServerConnect?(userId: number): void;
}

export type BuildType = { num: number; time: number; modules: JSModule[] };

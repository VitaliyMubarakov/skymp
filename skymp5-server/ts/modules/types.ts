export interface JSModule {
  moduleName?: string;
  description?: string;
  author?: string;
  version?: string;
  path?: string;

  onServerConnect?(userId: number): void;
}

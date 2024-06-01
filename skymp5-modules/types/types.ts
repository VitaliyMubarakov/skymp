class JSModule {
  moduleName: string;
  description: string;
  author: string;
  version: string;

  constructor(JSModuleData: any) {
    this.moduleName = JSModuleData.name.replace(/\w/, (c) => c.toUpperCase());
    this.description = JSModuleData.description.replace(/\w/, (c) => c.toUpperCase());
    this.author = JSModuleData.author;
    this.version = JSModuleData.version;
  }

}

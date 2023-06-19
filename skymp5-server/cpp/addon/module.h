namespace Modules {
  class Module
  {
    public:
      Module();
      ~Module();

      static void Invoke() {  
        std::cout << "ahah" << std::endl;
      };

  private:
  };

  Module::Module()
  {
  }

  Module::~Module()
  {
  }
}



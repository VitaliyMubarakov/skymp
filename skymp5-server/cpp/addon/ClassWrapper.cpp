#include "ClassWrapper.h"
#include <iostream>

Napi::Object ClassWrapper::Init(Napi::Env env, Napi::Object exports)
{
  Napi::Function func = DefineClass(env, "ClassWrapper",
                { InstanceMethod("exampleFunc", &ClassWrapper::ExampleFunc),
                  InstanceMethod("exampleGet", &ClassWrapper::ExampleGet)
                });

  exports.Set("ClassWrapper", func);

  return exports;
}

ClassWrapper::ClassWrapper(const Napi::CallbackInfo& info)
  : ObjectWrap(info)
{
  std::cout << "constructor" << std::endl;
}

Napi::Value ClassWrapper::ExampleFunc(const Napi::CallbackInfo& info)
{
  std::cout << "run example func" << std::endl;
  return info.Env().Undefined();
}

Napi::Value ClassWrapper::ExampleGet(const Napi::CallbackInfo& info)
{
  Napi::Env env = info.Env();
  return Napi::Number::New(env, 1488);
}

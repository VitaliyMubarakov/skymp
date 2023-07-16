#include "ClassWrapper.h"
#include <iostream>
#include "../server_guest_lib/SpSnippet.h"

Napi::Object ClassWrapper::Init(Napi::Env env, Napi::Object exports)
{
  Napi::Function func = DefineClass(env, "ClassWrapper",
                { InstanceMethod("exampleFunc", &ClassWrapper::ExampleFunc),
                  InstanceMethod("exampleGet", &ClassWrapper::ExampleGet),
                  InstanceMethod("Disable", &ClassWrapper::Disable)
                });

  constructor = Napi::Persistent(func);
  constructor.SuppressDestruct();

  exports.Set("ClassWrapper", func);



  return exports;
}

ClassWrapper::ClassWrapper(const Napi::CallbackInfo& info)
  : ObjectWrap(info)
{
  
  std::cout << "constructorrrrr---" << std::endl;
  std::cout << info.Length() << std::endl;
  std::cout << static_cast<int>(info[0].As<Napi::Number>()) << std::endl;
  int id = static_cast<int>(info[0].As<Napi::Number>());
  std::cout << id << std::endl;

  SetObjectReference(std::shared_ptr<MpObjectReference>(&partOne->worldState.GetFormAt<MpObjectReference>(id), [](void*) {}));

  std::cout << "поз: " << mpObjectReference->GetPos().x << std::endl;

  std::cout << "const end " << std::endl;
}
Napi::Object ClassWrapper::Constructor(Napi::Number n)
{
  std::cout << "ctor" << std::endl;
  std::cout << static_cast<int>(n) << std::endl;
  return constructor.New({n});
}
Napi::Value ClassWrapper::ExampleFunc(const Napi::CallbackInfo& info)
{
  std::cout << "run example func" << std::endl;
  //obj->Disable();
  return info.Env().Undefined();
}

Napi::Value ClassWrapper::ExampleGet(const Napi::CallbackInfo& info)
{
  Napi::Env env = info.Env();
  return Napi::Number::New(env, 1488);
}

Napi::Value ClassWrapper::Disable(const Napi::CallbackInfo& info)
{
  std::cout << "вклС: " << this->mpObjectReference->IsDisabled() << std::endl;
  this->mpObjectReference->Disable();
   std::cout << "вклСR: " << this->mpObjectReference->IsDisabled() << std::endl;

  return info.Env().Undefined();
}


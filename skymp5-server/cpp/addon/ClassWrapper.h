#include <napi.h>

class ClassWrapper : public Napi::ObjectWrap<ClassWrapper>
{
public:
  static Napi::Object Init(Napi::Env env, Napi::Object exports);
  ClassWrapper(const Napi::CallbackInfo& info);

  Napi::Value FormID;
  Napi::Value ExampleFunc(const Napi::CallbackInfo& info);
  Napi::Value ExampleGet(const Napi::CallbackInfo& info);

};

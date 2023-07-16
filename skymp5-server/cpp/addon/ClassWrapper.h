#include <napi.h>
#include "PartOne.h"

class ClassWrapper : public Napi::ObjectWrap<ClassWrapper>
{
public:
  
  static Napi::Object Init(Napi::Env env, Napi::Object exports);
  ClassWrapper(const Napi::CallbackInfo& info);
  static Napi::Object Constructor(Napi::Number n);
  static void SetPartOne(std::shared_ptr<PartOne> obj) { partOne = obj; }
  void SetObjectReference(std::shared_ptr<MpObjectReference> obj)
  {
    mpObjectReference = obj;
  }
  Napi::Value FormID;
  Napi::Value ExampleFunc(const Napi::CallbackInfo& info);
  Napi::Value ExampleGet(const Napi::CallbackInfo& info);
  Napi::Value Disable(const Napi::CallbackInfo& info);

private:
  inline static Napi::FunctionReference constructor;
  inline static std::shared_ptr<PartOne> partOne;
  std::shared_ptr<MpObjectReference> mpObjectReference;
};

#include "TextApi.h"

namespace TextApi {

JsValue TextApi::CreateText(const JsFunctionArguments& args)
{
  std::array<double, 4> argColor;

  auto argPosX = static_cast<double>(args[1]);
  auto argPosY = static_cast<double>(args[2]);

  std::wstring_convert<std::codecvt_utf8_utf16<wchar_t>> converter;
  auto argString = converter.from_bytes(static_cast<std::string>(args[3]));
  auto argFontName = static_cast<std::string>(args[5]);

  for (int i = 0; i < 4; i++) {
    argColor[i] = args[4].GetProperty(i);
  }

  return JsValue(TextsCollection::GetSingleton().CreateText(
    argPosX, argPosY, argString, argColor, argFontName));
}

JsValue TextApi::DestroyText(const JsFunctionArguments& args)
{
  TextsCollection::GetSingleton().DestroyText(static_cast<int>(args[1]));
  return JsValue::Undefined();
}

JsValue TextApi::SetTextPos(const JsFunctionArguments& args)
{
  auto argPosX = static_cast<double>(args[2]);
  auto argPosY = static_cast<double>(args[3]);

  TextsCollection::GetSingleton().SetTextPos(static_cast<int>(args[1]),
                                             argPosX, argPosY);
  return JsValue::Undefined();
}

JsValue TextApi::SetTextString(const JsFunctionArguments& args)
{
  auto textId = static_cast<int>(args[1]);

  std::wstring_convert<std::codecvt_utf8_utf16<wchar_t>> converter;
  auto argString = converter.from_bytes(static_cast<std::string>(args[2]));

  TextsCollection::GetSingleton().SetTextString(textId, std::move(argString));
  return JsValue::Undefined();
}

JsValue TextApi::SetTextColor_(const JsFunctionArguments& args)
{
  std::array<double, 4> argColor;

  for (int i = 0; i < 4; i++) {
    argColor[i] = args[2].GetProperty(i);
  }

  TextsCollection::GetSingleton().SetTextColor(static_cast<int>(args[1]),
                                               std::move(argColor));
  return JsValue::Undefined();
}

JsValue TextApi::SetTextSize(const JsFunctionArguments& args)
{
  auto textId = static_cast<int>(args[1]);

  auto size = static_cast<double>(args[2]);

  TextsCollection::GetSingleton().SetTextSize(textId, size);
  return JsValue::Undefined();
}

JsValue TextApi::SetTextRotation(const JsFunctionArguments& args)
{
  auto textId = static_cast<int>(args[1]);

  auto rot = static_cast<double>(args[2]);

  TextsCollection::GetSingleton().SetTextRotation(textId, rot);
  return JsValue::Undefined();
}

JsValue TextApi::SetTextFont(const JsFunctionArguments& args)
{
  auto textId = static_cast<int>(args[1]);

  std::wstring_convert<std::codecvt_utf8_utf16<wchar_t>> converter;
  auto argString = converter.from_bytes(static_cast<std::string>(args[2]));

  std::wstring widestr = std::wstring(argString.begin(), argString.end());

  TextsCollection::GetSingleton().SetTextFont(
    textId, static_cast<std::string>(args[2]));
  return JsValue::Undefined();
}

JsValue TextApi::SetTextDepth(const JsFunctionArguments& args)
{
  auto textId = static_cast<int>(args[1]);

  auto depth = static_cast<double>(args[2]);

  TextsCollection::GetSingleton().SetTextDepth(textId, depth);
  return JsValue::Undefined();
}

JsValue TextApi::SetTextEffect(const JsFunctionArguments& args)
{
  auto textId = static_cast<int>(args[1]);

  int eff = static_cast<int>(args[2]);

  TextsCollection::GetSingleton().SetTextEffect(textId, eff);
  return JsValue::Undefined();
}

JsValue TextApi::SetTextOrigin(const JsFunctionArguments& args)
{
  std::array<double, 2> argOrigin;

  for (int i = 0; i < 2; i++) {
    argOrigin[i] = args[2].GetProperty(i);
  }

  TextsCollection::GetSingleton().SetTextOrigin(static_cast<int>(args[1]),
                                                std::move(argOrigin));
  return JsValue::Undefined();
}

JsValue TextApi::DestroyAllTexts(const JsFunctionArguments&)
{
  TextsCollection::GetSingleton().DestroyAllTexts();
  return JsValue::Undefined();
}

JsValue TextApi::GetTextPos(const JsFunctionArguments& args)
{
  auto postions =
    TextsCollection::GetSingleton().GetTextPos(static_cast<int>(args[1]));
  auto jsArray = JsValue::Array(2);

  jsArray.SetProperty(0, postions.first);
  jsArray.SetProperty(1, postions.second);

  return jsArray;
}

JsValue TextApi::GetTextString(const JsFunctionArguments& args)
{
  const auto& str =
    TextsCollection::GetSingleton().GetTextString(static_cast<int>(args[1]));

  std::wstring_convert<std::codecvt_utf8_utf16<wchar_t>> converter;
  return JsValue(converter.to_bytes(str));
}

JsValue TextApi::GetTextColor(const JsFunctionArguments& args)
{
  auto argArray =
    TextsCollection::GetSingleton().GetTextColor(static_cast<int>(args[1]));
  auto jsArray = JsValue::Array(4);

  for (int i = 0; i < 4; i++) {
    jsArray.SetProperty(i, argArray.at(i));
  }

  return jsArray;
}

JsValue TextApi::GetTextSize(const JsFunctionArguments& args)
{
  const auto& size =
    TextsCollection::GetSingleton().GetTextSize(static_cast<double>(args[1]));

  return JsValue(size);
}

JsValue TextApi::GetTextRotation(const JsFunctionArguments& args)
{
  const auto& rot = TextsCollection::GetSingleton().GetTextRotation(
    static_cast<double>(args[1]));

  return JsValue(rot);
}

JsValue TextApi::GetTextFont(const JsFunctionArguments& args)
{
  const auto& font =
    TextsCollection::GetSingleton().GetTextName(static_cast<int>(args[1]));

  std::wstring_convert<std::codecvt_utf8_utf16<wchar_t>> converter;
  return JsValue(font);
}

JsValue TextApi::GetTextDepth(const JsFunctionArguments& args)
{
  const auto& z =
    TextsCollection::GetSingleton().GetTextDepth(static_cast<int>(args[1]));

  return JsValue(z);
}

JsValue TextApi::GetTextEffect(const JsFunctionArguments& args)
{
  const int& i =
    TextsCollection::GetSingleton().GetTextEffect(static_cast<int>(args[1]));

  return JsValue(i);
}

JsValue TextApi::GetTextOrigin(const JsFunctionArguments& args)
{
  auto argArray =
    TextsCollection::GetSingleton().GetTextColor(static_cast<double>(args[1]));
  auto jsArray = JsValue::Array(2);

  for (int i = 0; i < 2; i++) {
    jsArray.SetProperty(i, argArray.at(i));
  }

  return jsArray;
}

JsValue TextApi::GetNumCreatedTexts(const JsFunctionArguments& args)
{
  return JsValue(TextsCollection::GetSingleton().GetNumCreatedTexts());
}

void Register(JsValue& exports)
{
  exports.SetProperty("createText", JsValue::Function(CreateText));

  exports.SetProperty("destroyText", JsValue::Function(DestroyText));

  exports.SetProperty("setTextPos", JsValue::Function(SetTextPos));

  exports.SetProperty("setTextString", JsValue::Function(SetTextString));

  exports.SetProperty("setTextColor", JsValue::Function(SetTextColor_));

  exports.SetProperty("setTextSize", JsValue::Function(SetTextSize));

  exports.SetProperty("setTextRotation", JsValue::Function(SetTextRotation));

  exports.SetProperty("setTextFont", JsValue::Function(SetTextFont));

  exports.SetProperty("setTextDepth", JsValue::Function(SetTextDepth));

  exports.SetProperty("setTextEffect", JsValue::Function(SetTextEffect));

  exports.SetProperty("setTextOrigin", JsValue::Function(SetTextOrigin));

  exports.SetProperty("destroyAllTexts", JsValue::Function(DestroyAllTexts));

  exports.SetProperty("getTextPos", JsValue::Function(GetTextPos));

  exports.SetProperty("getTextString", JsValue::Function(GetTextString));

  exports.SetProperty("getTextColor", JsValue::Function(GetTextColor));

  exports.SetProperty("getTextSize", JsValue::Function(GetTextSize));

  exports.SetProperty("getTextRotation", JsValue::Function(GetTextRotation));

  exports.SetProperty("getTextFont", JsValue::Function(GetTextFont));

  exports.SetProperty("getTextDepth", JsValue::Function(GetTextDepth));

  exports.SetProperty("getTextEffect", JsValue::Function(GetTextEffect));

  exports.SetProperty("getTextOrigin", JsValue::Function(GetTextOrigin));

  exports.SetProperty("getNumCreatedTexts",
                      JsValue::Function(GetNumCreatedTexts));
}

}

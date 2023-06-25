Structure

1. main.cc | skymp5-server\cpp\addon\main.cc
Создаётся Node модуль scamp

2. ScampServer.cpp | skymp5-server\cpp\addon\ScampServer.cpp
Инициализация методов для js через node api

3. scampNative.ts | skymp5-server\ts\scampNative.ts
Импорт нодовского бинарника и взятие от туда скампКласса из плюсов и конвертация его в тс скампКласс

4. index.ts | skymp5-server\ts\index.ts
Вызывается конструктор сервера из скампКласса, сохраняется в ctx, а далее используется со всеми методами и т.п.

5. Папка Modules
В ней 
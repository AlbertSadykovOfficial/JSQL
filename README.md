# JS_Gsheets

JS_Gsheets - небольшая библиотека оснванная на (tabletop.js)
для извлечения данных из Google - таблиц и вывода их в таблицы html.

>(Была написана для конструктора сайтов - Tilda)

> Настройки
    
:white_check_mark: SHEET_URL - Ключ ссылки на таблицу (таблица должна быть публичной)

:white_check_mark: USER_COLUMN - Колонка, которая идентифицирует пользователя (если
                      в таблице данные разных пользователей, то отбор будет
                      осуществлятся по этой колонке в фукции find() )

:white_check_mark: FILE_URL - Колонка, по которой будет доплнительная проверка
                   (к примеру - проверка расширения файла в названии)

:white_check_mark: CHECL_ALL - стандартное значение (value) тега option при поиске
                    (""-потому что при такой строке выбираются все записи)

:white_check_mark: TABLE_COLUMNS - Список колонок, которые нужно выводить на странице

:white_check_mark: SPEC_COLUMNS - Список (списков колонок специального форматирования).
                       (1 параметр - Имя столбца; 
                        2 и 3 - префикс и постфикс;

                        Подразумевается использование:
                        [2] + DATA[1] + [3]

                        Пример:
                        "<img src='"+ DATA['photo_url']  +"'>";
                       )          
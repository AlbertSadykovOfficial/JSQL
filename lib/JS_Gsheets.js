/*
        
    Настройки.
    
        SHEET_URL - Ключ ссылки на таблицу (таблица должна быть публичной)
        Пример:
        "https://docs.google.com/spreadsheets/d/{{SHEET_URL}}/edit?usp=sharing"

        USER_COLUMN - Колонка, которая идентифицирует пользователя (если
                      в таблице данные разных пользователей, то отбор будет
                      осуществлятся по этой колонке в фукции find() )

        FILE_URL - Колонка, по которой будет доплнительная проверка
                   (к примеру - проверка расширения файла в названии)

        CHECL_ALL - стандартное значение (value) тега option при поиске
                    (""-потому что при такой строке выбираются все записи)

        TABLE_COLUMNS - Список колонок, которые нужно выводить на странице

        SPEC_COLUMNS - Список (списков колонок специального форматирования).
                       (1 параметр - Имя столбца; 
                        2 и 3 - префикс и постфикс;

                        Подразумевается использование:
                        [2] + DATA[1] + [3]

                        Пример:
                        "<img src='"+ DATA['photo_url']  +"'>";
                       )

*/
SHEET_URL = "1FGhlktidC_5rmwbY7T1z8Jn76feaJtty5fz0IQVJTz4";

USER_COLUMN = "MAIL";
DATE_COLUMN = "Date";
DOC_TYPE = "Doc_Type";
CHECK_ALL = "";

ALT_T_COLUMNS = [ "Имя", "Город", "Дата загрузки", "Документ"];
TABLE_COLUMNS = [ "User", "City", "Date"];
SPEC_COLUMNS  = [["Doc_Type", "File", "<a href='","'>","</a>"]]


/*
        
        Получить объект

*/
function O(i)
{
   return typeof i == 'object' ? i : document.getElementById(i);
}

/*
		
		Запрос к Google Таблице

*/
document.addEventListener('DOMContentLoaded', function() {
    href = "https://docs.google.com/spreadsheets/d/"+ SHEET_URL +"/edit?usp=sharing";
    O('google_href').setAttribute("href", href);

    request();
})

function request()
{
    Tabletop.init({key: SHEET_URL, callback: find, simpleSheet: true})
}


/*
		
		Создание Тегов

*/
function tag_option(value, name)
{
    return "<option value='"+ value +"'>" + name + "</option>";
}

function tag_tr(value)
{
    return "<tr>" + value + "</tr>";
}

function tag_th(value)
{
    return "<th>" + value + "</th>";
}

function tag_td(value)
{
    return "<td>" + value + "</td>";
}


/*
    Позказать параметры фильтрации

*/
function show_filters()
{
    elems = document.getElementsByClassName("filter_fields");
    if (elems[0].classList.contains('hidden'))
    {
        O("switch").innerText = "-";
        elems[0].classList.remove('hidden');
        elems[1].classList.remove('hidden');
    }
    else
    {
        O("switch").innerText = "+";
        elems[0].classList.add('hidden');
        elems[1].classList.add('hidden');
    }
}

/*
		
		Создать шапку таблицы
		Заполнение таблицы

		Создать выпадающие списки:
			Колонок
			Расширений файлов

*/
function create_table_header()
{
    let table_header = "";
    
    for (let i=0; i < ALT_T_COLUMNS.length; i++)
    {
        table_header += tag_th(ALT_T_COLUMNS[i]);
    }
    
    table_header = tag_tr(table_header);
    
    O('MAIN_TABLE').innerHTML =  table_header;
}

function print_result(DATA)
{
    let context = "";

    for (let i=0; i < TABLE_COLUMNS.length; i++)
    {
        context += tag_td(DATA[TABLE_COLUMNS[i]]);
    }
    for (let i=0; i < SPEC_COLUMNS.length; i++)
    {
        context += tag_td(  SPEC_COLUMNS[i][2] + 
                            DATA[SPEC_COLUMNS[i][1]] + 
                            SPEC_COLUMNS[i][3] + 
                            DATA[SPEC_COLUMNS[i][0]] + 
                            SPEC_COLUMNS[i][4]
                        );
    }
    
    context = tag_tr(context);
    O('MAIN_TABLE').insertAdjacentHTML('beforeEnd', context);
}

function create_file_selector(ARR) 
{
    let options = "";

    options = tag_option(CHECK_ALL, "Все");
    for (i=0; i<ARR.length; i++) 
    {
        options += tag_option(ARR[i], ARR[i]);
    }
    O("SELECTED_DOCTYPE").innerHTML = options;
}

function create_selector(ARR)
{
    let options = "";
    let i = 0;

    options = tag_option(CHECK_ALL, "Все");
    for (i=0; i<TABLE_COLUMNS.length; i++) 
    {
        options += tag_option(TABLE_COLUMNS[i], ALT_T_COLUMNS[i]);
    }
    for (let j=0; j<SPEC_COLUMNS.length; j++) 
    {
        options += tag_option(SPEC_COLUMNS[i], ALT_T_COLUMNS[i+j]);
    }
    O("SELECTED_COLUMN").innerHTML = options;
}


/*
		
		Получить расширение файла
		Проверить список на наличие значения
		Найти строки пользователя с нужными критериями

*/

function file_extension(Url)
{
    parts = Url.split("/").pop().split(".");
    return parts[parts.length-1];
}

function check_occurrence(ARR, filter)
{
    for (let key in ARR) 
    {
        if ( (ARR[key]).toLowerCase().includes(filter) )
        {
            return true;
        }
    }
    return false;
}

function check_date(from, to, date)
{
    date = new Date(date);

    if (from < date && date < to)
        return true
    else
        return false
}

X = [];
function find(data)
{

    X = data;
    console.log(data);
    let docs = [];

    create_table_header();

    // Здесь можно задать фильтр по пользователю
    // В данном случае идентификатор пользователя - email
    user_mail = "(barminka@otchet.pro)";
    user_mail = user_mail.substring(1, user_mail.length - 1);

    column      = O("SELECTED_COLUMN").value;
    filter      = O("KEYWORD").value.toLowerCase();
    doc_filter  = O("SELECTED_DOCTYPE").value.toLowerCase();

    from_date = new Date(O("from_date").value);
    to_date   = new Date(O("to_date").value);

    create_selector(data[0]);

    for (i=0; i < data.length; i++)
    {
        if (data[i][USER_COLUMN] == user_mail) 
        {  
            if (column == CHECK_ALL && check_occurrence(data[i], filter))
            {
                if ((data[i][DOC_TYPE]).toLowerCase().includes(doc_filter))
                {
                    if (check_date(from_date, to_date, data[i][DATE_COLUMN]))
                    {
                        print_result(data[i]);
                    }
                }
            }
            else if (column != CHECK_ALL)
            {
                if ((data[i][column]).toLowerCase().includes(filter))
                {
                    if ((data[i][DOC_TYPE]).toLowerCase().includes(doc_filter))
                    {
                        if (check_date(from_date, to_date, data[i][DATE_COLUMN]))
                        {
                            print_result(data[i]);
                        }
                    }
                }
            }
        }

        doc = file_extension(data[i][DOC_TYPE]);
        if (!docs.includes(doc))
        {
            docs.push(doc);
        }
    }

    create_file_selector(docs);
}
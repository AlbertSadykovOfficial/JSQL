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

function find(data)
{

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
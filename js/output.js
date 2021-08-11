/**
*       Получить объект по id
*       (Для краткости и удобочитаемости)
*/
function O(i)
{
   return typeof i == 'object' ? i : document.getElementById(i);
}


/*      
*   Заполнение таблицы
*	Создать шапку таблицы
*   Создать выпадающий список колонок
*/
function print_result_as_array(headers, alt_headers, data)
{

    let context = "";
    let sub_context = "";

    print_table_header(alt_headers);
    print_selector(headers, alt_headers);

    for (let i=0; i < data.length; i++)
    {
        sub_context = "";
    	for (let j=0; j < data[i].length; j++)
    	{
            sub_context += tag_td(data[i][j]);
    	}
    	context += tag_tr(sub_context);
    }
    
    O('MAIN_TABLE').insertAdjacentHTML('beforeEnd', context);
}


function print_table_header(HEADERS)
{
    let table_header = "";
    
    for (let i=0; i < HEADERS.length; i++)
    {
        table_header += tag_th(HEADERS[i]);
    }
    
    table_header = tag_tr(table_header);
    
    O('MAIN_TABLE').innerHTML =  table_header;
}

function print_selector(HEADERS, ALT_HEADERS)
{
    let options = '';
    let CHECK_ALL = '';

    options = tag_option(CHECK_ALL, "Все");
    
    for (let i=0; i<HEADERS.length; i++) 
    {
        options += tag_option(HEADERS[i], ALT_HEADERS[i]);
    }

    O("SELECTED_COLUMN").innerHTML = options;
}
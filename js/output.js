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
        context += tag_td(SPEC_COLUMNS[i][2] + DATA[SPEC_COLUMNS[i][1]] + SPEC_COLUMNS[i][3] + DATA[SPEC_COLUMNS[i][0]] + SPEC_COLUMNS[i][4]);
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
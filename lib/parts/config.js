/**
*    Создаем объект библиотеки
*
*/
let JSQL = new JSQL_constructor('1FGhlktidC_5rmwbY7T1z8Jn76feaJtty5fz0IQVJTz4', 
                                'AKfycbyYYihG8l7QthbD8Pcu6M9jYtyv57Q9KWM15iIQhFKEJL06ed7GKo5SCaXzS1_pGxeaDg', 
                                ['main', 'members', 'sandbox']);

/**
*   Коснтруктор объекта библиоетки  
*
*/
function JSQL_constructor(sheet_url, script_url, tables)
{
    __proto__: null, // Отключить ссылки на другие объекты

    this.GOOGLE_SHEET_URL = sheet_url;
    this.GOOGLE_SCRIPT_URL =  script_url,

    this.TABLES = tables;
    
    this.INSERT_VAR = 0;

    this.request_parametrs = {
        function: 'function_name',
        table: 'table_name'
    };

    this.get_sheet_url_by_table_name = function(table_name)
    {   
        for (i=1; i<=this.TABLES.length; i++)
        {
            if (this.TABLES[i-1] == table_name)
            {
                return "https://spreadsheets.google.com/feeds/list/"+this.GOOGLE_SHEET_URL+"/"+ i +"/public/values?alt=json";
            }
        }
        return "https://spreadsheets.google.com/feeds/list/"+this.GOOGLE_SHEET_URL+"/1/public/values?alt=json"
    };


    this.get_script_url = function()
    {
        return "https://script.google.com/macros/s/"+this.GOOGLE_SCRIPT_URL+"/exec";
    };

};
/**
*    Создаем объект библиотеки
*
*/
let JSQL = new JSQL_constructor('AKfycbx_aLxhvDyzScnCWIfX4jyl4dvLpwvJovqwxYZ2D8ybixzE-mhKulJ5vwBj1KsoFqzjAw', 
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

    this.get_sheet_url = function(callback, table_name)
    {   
        return "https://script.google.com/macros/s/"+this.GOOGLE_SHEET_URL+"/exec?callback="+callback+"&table_name="+table_name;
    };


    this.get_script_url = function()
    {
        return "https://script.google.com/macros/s/"+this.GOOGLE_SCRIPT_URL+"/exec";
    };

};
const GOOGLE_SHEET_URL = "1FGhlktidC_5rmwbY7T1z8Jn76feaJtty5fz0IQVJTz4";
const GOOGLE_SCRIPT_URL = "AKfycbyYYihG8l7QthbD8Pcu6M9jYtyv57Q9KWM15iIQhFKEJL06ed7GKo5SCaXzS1_pGxeaDg";

let CHECK_ALL = '';

// Создаем объект без ссылок на другие прототипы, т.е создаем чистый словарь
let GSQL = 
{
    __proto__: null, // Отключить ссылки на другие объекты

    GOOGLE_SHEET_URL :  "1FGhlktidC_5rmwbY7T1z8Jn76feaJtty5fz0IQVJTz4",
    GOOGLE_SCRIPT_URL : "AKfycbyYYihG8l7QthbD8Pcu6M9jYtyv57Q9KWM15iIQhFKEJL06ed7GKo5SCaXzS1_pGxeaDg",
    INSERT_VAR: 0,

    request_parametrs : {
      function: 'function_name',
      table: 'table_name'
    },

    get_sheet_url ()
    {
        return "https://spreadsheets.google.com/feeds/list/"+this.GOOGLE_SHEET_URL+"/1/public/values?alt=json";
    },

    get_script_url()
    {
        return "https://script.google.com/macros/s/"+this.GOOGLE_SCRIPT_URL+"/exec";
    }

};
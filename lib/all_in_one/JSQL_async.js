/**
*    Создаем объект библиотеки (вы можете вынести эту объявление за пределы этого файла)
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


/**
*		Проверка условий 
*
*/
function check_condition(data, condition)
{
		let hit = false;
		let COLUMN 		= '';
		let CONDITION = '';
		let VALUE 		= '';

		for (let i=0; i<condition.length; i++)
		{
				hit = false;
				COLUMN 		= condition[i][0];
				CONDITION = condition[i][1];

				// Если нам передали не массив, а строку, то делаем массив с одним элементом - str
				// Иначе строка будет считаться как массив и программа будет ттерировать по ее бкува.

				condition[i][2] = typeof(condition[i][2]) == 'string' ? [condition[i][2]] : condition[i][2];

				for (let j=0; j<condition[i][2].length; j++)
				{
						VALUE = condition[i][2][j];

						if (CONDITION == '=') {
								if (data[COLUMN] == VALUE) 
											hit = true;
						} else if (CONDITION == '<>' || CONDITION == '!=') {
								if (data[COLUMN] != VALUE) 
											hit = true;
						} else if (CONDITION == '>') {
								if (data[COLUMN] >= VALUE) 
										hit = true;
						} else if (CONDITION == '>') {
								if (data[COLUMN] <= VALUE) 
										hit = true;
						} else if (CONDITION == 'LIKE') {
								if (data[COLUMN].toLowerCase().includes(VALUE.toLowerCase()))
										hit = true;
						} else if (CONDITION == 'from') {
								if (new Date(data[COLUMN]) > VALUE) 
										hit = true;
						} else if (CONDITION == 'to') {
								if (new Date(data[COLUMN]) < VALUE) 
										hit = true;
						}
				}

				if (hit == false)
				{
						return hit;
				}
		}

		return true;
}


/**
*		Отбор нужных столбцов
*
*/
function select_rows(data, rows)
{
		let output = [];

		for (let i=0; i < rows.length; i++)
		{
				output.push(data[rows[i]]);
		}

		return output;
}


/**
*		Приведение имен стобцов к нижнему регистру
*
*/
function condition_cols_to_lower(condition)
{
		for (let i=0; i<condition.length; i++)
		{
				condition[i][0] = condition[i][0].toLowerCase();
		}
		return condition;
}


/**
*		Приведение имен стобцов к нижнему регистру
*
*/
function row_cols_to_lower(rows)
{
		for (let i=0; i<rows.length; i++)
		{
				rows[i] = rows[i].toLowerCase();
		}
		return rows;
}


/*
*		Фильтр массива
*		
*		Получаем массив со всеми данными,
*		Фильтруем его по правилам condition
*		Записываем в выходной массив только те
*		колонки, которые переданы в row 
*
*/
function to_filter_out(data, rows=[], condition=[])
{
		let output = [];
		rows 			= row_cols_to_lower(rows);
		condition = condition_cols_to_lower(condition);
		
		for (let i=0; i < data.length; i++)
		{
				if (check_condition(data[i], condition))
				{
						output.push(select_rows(data[i], rows))
				}
		}

		return output;
}


/*
*		Получение JSON-строки через API Google и фильтрование.
*  	
*		Посылаем асинхронный запрос на получение данных нужной таблицы,
*		После получения фильтруем данные и передаем их наверх в Promise.
*		
*/
async function SELECT(table, rows=[], condition=[])
{
		return new Promise(function(resolve, reject) 
		{
				let xmlhttp;
				
				xmlhttp = new XMLHttpRequest();

				xmlhttp.onreadystatechange = function() 
				{
						if(xmlhttp.readyState == 4 && xmlhttp.status==200)
						{
								// Получаем ответ в виде текста в формате json
								// Извлекаем из текста объект JSON
								// Отправляем данные наверх, в Promise функцию 
								data =	get_object_from_JSON(
												JSON.parse(xmlhttp.responseText)
										);

								resolve(to_filter_out(data, rows, condition));
						}
				};

				xmlhttp.onerror = function() 
				{
						reject(new Error(`Ой-ой, что-то не так в запросе. 
															Проверьте правильность url,
															 подключение к Интернету 
															 или повторите запрос`));
				};
				
				xmlhttp.open("GET", JSQL.get_sheet_url_by_table_name(table), true);
				xmlhttp.send(null);
		});
}


/*
*		Передаем данные на запись в конец таблицы
*/
function INSERT(table, rows=[])
{		
		setTimeout(send_data, (JSQL.INSERT_VAR)*1000, table, 'INSERT', rows);
		JSQL.INSERT_VAR++;
}


/*
*		Посылаем асинхронный запрос на полчение идентификаторрв тех строк,
*		которые удовлетворяют условию condition.
*		
*		Добавляем массив полученных идентификаторов в запрос на обновление.
*
*		Отправляем команду - обновить
*/
async function UPDATE(table, rows=[], condition=[])
{
		let ids = await SELECT(table, ["id"], condition);
		rows.push([ 'id', JSON.stringify(ids.flat())]);
		send_data(table, 'UPDATE', rows);
}


/*
*		Посылаем асинхронный запрос на полчение идентификаторрв тех строк,
*		которые удовлетворяют условию condition.
*		
*		Формируем массив полученных идентификаторов в запрос на удаление.
*		ids.flat() - преобразуем 2-мерный массив в одноменрый
*
*		Передаем их на удаление
*/
async function DELETE(table, condition=[])
{
		let ids = await SELECT(table, ["id"], condition);
		send_data(table, 'DELETE', [['id', JSON.stringify(ids.flat())]]);
}


/*
*		Вызываем SELECT
*		Считаем кол-во его строк
*/
async function COUNT(table, condition=[])
{
		let data = await SELECT(table, ["id"], condition);
		return data.length;
}


/**
*		Полученем объект нужного формата из JSON	
*  	
*		Google через API к таблице выдает не чистые, 
*		отформатированные данные, какие у нас в таблице.
*		
*		Вместе с нашими данными, google посылает вспомогательную
*		информацию, которая нам не нужна.
*		К данным же чиста из таблице google приписывает кострукцию
*		(my$) к имени наших столбцов из таблицы, 
*		поэтому ($) выступает идентификатором нужного нам ключа. 
*
*		Парсим JSON объект, выбираем только те ключи, значение 
*		которых включает ($).
*
*		Возвращаем объект с данными из талицы.
*/
function get_object_from_JSON(json_obj)
{
		let keys		= []
		let result	= [];
		let obj 		= new Object();
		let unfiltred_key = '';

		json_obj = json_obj.feed.entry;

		// Создать ассоциативный массив (ссылки)
		for (let key in json_obj[0])
		{
				unfiltred_key = key.split('$')
				if (unfiltred_key[1] != undefined)
				{
						keys.push(key)
				}
  	}

		for (let i=0; i < json_obj.length; i++)
		{
				obj = new Object();
				keys.forEach(
						function callbackFn(key) 
						{
								obj[key.split('$')[1]] = json_obj[i][key].$t;
						}
				);
				result[i] = obj;
		}
		return result;
}


/**
*		Отправка данных на Google Apps Script
*  	
*		Отправка данных проихсодит так:
*			1) Создаем форму
*			2) Устанавливаем имена параметров и параметры
*			3) Провоцируем отправку формы в iframe, 
*				 чтобы не перезагружать страницу
*
*			Почему не AJAX как при получении?
*				Потому что так не получается отправить запрос
*				происходит блокировка запроса (вроде со стороны гугла),
*				В случае с iframe мы обходим это ограничения
*		
*/
function send_data(TABLE, FUNCTION, data)
{
		let form = document.createElement('form');
		let id = Math.random(); // ГЕНЕРИРУЕМ случайный id, чтобы создать несколько iframe, а потом удалить их

		form.id = 'send_data_to_google';
		form.action = JSQL.get_script_url();
		form.method = 'POST';
		form.target = 'request_to_sheet_' + id;

		form.innerHTML = tag_input(FUNCTION, JSQL.request_parametrs.function) +
										 tag_input(TABLE, JSQL.request_parametrs.table) + 
										 input_section(data) + 
										 "<input id='submit_and_send' type='submit'>";

		document.getElementsByTagName('body')[0].append(form);
		document.getElementsByTagName('body')[0].insertAdjacentHTML('beforeEnd', `
					<div id='${id}' style="display: none !important" name='${FUNCTION}_ELEMENT' >
							<iframe name="request_to_sheet_${id}" src="#">
									Your browser does not support inline frames.
							</iframe>
					</div>
		`);

		form.submit();
		setTimeout(delete_iframe, 5000, id);
		document.getElementById('send_data_to_google').remove();
}


/**
*		Удаляем созданный iframe по id
*		
*/
function delete_iframe(id)
{
		document.getElementById(id).remove();
}


/**
*		Конструктор тега input
*		
*/
function tag_input(value, name)
{
    return "<input type='text' name='"+name+"' value='"+ value +"' >";
}


/**
*		Конструктор input-секции из массива стобцов-значений
*		
*/
function input_section(data)
{
		let output = '';

		for (let i=0; i < data.length; i++)
		{
				// Переводим name в нижний регистр, чтобы удобно было выбирать
				// по ключу в google script.  
				output += tag_input(data[i][1], data[i][0].toLowerCase());
		}
		output += tag_input('authSuccess', 'jsonpCallback');

		return output;
}
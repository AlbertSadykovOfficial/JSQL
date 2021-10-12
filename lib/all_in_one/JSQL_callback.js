/**
*    Создаем объект библиотеки (вы можете вынести это объявление за пределы этого файла)
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
*		Получаем массив всех значений таблицы - data
*		Приводим названия стобцов к нижнему регистру.
*		Проверяем выполнение условий.
*		
*		Если условие выполняется для строки, 
*		то извлекаем нужные нам столбцы из строки 
*		и записываем их в выхожной массив.
*		
*/
function SELECT(data, rows=[], condition=[])
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
*		Передаем данные на запись в конец таблицы
*/
function INSERT(table, rows=[])
{		
		setTimeout(send_data, (JSQL.INSERT_VAR)*1000, table, 'INSERT', rows);
		JSQL.INSERT_VAR++;
}


/*
*		Выбрали id строк, удовлетваряющих условиям
*		Внесли все id в массив row
*		Отправляем команду - обновить
*/
function UPDATE(data, table, rows=[], condition=[])
{
		let ids = SELECT(data, ["id"], condition);
		rows.push([ 'id', JSON.stringify(ids.flat())]);
		send_data(table, 'UPDATE', rows);
}


/*
*		Выбрали id строк, удовлетваряющих условиям
*		Передаем их на удаление
*/
function DELETE(data, table, condition=[])
{
		let ids = SELECT(data, ["id"], condition);
		send_data(table, 'DELETE', [['id', JSON.stringify(ids.flat())]]);
}


/*
*		Логика такая же как и у SELECT,
*		но мы не хватаем строки, которые удовлетворяют условию,
*		а просто увеличиваем счетчик на 1 при выполнении условий.
*/
function COUNT(data, condition=[])
{
		let output = [];
		let count = 0;

		condition = condition_cols_to_lower(condition);

		for (let i=0; i < data.length; i++)
		{
				if (check_condition(data[i], condition))
				{
						count++;
				}
		}

		return count;
}


/**
*		Получение данных с сервера
*   
*		Подход получения данных через 
*		инъекцию script помогает
*		обойти CORS-политику.
*		
*/
function queryJSQL(error_f, success_f, table_name)
{
		let script = document.createElement('script');
		script.classList.add(...['DELETE_ME']);
		script.src = JSQL.get_sheet_url(success_f.name, table_name);
		document.body.append(script);

		setTimeout(garbage_collection, 3000);
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
					<div id='${id}' class="DELETE_ME" style="display: none !important" name='${FUNCTION}_ELEMENT' >
							<iframe name="request_to_sheet_${id}" src="#">
									Your browser does not support inline frames.
							</iframe>
					</div>
		`);

		form.submit();
		setTimeout(garbage_collection, 5000);
		document.getElementById('send_data_to_google').remove();
}


/**
*		Сборка мусора 
*
*		Мусор считается любой элемент с классом DELETE_ME
*/
function garbage_collection()
{
		Array.prototype.slice.call(document.getElementsByClassName('DELETE_ME')).map(function(elem){ elem.remove() });
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
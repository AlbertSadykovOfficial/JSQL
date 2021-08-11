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
*		Получение JSON-строки через API Google.
*  	
*		Посылаем асинхронный запрос по полученному url,
*		возвращаем Promise
*/
function extract_data_from_google_promise(url) 
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
								resolve(
										get_object_from_JSON(
												JSON.parse(xmlhttp.responseText)
										)
								);
						}
				};

				xmlhttp.onerror = function() 
				{
						reject(new Error(`Ой-ой, что-то не так в запросе. 
															Проверьте правильность url,
															 подключение к Интернету 
															 или повторите запрос`));
				};

				xmlhttp.open("GET", url, true);
				xmlhttp.send(null);
		});
}


/**
*
*		Получаем данные из google-таблицы, когда придет ответ:
*		Посылаем данные на обработку в callback-функцию success_f
*		Если возникли ошибки, вызываем callback-функцию error_f.
*
*/
function queryJSQL(error_f, success_f, table_name)
{
			extract_data_from_google_promise(JSQL.get_sheet_url_by_table_name(table_name))
				.then(data => 
						{
								success_f(data); // example.js
								JSQL.INSERT_VAR = 0;
						},
						error => 
						{
								error_f(`Message from Promise (Rejected): ${error}`);
						}
				);
}
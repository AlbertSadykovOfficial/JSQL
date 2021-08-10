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
async function SELECT_A(table, rows=[], condition=[])
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
				
				xmlhttp.open("GET", GSQL.get_sheet_url_by_table_name(table), true);
				xmlhttp.send(null);
		});
}


/*
*		Передаем данные на запись в конец таблицы
*/
function INSERT_A(table, rows=[])
{		
		setTimeout(send_data, (GSQL.INSERT_VAR)*1000, table, 'INSERT', rows);
		GSQL.INSERT_VAR++;
}


/*
*		Посылаем асинхронный запрос на полчение идентификаторрв тех строк,
*		которые удовлетворяют условию condition.
*		
*		Добавляем массив полученных идентификаторов в запрос на обновление.
*
*		Отправляем команду - обновить
*/
async function UPDATE_A(table, rows=[], condition=[])
{
		let ids = await SELECT_A(table, ["id"], condition);
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
async function DELETE_A(table, condition=[])
{
		let ids = await SELECT_A(table, ["id"], condition);
		send_data(table, 'DELETE', [['id', JSON.stringify(ids.flat())]]);
}


/*
*		Вызываем SELECT
*		Считаем кол-во его строк
*/
async function COUNT_A(table, condition=[])
{
		let data = await SELECT_A(table, ["id"], condition);
		return data.length;
}
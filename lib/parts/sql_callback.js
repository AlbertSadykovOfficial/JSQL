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
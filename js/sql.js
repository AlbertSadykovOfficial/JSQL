
/*

		rows, conition == {} -> * - Все

		rows =  {"name": ['Kevin', 'Erlich', 'Susi'], "old": ">5"};

		function query(table, command, rows = {}, values = {}, condition = {})
		{
				console.log(table, command, rows , condition);
		}

		function SELECT(table, rows=[], condition={})

		function INSERT(table, rows=[], values=[])
		function DELETE(table, rows=[], values={})
		function UPDATE(table, rows=[], values=[], rows_condition=[], condition=[])

		Есть у каждлого: Команда, Таблица, строки.

		SELECT, DELETE - ЕСТЬ условия  (condition)
		INSERT, UPDATE - Есть значения  
		UPDTE - ДОП есть Условие
		ПРИМЕРЫ:

		Простой запрос:
			Команда + { поле1, поле2 } + Таблица 

		Запрос посложнее:


		SELECT * FROM workers WHERE id>3
		SELECT * FROM workers WHERE id!=3
		SELECT id, name, age FROM workers

		DELETE FROM имя_таблицы WHERE условие
		DELETE FROM workers WHERE id=2


		UPDATE имя_таблицы SET поле1=значение1, поле2=значение2, поле3=значение3... WHERE условие_по_которому_следует_выбрать_строки
		UPDATE workers SET age=30, salary=1000 WHERE id=1
		UPDATE workers SET name='Коля' WHERE name='Петя'

		SELECT COUNT(*) FROM имя_таблицы WHERE условие
		SELECT COUNT(*) as count FROM workers WHERE age=23

*/
/*
		INSERT INTO имя_таблицы SET поле1=значение1, поле2=значение2, поле3=значение3...
		INSERT INTO имя_таблицы (поле1, поле2...) VALUES (значение1, значение2...)
		INSERT INTO workers SET name='Вася', age=23, salary=500
		INSERT INTO workers (name, age, salary) VALUES ('Вася', 23, 500)
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


function select_rows(data, rows)
{
		let output = [];

		for (let i=0; i < rows.length; i++)
		{
				output.push(data[rows[i]]);
		}

		return output;
}


function condition_cols_to_lower(condition)
{
		for (let i=0; i<condition.length; i++)
		{
				condition[i][0] = condition[i][0].toLowerCase();
		}
		return condition;
}


function row_cols_to_lower(rows)
{
		for (let i=0; i<rows.length; i++)
		{
				rows[i] = rows[i].toLowerCase();
		}
		return rows;
}


/*
		Получаем массив всех значений таблицы - data
		Приводим названия стобцов к нижнему регистру.
		Проверяем выполнение условий.
		
		Если условие выполняется для строки, 
		то извлекаем нужные нам столбцы из строки 
		и записываем их в выхожной массив.
		
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
		Передаем данные на запись в конец таблицы
*/
let INSERT_VAR = 0;
function INSERT(table, rows=[])
{		
		setTimeout(send_data, INSERT_VAR*1000, 'TABLE_HASH', 'INSERT', rows);
		//send_data('TABLE_HASH', 'INSERT', rows);
		INSERT_VAR++;
}


/*
		Выбрали id строк, удовлетваряющих условиям
		Внесли все id в массив row
		Отправляем команду - обновить
*/
function UPDATE(data, rows=[], condition=[])
{
		let ids = SELECT(data, ["id"], condition);
		rows.push([ 'id', JSON.stringify(ids.flat())]);
		send_data('TABLE_HASH', 'UPDATE', rows);
}


/*
		Выбрали id строк, удовлетваряющих условиям
		Передаем их на удаление
*/
function DELETE(data, condition=[])
{
		let ids = SELECT(data, ["id"], condition);
		send_data('TABLE_HASH', 'DELETE', [['id', JSON.stringify(ids.flat())]]);
}


/*
		Логика такая же как и у SELECT,
		но мы не хватаем строки, которые удовлетворяют условию,
		а просто увеличиваем счетчик на 1 при выполнении условий.
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


function O(i)
{
   return typeof i == 'object' ? i : document.getElementById(i);
}


/*
        
        Запрос к Google Таблице

*/
document.addEventListener('DOMContentLoaded', function() {
    let table_href = "https://docs.google.com/spreadsheets/d/"+ GOOGLE_SHEET_URL +"/edit?usp=sharing";

    let script_href = "https://script.google.com/d/"+ GOOGLE_SCRIPT_URL +"/edit?usp=sharing";
    O('google_table_href').setAttribute("href", table_href);
    O('google_script_href').setAttribute("href", script_href);

    accept_data();
})
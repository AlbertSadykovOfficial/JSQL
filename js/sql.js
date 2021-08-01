
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

		INSERT INTO имя_таблицы SET поле1=значение1, поле2=значение2, поле3=значение3...
		INSERT INTO имя_таблицы (поле1, поле2...) VALUES (значение1, значение2...)
		INSERT INTO workers SET name='Вася', age=23, salary=500
		INSERT INTO workers (name, age, salary) VALUES ('Вася', 23, 500)

		UPDATE имя_таблицы SET поле1=значение1, поле2=значение2, поле3=значение3... WHERE условие_по_которому_следует_выбрать_строки
		UPDATE workers SET age=30, salary=1000 WHERE id=1
		UPDATE workers SET name='Коля' WHERE name='Петя'

		SELECT COUNT(*) FROM имя_таблицы WHERE условие
		SELECT COUNT(*) as count FROM workers WHERE age=23

*/
function check_condition(data, condition)
{
		let COLUMN 		= '';
		let CONDITION = '';
		let VALUE 		= '';

		for (let i=0; i<condition.length; i++)
		{
				COLUMN 		= condition[i][0];
				CONDITION = condition[i][1];
				VALUE 		= condition[i][2];
				
				if (CONDITION == '=')
				{
						if (data[COLUMN] != VALUE) 
									return false
				} else if (CONDITION == '>'){
						if (data[COLUMN] <= VALUE) 
								return false
				} else if (CONDITION == '>'){
						if (data[COLUMN] >= VALUE) 
								return false
				} else if (CONDITION == 'LIKE'){
						if (!data[COLUMN].toLowerCase().includes(VALUE.toLowerCase()))
								return false
				} else if (CONDITION == 'from'){
						if (new Date(data[COLUMN]) < condition[i][2]) 
								return false
				} else if (CONDITION == 'to'){
						if (new Date(data[COLUMN]) > condition[i][2]) 
								return false
				}
		}

		return true
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


function array_to_query_string(rows)
{
		let output  = "?";
		for (let i=0; i<rows.length; i++)
		{
				output = output + (rows[i][0] + '=' + rows[i][1]) + '&';
		}
		return output.slice(0,-1);
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


function SELECT(data, rows=[], condition=[])
{
		let output = [];

		condition = condition_cols_to_lower(condition);
		rows 			= row_cols_to_lower(rows);
		
		for (let i=0; i < data.length; i++)
		{
				if (check_condition(data[i], condition))
				{
						output.push(select_rows(data[i], rows))
				}
		}

		return output;
}


function INSERT(table, rows=[])
{
		array_to_query_string(rows);
		request_to_INSERT(rows);
}


function UPDATE(table, rows=[], condition=[])
{
		// Выбрали строки, удовлетваряющие условиям
		id = SELECT(table, ["id"], condition);
		array_to_query_string(rows);
		request_to_update(id, rows);
}


function DELETE(table, condition=[])
{
		// Выбрали строки, удовлетваряющие условиям
		SELECT(table, ["id"], condition);
		request_to_delete(id, rows);
}


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
    let href = "https://docs.google.com/spreadsheets/d/"+ SHEET_URL +"/edit?usp=sharing";
    O('google_href').setAttribute("href", href);

    accept_data();
})
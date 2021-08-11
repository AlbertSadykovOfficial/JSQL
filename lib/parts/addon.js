/**
*		Получить объект по id
*		(Для краткости и удобочитаемости)
*/
function O(i)
{
   return typeof i == 'object' ? i : document.getElementById(i);
}


/**
*		Запрос к Google Таблице при загрузке страницы
*
*/
document.addEventListener('DOMContentLoaded', function() {
    let table_href = "https://docs.google.com/spreadsheets/d/"+ JSQL.GOOGLE_SHEET_URL +"/edit?usp=sharing";

    let script_href = "https://script.google.com/d/"+ JSQL.GOOGLE_SCRIPT_URL +"/edit?usp=sharing";
    O('google_table_href').setAttribute("href", table_href);
    O('google_script_href').setAttribute("href", script_href);

    O('google_table_href2').setAttribute("href", table_href);

		queryJSQL(console.log, select_data, 'main');
})


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
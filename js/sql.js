function main()
{
		let USER_COLUMN = "MAIL";
		let DATE_COLUMN = "Date";
		let DOC_TYPE = "Doc_Type";

    user_mail = "barminka@otchet.pro";

    column = O("SELECTED_COLUMN").value;
    doc_tp = O("SELECTED_DOCTYPE").value.toLowerCase();
    filter = O("KEYWORD").value.toLowerCase();
		
		rows = [USER_COLUMN, DATE_COLUMN];
		table = '1FGhlktidC_5rmwbY7T1z8Jn76feaJtty5fz0IQVJTz4';

		from_date = new Date(O("from_date").value);
    to_date   = new Date(O("to_date").value);

		SELECT(table, [ "User", "City", "Date"], [ 
																								[USER_COLUMN,'=',user_mail], 
																								[DOC_TYPE, 'LIKE', doc_tp],
																								[DATE_COLUMN, 'from', from_date],
																								[DATE_COLUMN, 'to', to_date]
																							]);
    COUNT(table, [                                                                         
										[USER_COLUMN,'=',user_mail], 
										[DOC_TYPE, 'LIKE', doc_tp],
										[DATE_COLUMN, 'from', from_date],
										[DATE_COLUMN, 'to', to_date]]);
}


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
				output = output + (rows[i][0] + '=' + rows[i][1])+'&';
		}
		return output.slice(0,-1);
}


function SELECT(table, rows=[], condition=[])
{
		console.log(table, rows, condition);
		console.log(condition[0][0], condition[0][1], condition[0][2]);

		let output = [];

    for (let i=0; i < data.length; i++)
    {
    		if (check_condition(data[i], condition))
    		{
    				output.push(select_rows(data[i], rows))
    		}
    }
    console.log(output);
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
		SELECT(table, ["id"], condition);
		array_to_query_string(rows);
		request_to_update(id, rows);
}


function DELETE(table, condition=[])
{
		// Выбрали строки, удовлетваряющие условиям
		SELECT(table, ["id"], condition);
		request_to_delete(id, rows);
}


function COUNT(table, condition=[])
{
		let output = [];
		let count = 0;

    for (let i=0; i < data.length; i++)
    {
    		if (check_condition(data[i], condition))
    		{
    				count++;
    		}
    }
    console.log(count);
    return count;
}


function query(SQL_commamd)
{
		SQL_object = parse(SQL_commamd);
}


function parse(SQL_commamd)
{
		SQL_commamd = SQL_commamd.toLowerCase().trim();

		SELECT = 'select';
		INSERT = 'insert';
		UPDATE = 'update';
		DELETE = 'delete';

		const IN = 0;
		object = [];
		
		if (SQL_commamd.indexOf(SELECT) == IN)
				return "SELECT"
		else if (SQL_commamd.indexOf(INSERT) == IN)
				return "INSERT"
		else if (SQL_commamd.indexOf(UPDATE) == IN)
				return "UPDATE"
		else if (SQL_commamd.indexOf(DELETE) == IN)
				return "DELETE"

		return "COMMAND Undefined"
}
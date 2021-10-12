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
function extract_data_from_google_promise1(url) 
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
						reject('aa+' + url);
				};

				xmlhttp.open("GET", url, true);
				xmlhttp.send(null);
		});
}

function help_queryJSQLN(success_f, current_data, prom_arr)
{
		console.log(current_data, prom_arr);
		prom_arr.reduce(function (prev, curr) {
		    return prev.then(curr);
		}, extract_data_from_google_promise1(JSQL.get_sheet_url_by_table_name('main')) )
		.then(
			data => {
		    	current_data.push(data);
		    	prom_arr.shift();
					console.log(prom_arr);
			},
			error_url =>
			{
					console.log(`Message from Promise (Rejected) ${error_url}`);
					help_queryJSQLN(success_f, current_data, prom_arr);
			});
}

function queryJSQLN(error_f, success_f, table_name)
{
		let all_data = [];

			var myAsyncFuncs = [
			 extract_data_from_google_promise1(JSQL.get_sheet_url_by_table_name('main')),
		   extract_data_from_google_promise1(JSQL.get_sheet_url_by_table_name('members')),
		   extract_data_from_google_promise1(JSQL.get_sheet_url_by_table_name('sandbox')),
		];

		myAsyncFuncs.reduce(function (prev, curr) {
		    return prev.then(curr);
		},  extract_data_from_google_promise1(JSQL.get_sheet_url_by_table_name('main')))
		.then(
			data => {
		    	all_data.push(data);
		    	myAsyncFuncs.shift();
					console.log(myAsyncFuncs);
			},
			error_url =>
			{
				error_f(`Message from Promise (Rejected) ${error_url}`);
				help_queryJSQLN(success_f, all_data, myAsyncFuncs);

		});
/*
		extract_data_from_google_promise(JSQL.get_sheet_url_by_table_name(table_name)).
		then(data => 
					{
							success_f(data); // example.js
							JSQL.INSERT_VAR = 0;
					},
					error => 
					{
							error_f(`Message from Promise (Rejected)`);
							queryJSQLN(error_f, success_f, table_name);
					}
			);
*/
}
function queryJSQL1(error_f, success_f)
{
		let tables = [];
		
		for (let i=0; i<JSQL.TABLES.length; i++)
		{
				tables.push(extract_data_from_google_promise(JSQL.get_sheet_url_by_table_name(JSQL.TABLES[i])))
		}

		Promise.all(tables).then(
				values =>
				{
						let data = [];
						for (let i=0; i<JSQL.TABLES.length; i++)
						{
								data[JSQL.TABLES[i]] = values[i];
						}
						console.log(data);
						//success_f(data); // example.js
						JSQL.INSERT_VAR = 0;
				},
				error =>
				{
						error_f(`Message from Promise (Rejected): ${error}`);
				}
		);
}
function queryJSQL2(error_f, success_f)
{
			extract_data_from_google_promise(JSQL.get_sheet_url_by_table_name('main'))
			.then(data => 
					{
							extract_data_from_google_promise(JSQL.get_sheet_url_by_table_name('members'));
					},
					error => 
					{
							console.log(`Message from Promise (Rejected): ${error}`);
					}
			).then(data=>
				{
						extract_data_from_google_promise(JSQL.get_sheet_url_by_table_name('sandbox'))
				},
				error => 
				{
						console.log(`Message from Promise (Rejected): ${error}`);
				})
			.then(data =>{ console.log(data)});
}
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
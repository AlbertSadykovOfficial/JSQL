/*
*		
*		Все функции, кроме INSERT работают на Promise:
*
*				SELECT, COUNT - делают асинхронный запрос, который возвращает Promise
*				UPDATE, DEETE сначала делают SELECT запрос, чтобы получить данные, соответсвенно-тоже Promise
*
*				INSERT - просто отсылает данные через iframe.
*/
async function async_example()
{
		// Пример Извлечения данных и подсчета
		let data = await SELECT('sandbox', ['UserName', 'level'], [['id', '!=', '10']]);
		let count= await COUNT('sandbox', [['id', '!=', '10']]);
		console.log(data, count); 

		// Обновляем данные
		await UPDATE('sandbox', [['level', 'oVER 999']], [
													['Username', 'LIKE', 'Имба'],
												]);

		INSERT('sandbox', [
										['username', 'Гагарин'],
										['level', 'Cosmos'],
										['say', 'Полет нормальный']
									]);

		// Получим больше данных и выведем их в таблицу
		data = await SELECT('sandbox', ['ID' ,'UserName', 'level', 'say'], [['id', '!=', '10']]);
		console.log(data); 


		// Эта функция выводит данные в таблицу, ее нет в сотсаве библиотеки
		print_result_as_array(['ID' ,'UserName', 'level', 'say'], ['ID', 'Имя', 'Уровень', 'Сказал'], data);
	
}
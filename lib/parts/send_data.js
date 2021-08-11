/**
*		Отправка данных на Google Apps Script
*  	
*		Отправка данных проихсодит так:
*			1) Создаем форму
*			2) Устанавливаем имена параметров и параметры
*			3) Провоцируем отправку формы в iframe, 
*				 чтобы не перезагружать страницу
*
*			Почему не AJAX как при получении?
*				Потому что так не получается отправить запрос
*				происходит блокировка запроса (вроде со стороны гугла),
*				В случае с iframe мы обходим это ограничения
*		
*/
function send_data(TABLE, FUNCTION, data)
{
		let form = document.createElement('form');
		let id = Math.random(); // ГЕНЕРИРУЕМ случайный id, чтобы создать несколько iframe, а потом удалить их

		form.id = 'send_data_to_google';
		form.action = JSQL.get_script_url();
		form.method = 'POST';
		form.target = 'request_to_sheet_' + id;

		form.innerHTML = tag_input(FUNCTION, JSQL.request_parametrs.function) +
										 tag_input(TABLE, JSQL.request_parametrs.table) + 
										 input_section(data) + 
										 "<input id='submit_and_send' type='submit'>";

		document.getElementsByTagName('body')[0].append(form);
		document.getElementsByTagName('body')[0].insertAdjacentHTML('beforeEnd', `
					<div id='${id}' style="display: none !important" name='${FUNCTION}_ELEMENT' >
							<iframe name="request_to_sheet_${id}" src="#">
									Your browser does not support inline frames.
							</iframe>
					</div>
		`);

		form.submit();
		setTimeout(delete_iframe, 5000, id);
		O('send_data_to_google').remove();
}


/**
*		Удаляем созданный iframe по id
*		
*/
function delete_iframe(id)
{
		O(id).remove();
}


/**
*		Конструктор тега input
*		
*/
function tag_input(value, name)
{
    return "<input type='text' name='"+name+"' value='"+ value +"' >";
}


/**
*		Конструктор input-секции из массива стобцов-значений
*		
*/
function input_section(data)
{
		let output = '';

		for (let i=0; i < data.length; i++)
		{
				// Переводим name в нижний регистр, чтобы удобно было выбирать
				// по ключу в google script.  
				output += tag_input(data[i][1], data[i][0].toLowerCase());
		}
		output += tag_input('authSuccess', 'jsonpCallback');

		return output;
}
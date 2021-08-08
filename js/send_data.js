function send_data(TABLE, FUNCTION, data)
{
		let form = document.createElement('form');
		let id = Math.random(); // ГЕНЕРИРУЕМ случайный id, чтобы создать несколько iframe, а потом удалить их

		form.id = 'send_data_to_google';
		form.action = GSQL.get_script_url();
		form.method = 'POST';
		form.target = 'request_to_sheet_' + id;

		form.innerHTML = tag_input(FUNCTION, GSQL.request_parametrs.function) +
										 tag_input(TABLE, GSQL.request_parametrs.table) + 
										 input_section(data) + 
										 "<input id='submit_and_send' type='submit'>";

		O('TECHNICAL_DIV').append(form);
		O('TECHNICAL_DIV').insertAdjacentHTML('beforeEnd', `
					<div id='${id}' style="display: none" name='${FUNCTION}_ELEMENT' >
							<iframe name="request_to_sheet_${id}" src="#">
									Your browser does not support inline frames.
							</iframe>
					</div>
		`);

		form.submit();
		setTimeout(delete_iframe, 5000, id);
		O('send_data_to_google').remove();
}


function delete_iframe(id)
{
		O(id).remove();
}


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
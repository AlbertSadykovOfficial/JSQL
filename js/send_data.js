function send_data(TABLE_HASH, FUNCTION, data)
{
		let form = "";
		let SCRIPT_LINK = 'https://script.google.com/macros/s/AKfycbyYYihG8l7QthbD8Pcu6M9jYtyv57Q9KWM15iIQhFKEJL06ed7GKo5SCaXzS1_pGxeaDg/exec';

		form = `<form id="send_data_to_google" target="request_to_sheet" action="" method="POST">`;
		form += "<input type='text' name='func' value='"+ FUNCTION +"' >";

		form += input_section(data);

		form += `<input id='submit_and_send' type="submit">
					</form>
					<div style="display: none">
							<iframe name="request_to_sheet" src="#">
									Your browser does not support inline frames.
							</iframe>
					</div>
		`;

		O('TECHNICAL_DIV').innerHTML = form;
		O('send_data_to_google').setAttribute('action', SCRIPT_LINK);
		O('submit_and_send').click();
		O('send_data_to_google').remove();
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
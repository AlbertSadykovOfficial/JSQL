function process_data(data)
{		
		let MAIL_COLUMN			= "MAIL";
		let USERNAME_COLUMN	= 'User';
		let CITY_COLUMN			= 'City';
		let DATE_COLUMN			= "Date";
		let DOC_TYPE				= "Doctype";

    let user_mail = "barminka@otchet.pro";

    let column = O("SELECTED_COLUMN").value;
    let filter = O("KEYWORD").value.toLowerCase();

		let from_date = new Date(O("from_date").value);
    let to_date   = new Date(O("to_date").value);

		let result = [];

		let COLS 	= [USERNAME_COLUMN, CITY_COLUMN, DATE_COLUMN, DOC_TYPE];
		let ALT_C	= ['Пользователь', 'Город', 'Дата', 'Документ'];
		
		result = SELECT(data, COLS, [ 
																	[MAIL_COLUMN,'=', user_mail],
																	[CITY_COLUMN,'LIKE', filter],
																	[DATE_COLUMN, 'from', from_date],
																	[DATE_COLUMN, 'to', to_date]
																]);
		console.log(
									COUNT(data, [
										[USER_COLUMN,'=',user_mail], 
										[DATE_COLUMN, 'from', from_date],
										[DATE_COLUMN, 'to', to_date]
									])
								);
/*		
		INSERT('TABLE_HASH', [
														['City', 'Moscow'],
														['Image', 'Rat']
												]
					);
*/
		UPDATE('TABLE_HASH', [
												['ID', 9], 
												['City', 'New-York'],
												['Image', 'Bird']
									], []
		);

		print_result_as_array(COLS, ALT_C, result);
}
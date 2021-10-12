function update_data(data)
{
		data = JSON.parse(data);
		let block = document.getElementById('update_example_block');

		let set_column = block.getElementsByClassName('column')[0].value;
		let set_value = block.getElementsByClassName('set_input')[0].value;

		let where_column = 'ID';
		let where_value = block.getElementsByClassName('where_input')[0].value;


		UPDATE(data, 'sandbox', [
															[set_column, set_value],
														],
														[
															[where_column, '=', where_value],
														]
		);
}
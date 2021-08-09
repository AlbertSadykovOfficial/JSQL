function delete_data(data)
{
		let block = document.getElementById('delete_example_block');

		let column = block.getElementsByClassName('column')[0].value;
		let value = block.getElementsByClassName('input_section')[0].value;


		DELETE( data, 'sandbox', [
																[column, 'LIKE', value]
															]);
}
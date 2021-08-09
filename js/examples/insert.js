function insert_data(data)
{
		let block = document.getElementById('insert_example_block');

		let user = block.getElementsByClassName('UserName')[0].value;
		let level = block.getElementsByClassName('level')[0].value;
		let says = block.getElementsByClassName('say')[0].value;


		INSERT('sandbox', [
													['username', user],
													['level', level],
													['say', says]
											]
				);
}
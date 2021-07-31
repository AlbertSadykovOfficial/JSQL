function get_object_from_JSON(json_obj)
{
		let keys = []
		let result = [];
		let obj = new Object();

		json_obj = json_obj.feed.entry;

		// Создать ассоциативный массив (ссылки)
		for (key in json_obj[0])
		{
				a = key.split('$')
				if (a[1] != undefined)
				{
						keys.push(key)
				}
  	}
  	//console.log(keys);

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


let new_data = [];
function extract_data_from_google() 
{
		// let url="https://spreadsheets.google.com/feeds/cells/1FGhlktidC_5rmwbY7T1z8Jn76feaJtty5fz0IQVJTz4/1/public/full?alt=json-in-script";
		let url = "https://spreadsheets.google.com/feeds/list/1FGhlktidC_5rmwbY7T1z8Jn76feaJtty5fz0IQVJTz4/od6/public/values?alt=json";
  
		xmlhttp = new XMLHttpRequest();
  
		xmlhttp.onreadystatechange = function() 
		{
				if(xmlhttp.readyState == 4 && xmlhttp.status==200)
				{
						new_data = get_object_from_JSON(JSON.parse(xmlhttp.responseText));
				}
		};

		xmlhttp.open("GET",url,true);
		xmlhttp.send(null);
}

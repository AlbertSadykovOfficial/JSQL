/*
		
		Создание Тегов

*/
function tag_input(value, name)
{
    return "<input type='text' name='"+name+"' value='"+ value +"' >";
}

function tag_option(value, name)
{
    return "<option value='"+ value +"'>" + name + "</option>";
}

function tag_tr(value)
{
    return "<tr>" + value + "</tr>";
}

function tag_th(value)
{
    return "<th>" + value + "</th>";
}

function tag_td(value)
{
    return "<td>" + value + "</td>";
}
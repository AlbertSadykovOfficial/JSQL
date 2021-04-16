function show_filters()
{
    elems = document.getElementsByClassName("filter_fields");
    if (elems[0].classList.contains('hidden'))
    {
        O("switch").innerText = "-";
        elems[0].classList.remove('hidden');
        elems[1].classList.remove('hidden');
    }
    else
    {
        O("switch").innerText = "+";
        elems[0].classList.add('hidden');
        elems[1].classList.add('hidden');
    }
}
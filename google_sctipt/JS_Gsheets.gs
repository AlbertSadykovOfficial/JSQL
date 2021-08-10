var COLUMNS_LENGTH;
var FIRST_COLUMN;
var LAST_COLUMN;
var HEADER_RANGE;
var SHEET_KEY = '1FGhlktidC_5rmwbY7T1z8Jn76feaJtty5fz0IQVJTz4';

function doPost(e){
    var response = {};
    try 
    {
        var sheet = SpreadsheetApp.openById(SHEET_KEY).getSheetByName(e.parameter.table_name);

        build_header_range(sheet.getLastColumn());

        if      (e.parameter.function_name == 'UPDATE') response = {'result': 'Success ' + UPDATE(e.parameter, sheet)};
        else if (e.parameter.function_name == 'INSERT') response = {'result': 'Success ' + INSERT(e.parameter, sheet)};
        else if (e.parameter.function_name == 'DELETE') response = {'result': 'Success ' + DELETE(e.parameter, sheet)};
        else                                            new Error('Unknown function')
    } catch(err) {
        response = {'error': 'error'};
    } finally {
        return ContentService.createTextOutput(response).setMimeType(ContentService.MimeType.JAVASCRIPT);
    }
}


function UPDATE(data, sheet)
{
    var row;
    var row_num;
    var shift = 2;
    var output = [];
    var id = JSON.parse(data.id);

    var columns = sheet.getRange(HEADER_RANGE).getValues();
    
    for (var i=0; i<id.length; i++)
    {
        output = [];
        row_num = parseInt(id[i]) + shift;
        row = sheet.getRange(FIRST_COLUMN + row_num + ":" + LAST_COLUMN + row_num);
        output[i] = parseInt(id[i]);
        
        output[0] = row.getValues()[0][0];
        for (var j=1; j<columns[0].length; j++)
        {
            output[j] = data[columns[0][j].toLowerCase()];
            if (output[j] == null) output[j] = row.getValues()[0][j];
        }
        row.setValues([output,]);
    }

    return 'UPDATE';
}


function INSERT(data, sheet)
{
    var shift = 1; // (+1),Потому что мы-новая строка.
    var output = [];
    var columns = sheet.getRange(HEADER_RANGE).getValues();

    output.push(sheet.getLastRow() - shift);
    for (var i=1; i<columns[0].length; i++)
    {
        output[i] = data[columns[0][i].toLowerCase()];
        if (output[i] == null) output[i] = 'NULL';
    }

    sheet.appendRow(output);

    return 'INSERT';
}


function DELETE(data, sheet)
{
    var row;
    var row_num;
    var shift = 2;
    var output = [];
    var id = JSON.parse(data.id);
    
    for (var i=0; i<id.length; i++)
    {
        row_num = parseInt(id[i]) + shift;
        row = sheet.getRange(FIRST_COLUMN + row_num + ":" + LAST_COLUMN + row_num);
        output = [row.getValues()[0][0] + '_DELETED'];
        output[COLUMNS_LENGTH] = '';
        row.setValues([ output,]);
    }

    return 'DELETE';
}

function build_header_range(last_column_num)
{
    COLUMNS_LENGTH = last_column_num-1;

    FIRST_COLUMN = 'A'
    LAST_COLUMN = String.fromCharCode(64 + last_column_num);

    HEADER_RANGE = FIRST_COLUMN + '1:'+ LAST_COLUMN + '1';
}
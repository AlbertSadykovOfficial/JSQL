var SHEET_KEY = "1FGhlktidC_5rmwbY7T1z8Jn76feaJtty5fz0IQVJTz4";

function doGet(e){
  var sheet = SpreadsheetApp.openById(SHEET_KEY);
  return ContentService.createTextOutput(
            e.parameter.callback + 
            "("+
                JSON.stringify(
                    db_getJSON(sheet, e.parameter.table_name)
                )+
            ")"
            ).setMimeType(ContentService.MimeType.JAVASCRIPT);
}


function db_getJSON(ss, table) {
  var sheet = ss.getSheetByName(table);
  var rowsData = getRowsData(sheet);
  var result = JSON.stringify(rowsData);
  return result
}


function getRowsData(sheet) {
  var headersRange = sheet.getRange(1, 1, 1, sheet.getLastColumn());
  var headers = headersRange.getValues()[0];
  var dataRange = sheet.getRange(2, 1, sheet.getLastRow(), sheet.getLastColumn());
  return getObjects(dataRange.getValues(), normalizeHeaders(headers));
}


function getObjects(data, keys) {
  var objects = [];
  for (var i = 0; i < data.length; ++i) {
    var object = {};
    var hasData = false;
    for (var j = 0; j < data[i].length; ++j) {
      var cellData = data[i][j];
      if (isCellEmpty(cellData)) {
        continue;
      }
      object[keys[j]] = cellData;
      hasData = true;
    }
    if (hasData) {
      objects.push(object);
    }
  }
  return objects;
}


function getColumnsData(sheet, range, rowHeadersColumnIndex) {
  rowHeadersColumnIndex = rowHeadersColumnIndex || range.getColumnIndex() - 1;
  var headersTmp = sheet.getRange(range.getRow(), rowHeadersColumnIndex, range.getNumRows(), 1).getValues();
  var headers = normalizeHeaders(arrayTranspose(headersTmp)[0]);
  return getObjects(arrayTranspose(range.getValues()), headers);
}


function normalizeHeaders(headers) {
  var keys = [];
  for (var i = 0; i < headers.length; ++i) {
    var key = normalizeHeader(headers[i]);
    if (key.length > 0) {
      keys.push(key);
    }
  }
  return keys;
}


function normalizeHeader(header) {
  var key = "";
  var upperCase = false;
  for (var i = 0; i < header.length; ++i) {
    var letter = header[i];
    if (letter == " " && key.length > 0) {
      upperCase = true;
      continue;
    }
    if (!isAlnum(letter)) {
      continue;
    }
    if (key.length == 0 && isDigit(letter)) {
      continue; // first character must be a letter
    }
    if (upperCase) {
      upperCase = false;
      key += letter.toUpperCase();
    } else {
      key += letter.toLowerCase();
    }
  }
  return key;
}

 
function isCellEmpty(cellData) {
  return typeof(cellData) == "string" && cellData == "";
}


function isAlnum(char) {
  return char >= 'A' && char <= 'Z' ||
    char >= 'a' && char <= 'z' ||
    isDigit(char);
}


function isDigit(char) {
  return char >= '0' && char <= '9';
}


function arrayTranspose(data) {
  if (data.length == 0 || data[0].length == 0) {
    return null;
  }
  var ret = [];
  for (var i = 0; i < data[0].length; ++i) {
    ret.push([]);
  }

  for (var i = 0; i < data.length; ++i) {
    for (var j = 0; j < data[i].length; ++j) {
      ret[j][i] = data[i][j];
    }
  }
  return ret;
}
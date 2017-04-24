function jsonToFaqJs(jsonStr) {
    return "var faq = " + jsonStr + ";";
}

//var csv is the CSV file with headers
function CSV2JSON(csv) {

    var lines = csv.split("\r\n");

    var result = [];

    var headers = lines[0].split(",");

    for (var i = 1; i < lines.length; i++) {

        var obj = {};
        var currentline = lines[i].split(",");

        for (var j = 0; j < headers.length; j++) {
            obj[headers[j]] = currentline[j];
        }

        result.push(obj);

    }

    return JSON.stringify(result); //JSON
}

//var objArray is the JSON array
function JSON2CSV(objArray) {
    var
        getKeys = function (obj) {
            var keys = [];
            for (var key in obj) {
                keys.push(key);
            }
            return keys.join();
        },
        array = typeof objArray != 'object' ? JSON.parse(objArray) : objArray,
        str = '';

    for (var i = 0; i < array.length; i++) {
        var line = '';
        for (var index in array[i]) {
            if (line != '') line += ','

            line += array[i][index];
        }

        str += line + '\r\n';
    }

    str = getKeys(objArray[0]) + '\r\n' + str;

    return str;
}

function downloadStringAsType(str, type, filename) {
    var a = document.createElement('a');
    var blob = new Blob([str], { 'type': type });
    a.href = window.URL.createObjectURL(blob);
    a.download = filename;
    a.click();

    return true;
}
function downloadStringAsCSV(str) {
    return downloadStringAsType(str, 'application\/octet-stream', 'faq.csv');
}

function downloadStringAsJsFile(str) {
    return downloadStringAsType(str, 'application\/javascript', 'faq.js');
}

function handleFiles(files) {
    // Check for the various File API support.
    if (window.FileReader) {
        // FileReader is supported.
        getAsText(files[0]);
    } else {
        alert('FileReader is not supported in this browser.');
    }
}

function getAsText(fileToRead) {
    var reader = new FileReader();
    // Read file into memory as UTF-8      
    reader.readAsText(fileToRead);
    // Handle errors load
    if (fileToRead.endsWith(".js")) {
        reader.onload = loadHandlerJs;
    }
    else {
        reader.onload = loadHandlerCSV;
    }

    reader.onerror = errorHandler;
}

function loadHandlerCSV(event) {
    var csv = event.target.result;
    CSV2JSON(csv);
}

function loadHandlerJS(event) {
    var json = event.target.result;
    JSON2CSV(json);
}


function errorHandler(evt) {
    if (evt.target.error.name == "NotReadableError") {
        alert("Can't read file!");
    }
}
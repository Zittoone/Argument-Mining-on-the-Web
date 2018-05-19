let reader


window.onload = init;


function init() {
    console.log("page chargee");
}


function printdoc() {

    var files = document.getElementById('files').files;
    if (!files.length) {
        alert('Please select a file!');
        return;
    }

    var file = files[0];
    var start = 0;
    var stop = file.size - 1;

    var reader = new FileReader();
    reader.onloadend = function(evt) {
        if (evt.target.readyState == FileReader.DONE) { // DONE == 2
          document.getElementById('byte_content').textContent = evt.target.result;
        }
    }
    var blob = file.slice(start, stop + 1);
    reader.readAsBinaryString(blob);
}
let reader
let files,elemID,labelID

window.onload = init;


function init() {
    console.log("page chargee");
}


function printdoc(type) {

    if (type == 'txt'){
        elemID = 'txtFiles';
    }else if (type == 'ann'){
        elemID = 'annFiles';
    }
    labelID = elemID + 'Label';

    files = document.getElementById(elemID).files;
    if (!files.length) {
        alert('Please select a file!');
        return;
    }

    var file = files[0];
    var reader = new FileReader();
    reader.onloadend = function(evt) {
        if (evt.target.readyState == FileReader.DONE) { // DONE == 2
          document.getElementById('textOutput').textContent = evt.target.result;
        }
        document.getElementById(labelID).textContent = file.name
        document.getElementById("titre").textContent = file.name
    }
    reader.readAsText(file);
}

function annotate(text){
    // retrieve .ann in var []
    // analyse 
}

function retrieve (title){
    // search for title
}

function colorize(){
    // change color of text
}
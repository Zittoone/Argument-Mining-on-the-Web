let reader;
let files, file, elemID, labelID, lines;
let indexes, parts;
window.onload = init;


//let regex1 = new RegExp();


function init() {
    console.log("page chargee");
    lines = []
    parts = []
    // parts [line] [ID,type,indexDebut, indexFin]
}


function printdoc(type) {

    if (type == 'txt') {
        elemID = 'txtFiles';
    } else if (type == 'ann') {
        elemID = 'annFiles';
    }
    labelID = elemID + 'Label';

    files = document.getElementById(elemID).files;
    if (!files.length) {
        alert('Please select a file!');
        return;
    }

    file = files[0];
    reader = new FileReader();
    reader.onloadend = function (evt) {
        if (evt.target.readyState == FileReader.DONE) { // DONE == 2
            document.getElementById('textOutput').textContent = evt.target.result;
        }
        lines = this.result.split('\n');
        document.getElementById(labelID).textContent = file.name
        document.getElementById("titre").textContent = file.name
    }
    reader.readAsText(file);
    retrieveIndexes();
}

function annotate() {
    // verify .ann is the same title as the mothafucking txt ya
    // retrieve .ann & isolate infos in var [] to know where to put color
    // read txt file searching for these arguments mothafucka
    // write in new file the colored txt


    // print that mothafucka
    // printdoc('rep');
}

function retrieveIndexes() {
    for (var line = 0; line < lines.length; line++) {
        // premiere partie de ligne = ID
        // deuxieme partie = couleur
        // troisieme partie = range
        if (lines[line][0] == 'T') {
            parts[line] = lines[line].split('	', 2);
            parts[line][1] = parts[line][1].split(' ');
        } else if (lines[line][0] == 'A') {

        }

        console.log(' end line')

    }


}

function colorize(type, range) {
    // change color of text

}

function verifyDocs() {
    // check if titles are the same

    console.log("good mothafuckass");
}
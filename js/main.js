let reader;
let files, file, elemID, labelID, txtlines, annlines;
let parts;

let regex2 = new RegExp('\\s');

window.onload = init;

function init() {
    console.log("page chargee");
    txtlines = [];
    annlines = [];
    parts = [];
    // parts [line] [ID,type,indexDebut,indexFin]
}

function annotate() {
    // verify .ann is the same title as the mothafucking txt ya
    // slicing
    // read txt file searching for these arguments mothafucka
    // write in new file the colored txt
    document.getElementById("titre").textContent = 'annotated doc';

    slicing(annlines);
    printdoc('txt');
    
    // print that mothafucka
}

function slicing(tab) {
    reader = new FileReader();
    reader.onloadend = function (evt) {
        tab = this.result.split('\n');
    }
    for (var line = 0; line < tab.length; line++) {
        // separer selon le genre (A,T,R)
        var temp = tab[line][0]
        if (temp == 'T') {
            // ID, type, debut, fin
            parts[line] = tab[line].split(regex2, 4);

        } else if (temp == 'A') {
            // ID1, stance, ID2, opinion
            parts[line] = tab[line].split(regex2, 4);

        } else if (temp == 'R') {
            // ID, opinion, ID1, ID2
            parts[line] = tab[line].split(regex2, 4);
            /* for (var i = 0; i < parts[line].length ; i++){
                  console.log(parts[line][i])
              }
            */
        }
    }
}

function colorize() {
    // receive parts[line] and colorize depending of type and index
    // change color of text
}

function verifyDocs() {
    // check if titles are the same

    console.log("good mothafuckass");
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
        if (type == 'ann'){
            annlines = this.result.split('\n');
        }
        document.getElementById(labelID).textContent = file.name
        document.getElementById("titre").textContent = file.name
    }
    reader.readAsText(file);
}
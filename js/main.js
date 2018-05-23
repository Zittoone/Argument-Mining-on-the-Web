let reader, reader2;
let files, file, elemID, labelID, slicedtxt, annlines;
let parts;

let regex2 = new RegExp('\\s');
let regex1 = new RegExp("T\\d\\d\*", "g"); // T suivi d'un nombre

window.onload = init;

function init() {
    console.log("page chargee");
    // remet tout a zero
    slicedtxt = [];
    annlines = [];
    parts = [];
    // parts [line] [ID,type,indexDebut,indexFin]
}

function annotate() {
    // verify .ann is the same title as the mothafucking txt ya
    // read txt file searching for these arguments mothafucka
    // write in new file the colored txt

    document.getElementById("titre").textContent = 'annotated doc';
    // slicing
    slicing(annlines);
    txtSlicer();

    let tempStr, start, end, type;
    for (var aline = 0; aline < annlines.length; aline++) {
        console.log(parts[aline])

        // specifier recherche aux 'T'
        if (parts[aline][0] == regex1) { // bug
            tempStr = '';
            type = parts[aline][1]; //bug  idk anymore bruh
            start = parseInt(parts[aline][2]);
            end = parseInt(parts[aline][3]);

            for (var j = start; j < end; j++) {
                tempStr += slicedtxt[j];
            }
            colorize(tempStr, type)
            slicedtxt.splice(start, end - start, tempStr);
        }

    }

    document.getElementById('textOutput').textContent = slicedtxt.join('')

    console.log(document.getElementById('textOutput').textContent)
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
    // donnes stockee dans parts
}

function txtSlicer() {
    // decoupe tout les char pour pouvoir remplacer entre deux index
    reader2 = new FileReader();
    reader2.onloadend = function (evt) {
        slicedtxt = this.result.split('');
    }
}

function colorize(str, type) {

    if (type == 'Premise') {
        // changer en vert
        str.fontcolor("green");

    } else if (type == 'Claim') {
        // changer couleur en orange
        str.fontcolor("orange");

    } else if (type == 'MajorClaim') {
        // changer en rouge
        str.fontcolor("red");
    }
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
        if (type == 'ann') {
            annlines = this.result.split('\n');
        }
        document.getElementById(labelID).textContent = file.name
        document.getElementById("titre").textContent = file.name
    }
    reader.readAsText(file);
}
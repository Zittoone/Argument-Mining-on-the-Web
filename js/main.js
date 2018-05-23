if (!String.prototype.splice) {
    /**
     * {JSDoc}
     *
     * The splice() method changes the content of a string by removing a range of
     * characters and/or adding new characters.
     *
     * @this {String}
     * @param {number} start Index at which to start changing the string.
     * @param {number} delCount An integer indicating the number of old chars to remove.
     * @param {string} newSubStr The String that is spliced in.
     * @return {string} A new string with the spliced substring.
     */
    String.prototype.splice = function(start, delCount, newSubStr) {
        return this.slice(0, start) + newSubStr + this.slice(start + Math.abs(delCount));
    };
}

let texte, annotated;
let wsRegex = new RegExp("\\s+");

window.onload = init;

function init() {
    // console.log("page chargee");
    // remet tout a zero
    slicedtxt = [];
    annlines = [];
    parts = [];

    // parts [line] [ID,type,indexDebut,indexFin]
}

let labels = {"txtFiles":"Choisir le fichier texte", "annFiles":"Choisir le fichier annoté"};

function onFileChange(source) {

    if(source.files.length > 0) {

        let file = source.files[0];

        document.getElementById(source.id + "Label").textContent = file.name
        source.textContent = file.name;

        let ext = file.name.split(".");
        ext = ext[ext.length - 1];

        readFile(file, (event) => {
            if(ext == "ann") {
                processAnnotatedText(event.target.result);
            } else if(ext == "txt") {
                processPlainText(event.target.result);
            }
            processContent();
        });

    } else {
        document.getElementById(source.id + "Label").textContent = labels[source.id]
    }
}

function processAnnotatedText(text) {

    // Split the text into lines
    annotated = text.split("\n");

    // Check if last line is empty
    if(annotated[annotated.length - 1] == "") {
        annotated.pop();
    }
}

function processPlainText(text) {
    texte = text;
}

var color = {
    "Premise":"green",
    "Claim":"orange",
    "MajorClaim":"red"
}

function processContent() {

    colorizeInputs();

    // Process only if the buffers are loaded
    if(annotated == undefined || texte == undefined) {
        return;
    }

    for (let line = 0; line < annotated.length; line++) {
        annotated[line] = annotated[line].split(wsRegex, 4);
        annotated[line][2] = parseInt(annotated[line][2]);
        annotated[line][3] = parseInt(annotated[line][3]);
    }

    annotated.sort((a, b) => {
        return a[2] > b[2] ? 1 : a[2] < b[2] ? -1 : 0;
    })

    // sanitize and slice text into char array
    // texte.replace("\n", "");
    // texte.replace("\t", " ");

    let start, end, type, offset = 0;
    for(let line = 0; line < annotated.length; line++) {
        if(annotated[line][0].match("^(T)[0-9]+")) {

            // console.log(annotated[line])
            //Set vars
            type = annotated[line][1];
            start = annotated[line][2] + offset;
            end = annotated[line][3] + offset;
            offset += 22 + color[type].length;

            console.log(annotated[line])
            let tmp = texte.substring(start, end);
            tmp = tmp.fontcolor(color[type]);

            texte = texte.splice(start, end - start, tmp);
        }
    }

    document.getElementById('textOutput').innerHTML = texte;
}

function readFile(file, callback) {
    let reader = new FileReader();

    reader.onload = callback;

    reader.readAsText(file);
}

/**
 * If both undefined : default color
 * Selecteds are green and non seleted orange
 * If both inputs match : both green then lock them and activate clear button
 * else both red
 */
function colorizeInputs() {

}
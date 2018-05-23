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

String.prototype.replaceAll = function(search, replacement) {
    var target = this;
    return target.replace(new RegExp(search, 'g'), replacement);
};

let texte, annotated;
let wsRegex = new RegExp("\\s+");

window.onload = init;

function init() {
    // console.log("page chargee");

    let nodeLink = document.getElementById("nodeUrl");
    let a = document.createElement('a');
    let text = document.createTextNode("Graph tool >>");
    a.appendChild(text);
    a.title = "graph tool";
    a.href = staticUrl + "NoDE.html";
    nodeLink.appendChild(a);

    document.getElementById("clearButton").addEventListener("click", function(e) {
        clear();
    });

    // parts [line] [ID,type,indexDebut,indexFin]
}

let labels = { "txtFiles": "Choisir le fichier texte", "annFiles": "Choisir le fichier annoté" };

function onFileChange(source) {

    if (source.files.length > 0) {

        let file = source.files[0];

        document.getElementById(source.id + "Label").textContent = file.name
        source.textContent = file.name;

        let fileSplit = file.name.split(".");
        let name = fileSplit[0];
        let ext = fileSplit[fileSplit.length - 1];

        readFile(file, (event) => {
            if (ext == "ann") {
                processAnnotatedText(event.target.result);
            } else if (ext == "txt") {
                processPlainText(event.target.result);
            }
            source.disabled = true;
            processContent();
            document.getElementById("titre").textContent = name;
        });

    } else {
        document.getElementById(source.id + "Label").textContent = labels[source.id]
    }
}

function processAnnotatedText(text) {

    // Split the text into lines
    annotated = text.split("\n");

    // Check if last line is empty
    if (annotated[annotated.length - 1] == "") {
        annotated.pop();
    }
}

function processPlainText(text) {
    texte = text.replaceAll('\r', '');
}

var color = {
    "Premise": "green",
    "Claim": "orange",
    "MajorClaim": "red"
}

function processContent() {

    colorizeInputs();

    // Process only if the buffers are loaded
    if (annotated == undefined || texte == undefined) {
        return;
    }

    for (let line = 0; line < annotated.length; line++) {
        let split = annotated[line].split(wsRegex, 4);
        let sentence = annotated[line].substring(split.join(" ").length + 1);
        annotated[line] = split;
        annotated[line][2] = parseInt(annotated[line][2]);
        annotated[line][3] = parseInt(annotated[line][3]);
        annotated[line][4] = sentence;
    }

    annotated.sort((a, b) => {
        console.log(a + " " + b);
        if (!a[0].startsWith("T")) {
            return -1;
        }

        if (!b[0].startsWith("T")) {
            return 1;
        }
        return a[2] > b[2] ? 1 : a[2] < b[2] ? -1 : 0;
    })

    // sanitize and slice text into char array
    // texte.replace("\n", "");
    // texte.replace("\t", " ");

    let start, end, type, offset = 0,
        pre, post;
    for (let line = 0; line < annotated.length; line++) {
        if (annotated[line][0].match("^(T)[0-9]+")) {

            console.log(annotated[line])
                //Set vars
            type = annotated[line][1];

            pre = "<span class='" + type.toLowerCase() + "'>";
            post = "</span>";

            start = annotated[line][2] + offset;
            texte = texte.splice(start, 0, pre);
            offset += pre.length;

            end = annotated[line][3] + offset;
            texte = texte.splice(end, 0, post);
            offset += post.length;
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
    if (texte == undefined || annotated == undefined) {
        document.getElementById('clearButton').disabled = true;
    } else {
        document.getElementById('clearButton').disabled = false;
    }
}

function clear() {
    document.getElementById('clearButton').disabled = true;
    for (let key in labels) {
        document.getElementById(key).disabled = false;
        document.getElementById(key).value = "";
        document.getElementById(key + "Label").textContent = labels[key];
    }
    document.getElementById("titre").textContent = "Fichier";
    document.getElementById("textOutput").textContent = "";
    texte = undefined;
    annotated = undefined;
}
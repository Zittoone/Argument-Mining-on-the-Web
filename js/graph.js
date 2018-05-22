let topics = [];
let nodes = [];

let DEBUG = false;

let getUrl = window.location;
let baseUrl = getUrl .protocol + "//" + getUrl.host + "/" + getUrl.pathname.split('/')[1];
let datasetsNoDEUrl = baseUrl + "/datasets/NoDE/";

function readTextFile(file)
{
    var rawFile = new XMLHttpRequest();
    rawFile.open("GET", file, false);
    rawFile.onreadystatechange = function ()
    {
        if (DEBUG) {
            if(rawFile.readyState === 4)
            {
                if(rawFile.status === 200 || rawFile.status == 0)
                {
                    var allText = rawFile.responseText;
                    console.log(allText);
                }
            }
        }
    }
    rawFile.send(null);

    return rawFile.responseText;
}

//List all topics found in the file
function getTopic(filename) {
    let text = readTextFile(filename);

    let parser, xmlDoc;

    parser = new DOMParser();
    xmlDoc = parser.parseFromString(text,"text/xml");

    let pairs = xmlDoc.getElementsByTagName("pair");
    for (i = 0; i < pairs.length; i++) { 
        let topic = pairs[i].getAttribute("topic");
        if (!topics.includes(topic)) {
            topics.push(topic);
            console.log(topic);
        }
    }
}

function getPairs(filename, topic) {
    let text = readTextFile(filename);

    let parser, xmlDoc;

    parser = new DOMParser();
    xmlDoc = parser.parseFromString(text,"text/xml");    

    let hypothesisFound = false;

    let pairs = xmlDoc.getElementsByTagName("pair");
    for (i = 0; i < pairs.length; i++) { 
        let readTopic = pairs[i].getAttribute("topic");
        if (readTopic == topic) {

            let id = pairs[i].childNodes[1].getAttribute("id");
            let text = pairs[i].childNodes[1].childNodes[0].nodeValue;
            let fatherId = pairs[i].childNodes[3].getAttribute("id");
            let entailment = pairs[i].getAttribute("entailment");
            
            if (!hypothesisFound && pairs[i].childNodes[3].getAttribute("id") == "1") {
                nodes.push(new Node("1", 
                                    pairs[i].childNodes[3].childNodes[0].nodeValue
                                ));
                hypothesisFound = true;
            }
        }
    }
}

class Node {
    constructor(id, text, fatherId, entailment) {
        this.id = id;
        this.text = text;
        this.fatherId = fatherId;
        this.entailment = entailment;
    }
}

getTopic(datasetsNoDEUrl + "debatepedia_test.xml");
getPairs(datasetsNoDEUrl + "debatepedia_test.xml", topics[0]);
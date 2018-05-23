let topics = [];
let nodes = [];
let graphNodes = [];

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
            if (DEBUG) {
                console.log(topic);
            }
        }
    }
}

function constructNodes(filename, topic) {
    let text = readTextFile(filename);

    let parser, xmlDoc;

    let test = 0;

    parser = new DOMParser();
    xmlDoc = parser.parseFromString(text,"text/xml");    

    let hypothesisFound = false;

    let pairs = xmlDoc.getElementsByTagName("pair");
    for (i = 0; i < pairs.length; i++) { 
        let readTopic = pairs[i].getAttribute("topic");
        if (readTopic == topic) {
            test++;
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

            nodes.push(new Node(id, text, fatherId, entailment));
        }
    }
}

function drawGraph() {
    let graph = new Springy.Graph();

    //Adding nodes
    for(i = 0; i < nodes.length; i++) {
        let node = graph.newNode({
            label: nodes[i].id,
            ondoubleclick: function() {
                console.log(nodes[i].text);
            }
        });

        graphNodes.push(node);
    }

    //Adding edges
    for(let x = 1; x < nodes.length; x++) {
        let currentNode, fatherNode, color;

        currentNode = graphNodes[x];
        fatherNode = graphNodes[getNodeGraphIndex(nodes[x].fatherId)];


        if (nodes[x].entailment == "YES") {
            edgeColor = '#7DBE3C'
        } else {
            edgeColor = '#FF0000';
        }

        graph.newEdge(currentNode, fatherNode, {color: edgeColor});
    }


    jQuery(function(){
        var springy = jQuery('#canvasSpringy').springy({
          graph: graph
        });
      });
}

function getNodeGraphIndex(id) {
    let index = -1;
    for(i = 0; i < nodes.length; i++) {
        if (nodes[i].id == id) {
            index = i;
        }
    }
    return index;
}

class Node {
    constructor(id, text, fatherId, entailment) {
        this.id = id;
        this.text = text;
        this.fatherId = fatherId;
        this.entailment = entailment;

    }
}

getTopic("http://localhost/datasets/NoDE/debatepedia_test.xml");
constructNodes("http://localhost/datasets/NoDE/debatepedia_test.xml", "Cellphones");
drawGraph();
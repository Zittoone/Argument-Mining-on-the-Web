let topics;
let nodes;
let graphNodes;

let fatherIds;
let createdNodeIds;

let DEBUG = false;

window.onload = function() {
    let back = document.getElementById("back");
    let a = document.createElement('a');
    let text = document.createTextNode("<< Home page");
    a.appendChild(text);
    a.title = "home";
    a.href = staticUrl;
    back.appendChild(a);
}

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
    topics = [];


    let file = nodeURL + filename;
    let text = readTextFile(file);

    let parser, xmlDoc;

    parser = new DOMParser();
    xmlDoc = parser.parseFromString(text,"text/xml");

    let pairs = xmlDoc.getElementsByTagName("pair");

    let topicDiv = document.getElementById("topics");
    //We remove topics of previous files
    while (topicDiv.firstChild) {
        topicDiv.removeChild(topicDiv.firstChild);
      }

    for (let i = 0; i < pairs.length; i++) { 
        let topic = pairs[i].getAttribute("topic");

        if (!topics.includes(topic)) {
            topics.push(topic);

            //Adding link
            let link = document.createElement('a');
            let text = document.createTextNode(topic);
            link.appendChild(text);
            link.title = topic;
            link.href = 'javascript:constructNodes("' + filename + '", "' + topic + '");';
            topicDiv.appendChild(link);
            
            //Adding br
            let br = document.createElement('br');
            topicDiv.appendChild(br);

            if (DEBUG) {
                console.log(topic);
            }
        }
    }
}

function constructNodes(filename, topic) {
    nodes = [];
    fatherIds = [];
    createdNodeIds = [];

    let file = nodeURL + filename;
    let text = readTextFile(file);

    let parser, xmlDoc;

    parser = new DOMParser();
    xmlDoc = parser.parseFromString(text,"text/xml");    

    let pairs = xmlDoc.getElementsByTagName("pair");
    
    let checkPairs = [];
    
    for (let i = 0; i < pairs.length; i++) { 
        let readTopic = pairs[i].getAttribute("topic");
        if (readTopic == topic) {
            let id = pairs[i].childNodes[1].getAttribute("id");
            let text = pairs[i].childNodes[1].childNodes[0].nodeValue;
            let fatherId = pairs[i].childNodes[3].getAttribute("id");
            let entailment = pairs[i].getAttribute("entailment");

            //We check here if the pair has already been read
            for (let x = 0; x < checkPairs.length; x++) {
                if (checkPairs[x][0] === id && checkPairs[x][1] === fatherId) {
                    console.log("Duplicate found : " + id + " || " + fatherId);
                    return;
                }
            }

            console.log("ijfpiojdqpdj")

            if (fatherId === "15") {
                console.log(id);
            }

            checkPairs.push([id, fatherId]);

            if (!fatherIds.includes(fatherId)) {
               fatherIds.push(fatherId);
            }

            if (!createdNodeIds.includes(id)) {
                createdNodeIds.push(id);
            }

            nodes.push(new Node(id, text, fatherId, entailment));
        }
    }

    seekHypothesis(filename, topic);

    drawGraph();
}

function seekHypothesis(filename, topic) {
    for (let i = 0; i < fatherIds.length; i++) {
        if (!createdNodeIds.includes(fatherIds[i])) {
            createHypothesis(filename, topic, fatherIds[i]);
        }
    }
}

function createHypothesis(filename, topic, id) {
    let file = nodeURL + filename;
    let text = readTextFile(file);

    let parser, xmlDoc;

    parser = new DOMParser();
    xmlDoc = parser.parseFromString(text,"text/xml"); 

    let pairs = xmlDoc.getElementsByTagName("pair");

    for (let i = 0; i < pairs.length; i++) { 

        let readTopic = pairs[i].getAttribute("topic");

        if (readTopic == topic) {

            if (pairs[i].childNodes[3].getAttribute("id") == id) {            
                nodes.unshift(new Node(pairs[i].childNodes[3].getAttribute("id"), 
                                    pairs[i].childNodes[3].childNodes[0].nodeValue
                ));
                return;
            }
        }
    }
}

function drawGraph() {
    let graph = new Springy.Graph();
    graphNodes = [];

    //Adding nodes
    for(let i = 0; i < nodes.length; i++) {
        let nodeText = nodes[i].text;
        let node = graph.newNode({
            label: nodes[i].id,
            ondoubleclick: function() {
                writeText(this.label);
            }
        });

        graphNodes.push(node);
    }

    //Adding edges
    for(let i = 1; i < nodes.length; i++) {
        let currentNode, fatherNode, color;

        currentNode = graphNodes[i];
        fatherNode = graphNodes[getNodeGraphIndex(nodes[i].fatherId)];

        if (nodes[i].entailment == "YES" || nodes[i].entailment == "ENTAILMENT") {
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

function writeText(id) {
    let textDiv = document.getElementById("nodeText");

    document.getElementById("textTitle").innerHTML = "Text from node " + id;
    let text = nodes[getNodeGraphIndex(id)].text;

    textDiv.innerHTML = text;
}

function getNodeGraphIndex(id) {
    let index = -1;
    for(let i = 0; i < nodes.length; i++) {
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

//getTopic("debatepedia_test.xml");
//constructNodes("debatepedia_test.xml", "Cellphones");
//drawGraph();

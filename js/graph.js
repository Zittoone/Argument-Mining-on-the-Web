let topics;
let nodes;
let graphNodes;

let graph;
let renderer;

let fatherIds;
let createdNodeIds;

let hypothesisNumber;

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

    document.getElementById("topicTitle").innerHTML = "Topics for the file " + filename;

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
        let duplicate = false;

        if (readTopic == topic) {
            let id = pairs[i].childNodes[1].getAttribute("id");
            let text = pairs[i].childNodes[1].childNodes[0].nodeValue;
            let fatherId = pairs[i].childNodes[3].getAttribute("id");
            let entailment = pairs[i].getAttribute("entailment");

            //We check here if the pair has already been read
            for (let x = 0; x < checkPairs.length; x++) {
                if (checkPairs[x][0] === id && checkPairs[x][1] === fatherId) {
                    console.log("Duplicate found : " + id + " || " + fatherId);
                    duplicate = true;
                }
            }

            if (!duplicate) {
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
    }

    seekHypothesis(filename, topic);

    document.getElementById("graphTitle").innerHTML = "Graph for topic " + topic;

    drawGraph();
}

function seekHypothesis(filename, topic) {
    hypothesisNumber = 0;
    
    for (let i = 0; i < fatherIds.length; i++) {
        if (!createdNodeIds.includes(fatherIds[i])) {
            createHypothesis(filename, topic, fatherIds[i]);
            hypothesisNumber++;
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
    if (renderer) {
        renderer.graph.edges.slice().map(function(edge) {
            renderer.graph.removeEdge(edge);
        });
        renderer.graph.nodes.slice().map(function(node) {
            renderer.graph.removeNode(node);
        });
        drawComponents();
    } else {
        graph = new Springy.Graph();
        drawComponents();
        renderer = $('#canvasSpringy').springy({
           graph: graph
        });
    }
}

function drawComponents() {
    graphNodes = [];

    //Adding nodes
    for(let i = 0; i < nodes.length; i++) {
        let duplicate = false;

        for (let y = 0; y < graphNodes.length; y++) {
            if (graphNodes[y].data.label == nodes[i].id) {
                duplicate = true;
            }
        }

        if (!duplicate) {
            let nodeText = nodes[i].text;
            let node = graph.newNode({
                label: nodes[i].id,
                ondoubleclick: function() {
                    writeText(this.label);
                }
            });

            graphNodes.push(node);
        }
    }
    
    //Adding edges
    for(let i = hypothesisNumber; i < nodes.length; i++) {
        let currentNode, fatherNode, color;

        currentNode = graphNodes[getNodeGraphIndex(nodes[i].id)];
        fatherNode = graphNodes[getNodeGraphIndex(nodes[i].fatherId)];

        if (nodes[i].entailment == "YES" || nodes[i].entailment == "ENTAILMENT") {
            edgeColor = '#7DBE3C'
        } else {
            edgeColor = '#FF0000';
        }
        graph.newEdge(currentNode, fatherNode, {color: edgeColor});
    }
}

function writeText(id) {
    let textDiv = document.getElementById("nodeText");

    document.getElementById("textTitle").innerHTML = "Text from node " + id;
    let text = nodes[getNodeIndex(id)].text;

    textDiv.innerHTML = text;
}

function getNodeGraphIndex(id) {
    let index = -1;
    for(let i = 0; i < graphNodes.length; i++) {
        if (graphNodes[i].data.label == id) {
            index = i;
        }
    }
    return index;
}

function getNodeIndex(id) {
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

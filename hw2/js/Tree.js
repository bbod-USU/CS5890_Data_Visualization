/** Class representing a Tree. */
class Tree {
	/**
	 * Creates a Tree Object
	 * parentNode, children, parentName,level,position
	 * @param {json[]} json - array of json object with name and parent fields
	 */
	constructor(json) {
        this.listOfNodes = [];
        json.forEach(nodeInfo => {
            let node = new Node(nodeInfo.name, nodeInfo.parent);
            //console.log(node);
            this.listOfNodes.push(node);
        });
    }

	/**
	 * Function that builds a tree from a list of nodes with parent refs
	 */
	buildTree(){
	    let rootNode = this.listOfNodes.find(node => node.parentName === "root");
	    this.listOfNodes.forEach(currentNode => {
	        for(let i = 0; i < this.listOfNodes.length; i ++){
	            if(this.listOfNodes[i].parentName === currentNode.name){
	                currentNode.addChild(this.listOfNodes[i]);
                }
            }
        });
        //console.log(rootNode);

        this.assignLevel(rootNode, 0);
        this.assignPosition(rootNode, 0);



    }

	/**
	 * Recursive function that assign positions to each node
	 */
	assignPosition(node, position) {
		node.position = position;
		let currentlevel = node.level;
		let q = [];
		node.children.forEach(x=>{
		    q.push(x)
        });
		let count = 0;
		while(q.length > 0){
		    let current = q.shift();
            if(currentlevel === current.level){
                current.position = count;
                count +=1;
                current.children.forEach(x=> q.push(x));
                console.log(q);
            }

            else{
                currentlevel = current.level;
                current.children.forEach(x=> q.push(x));
                count = current.position+1;

            }
        }

	}

	/**
	 * Recursive function that assign levels to each node
	 */
	assignLevel(node, level) {
		node.level = level;
        node.children.forEach(childNode => {
            this.assignLevel(childNode, level+1);
        })
	}

	/**
	 * Function that renders the tree
	 */
	renderTree() {
        d3.select("body")
            .append("svg")
            .attr("width", 1200)
            .attr("height", 1200);
        this.listOfNodes.forEach(node => {
            let svgElement = d3.select("svg");
            for (var i = 0; i < node.children.length; i++) {
                svgElement.append("line")
                    .attr("x1", (node.level + 3) * 100)
                    .attr("y1", (node.position + 3) * 100)
                    .attr("x2", (node.children[i].level +3) * 100)
                    .attr("y2", (node.children[i].position+3) * 100)
            }
            svgElement.append("circle")
                .attr("r", 35)

                .attr("cx", (node.level+3) * 100)
                .attr("cy", (node.position+3) * 100);
            svgElement.append("text")
                .attr("class", "label")
                .attr("dx", (node.level+3) * 100)
                .attr("dy", (node.position+3) * 100)
                .text(node.name)
        })

    }
}
function schrei(poem) {
	alert("poem");
}


/*
function renderPoem(poemStr, comments) {
	alert("renders");
	poemStr = poemStr.replace('|backslash|', '"');
	poem = JSON.parse(poemStr);
	var poemLength = poem['lines'].length, line, br;
	for (var i = 0; i < poemLength; i++) {
		line = document.createTextNode(poem['lines'][i]);
		br = document.createElement("br");
		$('#poem-start').appendChild(line);
		$('#poem-start').appendChild(br);
	}
}
*/


function mark() {
	;
	/*check whether already commenting
	if yes: delete mark
	*/

	//get selection
	//save indices

	//create span
	//insert span
	//delete next node

	//enable textfield comment
}



function insertComment() {
	;

	//read text from textfield comment
	//save comment

	//add comment to comments (addComment())

	//renderPoem
}


function addComment() {
	;
	//create new comment{}
	
	/* sort in comment:
	compare aL

	*/
}

function createPoemHTML(poem, poemLength, comments, commentsLength) {
	;
	/*
	poem = {'author' = string, 'title' = string, 'lines' = [string, string, ...]}
	poemLength = int
	comments = [{'AL' = int, 'AO' = int, 'FL' = int, 'FO' = int, 'comment' = string}, {'AL' = int, 'AO' = int, 'FL' = int, 'FO' = int, 'comment' = string}, ...]
	commentsLength = int

	

	1. create points[]
	var points[];

	(for int i = 0; i < commentsLength; i++) {
		comm = comments[i];
		AL = comm[i]['AL'];
		AO = comm[i]['AO'];
		FL = comm[i]['FL'];
		FO = comm[i]['FO'];
		startPointIndex = AL*1000 + AO;
		endPointIndex = FL*1000 + FO;
		
		startPoint = {'type' = 'start', 'index' = startPointIndex, 'AL' = AL, 'AO' = AO}
		endPoint = {'type' = 'end', 'index' = endPointIndex, 'FL' = FL, 'FO' = FO}
		
		points.push(startPoint)
		points.push(endPoint)
		points.sort(function(a,b) {
			return a['index'] - b['index']
		})
	}

	points



	


	// anchor line, anchor offset, focus line, focus offset
	var AL, AO, FL, FO;
	//empty string
	annoPoemHTML = "";
	annoPoem = [];
	//insert title
	annoPoemHTML.append("<h4 id='poem-title'>" + poem['title'] + "<h4>");
	//insert lines
	for (int i = 0; i < poemLength; i++) {
		annoPoem.push(poem['lines'][i]);


	*/
		/*
		annoPoemHTML.append("<span id=" + i + "class='poemLine'>");
		annoPoemHTML.append(poem['lines'][i]);
		annoPoemHTML.append("</span>");
		*/

	/*

	}
	//insert comments
	for (int i = commentsLength-1; i >= 0; i--) {
		AL = comments[i]['AL'];
		AO = comments[i]['AO'];
		FL = comments[i]['FL'];
		FO = comments[i]['FO'];

		x = annoPoem[FL].substring(0,FO);
		y = annoPoem[FL].substring(FO);
		x + "</span>" + y;


		

	}


	//empty div poem


	//insert annoPoemHTML

	*/
}



function insertComment(comment) {
	//insert comment
	;
}



function saveProject() {
	//send project to server
	//NOTE: name of project, user_name, poem are already known. only comments[] neet do be sent. 
	;
}


// functions
function setMarkOld() {
	//get Selection
	var selection = document.getSelection();
	//get indices
	aOffset = selection.anchorOffset;
	fOffset = selection.focusOffset;
	alert("aOffset: "+aOffset+", fOffset: "+fOffset);
	//get start and end node
	anchor = selection.anchorNode;
	focus = selection.focusNode;
	//is selection collapsed?
	if (((anchor == focus) && (aOffset == fOffset)))
		return;

	if (commenting) {
		deleteMark();
	}
	//invert focus and anchor if commenting from right to left
	if((anchor == focus) && (aOffset > fOffset)) {
		invertOffset();
	}
	else {
		//compare indices of anchorNode and focusNode
		var i = Array.prototype.indexOf.call(anchor.parentNode.childNodes, anchor);
		var j = Array.prototype.indexOf.call(focus.parentNode.childNodes, focus);
		if(i > j) {
			var nodeInverter = anchor;
			anchor = focus;
			focus = nodeInverter;
			invertOffset();
		}
	}

	//split text
	after = focus.splitText(fOffset);
	markedFirst = anchor.splitText(aOffset);
	//create span element
	mark = document.createElement("span");
	mark.setAttribute("style", "background-color: "+color);
	mark.setAttribute("id", "mark"+commentCount);
	//get root element
	mama = anchor.parentNode;

	//insert the marked nodes
	mama.insertBefore(mark, markedFirst);
	next = markedFirst.nextSibling;		
	mark.appendChild(markedFirst);
	if(anchor != focus) {
		while(next!=focus) {
			nextNext=next.nextSibling;
			mark.appendChild(next);
			next=nextNext;
		}
		mark.appendChild(next);
	}

	//activate #comments and focus it 
	$('#comments').removeAttr("disabled");
	$('#comments').focus();
	
	commentCount+=1;
	commenting=true;
}

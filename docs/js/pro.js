var commentCount = 0, comments = [], commentText = "", commenting = false;
var color, colorMarked;
var anchorOffset, focusOffset, parentAnchor, realOffset, annoLength, mark;

// load page
colors();

function setMark(){
	var anchor, anchorName, anchorClass, prevSib, parentPrevSib;
	realOffset = 0;
	annoLength = 0;
	var selection = document.getSelection();
	anchor = selection.anchorNode;
	anchorOffset = selection.anchorOffset;
	focus = selection.focusNode;
	focusOffset = selection.focusOffset;
	parentAnchor = anchor.parentNode;
	parentAnchorFlex = parentAnchor;
	focusAnchor = focus.parentNode;
	realOffset += anchorOffset;

	colorMarked = color;

	//is no text marked?
	if ((anchor == focus) && (anchorOffset == focusOffset)) {
		deleteMark();
	}

	//if text is marked, delete mark and continue
	if (commenting) {
		deleteMark();
	}

	//invert focus and anchor if commenting from right to left
	if((anchor == focus) && (anchorOffset > focusOffset)) {
		invertOffset();
	}
	else {
		var i = Array.prototype.indexOf.call(anchor.parentNode.childNodes, anchor);
		var j = Array.prototype.indexOf.call(focus.parentNode.childNodes, focus);
		if(i > j) {
			var nodeInverter = anchor;
			anchor = focus;
			focus = nodeInverter;
			invertOffset();
		}
	}





	// 1) get realOffset 
	//get length of all previous siblings and add to realOffset
	//plus all children of previousElementSibling if they are not of class "ref" (for the textnodes inside the span-elements of class "mark")
	anchPrevElemSib = anchor.previousElementSibling;
	while(anchPrevElemSib != null) {
		if (anchPrevElemSib.className != "ref") {
			for (var p = 0; p < anchPrevElemSib.childNodes.length; p++) {
				realOffset += anchPrevElemSib.childNodes[p].length;
				//alert("anchPrevElemSib.childNodes[p].nodeValue: "+anchPrevElemSib.childNodes[p].nodeValue);
			}
		}
		anchPrevElemSib = anchPrevElemSib.previousElementSibling;
	}

	anchPrevSib = anchor.previousSibling;
	while (anchPrevSib != null) {
		if(anchPrevSib.nodeValue != null) {
			//alert("anchPrevSib.nodeType: "+anchPrevSib.nodeType);
			//alert("anchPrevSib.nodeValue: "+anchPrevSib.nodeValue);
			realOffset += anchPrevSib.nodeValue.length;
		}
		anchPrevSib = anchPrevSib.previousSibling;
	}

	//while parent is not the first span-element of the poem:
	//	get length of all childNodes of parent's previous siblings and add to realOffset
	while (parentAnchorFlex.className != "poem-start") {
		parentAnchorFlex = parentAnchorFlex.previousSibling;
		for (var i = 0; i < parentAnchorFlex.childNodes.length; i++) {
			if (parentAnchorFlex.childNodes[i].nodeValue != null) {
				realOffset += parentAnchorFlex.childNodes[i].nodeValue.length;
			}
		}
	}






	// 2) get annoLength
	if (focus == anchor) {
		annoLength += focusOffset - anchorOffset;
	}
	else {
		focusFlex = focus;
		annoLength += focusOffset;
		focusFlex = focusFlex.previousSibling;

		while (focusFlex != anchor) {
				if (focusFlex.nodeValue != null) {
					annoLength += focusFlex.nodeValue.length;
				}
				focusFlex = focusFlex.previousSibling;
		}
		annoLength += anchor.nodeValue.length - anchorOffset;
	}

	//split text
	after = focus.splitText(focusOffset);
	markedFirst = anchor.splitText(anchorOffset);
	//create span element
	mark = document.createElement("span");
	mark.setAttribute("style", "background-color: " + colorMarked);
	mark.setAttribute("id", "mark"+commentCount);

	//insert the marked nodes
	parentAnchor.insertBefore(mark, markedFirst);
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

function invertOffset() {
	//invert anchorOffset and focusOffset
	offsetInverter = anchorOffset;
	anchorOffset = focusOffset;
	focusOffset = offsetInverter;
}

function insertComment() {
	//check whether button was clicked without purpose
	if(!commenting) {
		return;
	}
	//read comment from textfield. empty textfield
	commentText = $('#comments').val();
	$('#comments').val("");
	//add comment to comments[]
	comment = {"commentText": commentText, "offset": realOffset, "annoLength": annoLength, "color": colorMarked};
	comments.push(comment);
	//append comment to list after poem
	$('#comment-list').append('<li id="comment'+(commentCount)+'">' + commentText + '</li>');
	//create ref to comment after mark
	createRef(commentCount, mark);
	commenting=false;
}

function deleteMark() {
	if (!commenting) {
		return;
	}
	//empty + disable textarea
	$('#comments').val("");
	$('#comments').attr("disabled", "disabled");

	//iterate through childNodes of mark; get them out of span-element
	next=markedFirst.nextSibling;
	parentAnchor.insertBefore(markedFirst, mark);
	while(next) {
		nextNext = next.nextSibling;
		parentAnchor.insertBefore(next, mark);
		next = nextNext;
	}
	//normalize span before mark (no empty textnodes, no adjacent textnodes)
	parentAnchor.normalize();
	//delete span-element
	mark.remove();
	//set controlling flags
	commentCount--; 
	commenting = false;
}

function colors(){
	colors= ["#e6b0aa", " #f7dc6f ", "#abebc6", "#a9cce3"];
	color=colors[0];
	colorMarked = color;
	for (i = 0; i < colors.length; i++) {
		$('#color-picker').append('<button class="color-button" onclick="changeColor(this)" style="background-color: '+colors[i]+'" value="'+colors[i]+'"/></button>')
	}
	$('.color-button')[0].style.borderColor = "#ebedef";
}

function changeColor(obj) {
	color = obj.value;
	colorButtons = $('.color-button');
	for (i = 0; i<colorButtons.length;i++){
		//colorButtons[i].setAttribute("style", "border-color: Wheat");
		colorButtons[i].style.borderColor = "#ebedef";

	}
	obj.style.borderColor = "#85929e";
}

function saveProject() {
	//send comments to server and have them stored by a handler
	//answer is jqXHR-object, implementing the Promise interface
	

	commentsStr = JSON.stringify(comments);
	var jqXHR = $.ajax({
		method: "POST",
		url: "/saveProject",
		data: "comments="+commentsStr,
		datatype: "text"
	})
		.done( function(save_message) {
			$('#jqXHR-answer').text("Project was saved.");
			$('#save-message').text(save_message);

		})
		.fail(function() {
			$('#jqXHR-answer').text("Project couldn't be saved.");
		});
}

function renderComments(commentsLoaded) {
	//sort comments
	commentsLoaded.sort(function(a,b) {
		return (b['offset'] - a['offset']);
	});
	
	//iterate through comments and set marks
	for (var i = 0; i < commentsLoaded.length; i++) {
		// get properties of comment
		commentText = commentsLoaded[i]['commentText'];
		offset = commentsLoaded[i]['offset'];
		annoLength = commentsLoaded[i]['annoLength'];
		colorMarked = commentsLoaded[i]['color']
		
		// get nodes
		startNode = document.getElementById('poem-start');
		nodeFirstMarkedChar = startNode.childNodes[0];
		
		//create span element
		mark = document.createElement("span");
		mark.setAttribute("style", "background-color: " + colorMarked);
		mark.setAttribute("id", "mark" + commentCount);

		//get the textnode that contains the first marked character
		nodeLength = nodeFirstMarkedChar.nodeValue.length;
		while (offset > nodeLength) {
			offset -= nodeLength;
			nodeLength = 0;
			nodeFirstMarkedChar = nodeFirstMarkedChar.nextSibling;
			if (nodeFirstMarkedChar.nodeValue != null) {
				nodeLength = nodeFirstMarkedChar.nodeValue.length;
			}
		}

		nodeLastMarkedChar = nodeFirstMarkedChar;
		
		// treat case: last marked character is not in same node as first marked character
		if (annoLength > (nodeLength - offset)) {
			annoLength -= (nodeLength - offset);
			nodeLastMarkedChar = nodeLastMarkedChar.nextSibling;
			while (nodeLastMarkedChar.nodeValue == null) {
				nodeLastMarkedChar = nodeLastMarkedChar.nextSibling;
			}
			nodeLength = nodeLastMarkedChar.nodeValue.length;


			while (annoLength > nodeLength) {
				annoLength -= nodeLength;
				nodeLastMarkedChar = nodeLastMarkedChar.nextSibling;
				while (nodeLastMarkedChar.nodeValue == null) {
					nodeLastMarkedChar = nodeLastMarkedChar.nextSibling;
				}
				nodeLength = nodeLastMarkedChar.nodeValue.length;
			}
			//split nodes with first resp. last character
			markedFirst = nodeFirstMarkedChar.splitText(offset);
			after = nodeLastMarkedChar.splitText(annoLength);
			
			//start: insert the marked nodes
			//insert mark
			startNode.insertBefore(mark, markedFirst);
			//get nextNode
			next = markedFirst.nextSibling;
			mark.appendChild(markedFirst);
			while(next!=after) {
				nextNext=next.nextSibling;
				mark.appendChild(next);
				next=nextNext;
			}
		}
		//treat case: last marked character is in same node as first marked character
		else {
			markedFirst = nodeFirstMarkedChar.splitText(offset);
			after = markedFirst.splitText(annoLength);
			startNode.insertBefore(mark, markedFirst);
			mark.appendChild(markedFirst);
		}

		createRef(commentsLoaded.length-i, mark);


		$('#comment-list').prepend('<li id="comment'+(commentsLoaded.length-i)+'">' + commentText + '</li>');

	}
	commentCount =	commentsLoaded.length;
	comments = commentsLoaded;
}

function createRef(nr, commentNode) {
	//create link to comment
	ref = document.createElement("a");
	ref.setAttribute("href", "#comment"+(nr));
	ref.setAttribute("style", "color: black");
	ref.setAttribute("class", "ref");
	refText = document.createTextNode("("+(nr)+")");
	ref.appendChild(refText);
	$(ref).insertAfter(commentNode);
}
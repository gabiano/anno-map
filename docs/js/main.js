function validate_search_form() {
	if (($('#author').val() == null || $('#author').val().trim() === '') &&
		($('#title').val() == null || $('#title').val().trim() === '')) {
		$('#searchErr').text("What shall I search for, my friend?"); 
	}
	else {
		$('#search_form').submit();
	}
}
/*
function deletePro(i) {
	alert("delete starts. i: "+i);
	var jqXHR = $.ajax({
		method: "POST",
		url: "/d",
		data: "del-pro="+i,
		datatype: "text"
	})
		.done( function() {
			$('#del-msg').text("Project was deleted.");
		})
		.fail(function() {
			$('#del-msg').text("Project couldn't be deleted.");
		});
}
*/
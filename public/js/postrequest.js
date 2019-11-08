$(document).ready(function () {
	
	// SUBMIT FORM
	$("#userForm").submit(function (event) {
		// Prevent the form from submitting via the browser.
		event.preventDefault();
		ajaxPost();
	});


	function ajaxPost() {

		// PREPARE FORM DATA
		var formData = {
			name: $("#name").val(),
			quan: $("#quantity").val(),
			prio: $("#priority").val()
		}

		// DO POST
		$.ajax({
			type: "POST",
			contentType: "application/json",
			url: window.location + "api/users/save",
			data: JSON.stringify(formData),
			dataType: 'json',
			success: function (user) {
				$("#postResultDiv").html("<p>" +
					"Post Successfully! <br>" +
					"--> " + user.name + " " + user.quan + " " + user.prio + "</p>");
			},
			error: function (e) {
				alert("Error!")
				console.log("ERROR: ", e);
			}
		});

		// Reset FormData after Posting
		resetData();

	}

	function resetData() {
		$("#name").val("");
		$("#quantity").val("");
		$("#priority").val("");
	}
})
$(document).ready(function () {

	// GET REQUEST
	$("#allUsers").click(function (event) {
		event.preventDefault();
		ajaxGet();
	});
	setInterval(function () {
		retrieveItems();
	})

	function retrieveItems() {
		$.ajax({
			url: "item/retrieve/all",
			type: "GET",
			success: (data) => {
				$('tbody').empty();
				data.forEach(item => {
					addRow(item)
				});
			}
		})
	}

	function addRow(item) {
		var tr = $("<tr>")
		$(tr).append(
			$("<td>").text(item.name),
			$("<td>").text(item.quan),
			$("<td>").text(item.prio)
		)
	}
	// DO GET
	function ajaxGet() {
		$.ajax({
			type: "GET",
			url: "/item/create",
			success: function (result) {
				$("#getResultDiv").html("<strong>Success!</strong>");

			},
			error: function (e) {
				$("#getResultDiv").html("<strong>Error</strong>");
				console.log("ERROR: ", e);
			}
		});
	}
})
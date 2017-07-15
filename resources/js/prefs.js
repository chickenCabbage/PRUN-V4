var on;

jQuery.ajax({
	url: "/getSubscriptions",
	type: "GET",
	data: {
		mail: document.cookie.split("=")[1].replace("%40", "@")
	},
	success: function(data) {
		if(data == "y") {
			on = false; //will be flipped
			toggleMails()
		}
		else {
			on = true; ///will be flipped
			toggleMails();
		}
	}
	error: function(jqxhr, error, errorThrown) {
		alert("There was a problem in fetching your preferences.\n" +
			"Status of " + jqxhr.status + ", server response: " + jqxhr.responseText + 
			"\nHere's what we gathered:\n" + error + "\n" + errorThrown +
			"\nIf this error presists please file an issue at the GitHub repository.");
	}
});

function toggleMails() {
	var toggle = document.getElementById("toggle");
	if(on) {
		toggle.innerHTML = "OFF";
		toggle.style.backgroundColor = "#d5d8b9";
	}
	else {
		toggle.innerHTML = "ON";
		toggle.style.backgroundColor = "#4d905a";
	}
	on = !on;
}
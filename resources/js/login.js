var xh = new XMLHttpRequest();

function authLogin() {
	var email = document.getElementById("email").value;
	var pw = document.getElementById("pw").value;

	jQuery.ajax({
		url: "/authLogin",
		type: "POST",
		data: {
			mail: email,
			password: pw
		},
		success: function(data) {
			switch(data) {
				case "password":
					alert("Your password didn't match the given E-mail.");
				break;

				case "user":
					alert("A user with this E-mail doesn't exist.");
				break;

				case "verify":
					alert("You must verify your E-mail before you can log in. Check your inbox!");
				break;

				default:
					document.documentElement.innerHTML = data;
				break;
			}
		},
		error: function(jqxhr, error, errorThrown) {
			alert("There was a problem in logging in.\n" +
				"Status of " + jqxhr.status + ", server response: " + jqxhr.responseText + 
				"\nHere's what we gathered:\n" + error + "\n" + errorThrown +
				"\nIf this error presists please file an issue at the GitHub repository.");
		}
	});
}
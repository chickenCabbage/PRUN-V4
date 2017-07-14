var xh = new XMLHttpRequest();

function authLogin() {
	var email = document.getElementById("email").value;
	var pw = document.getElementById("pw").value;
	var msg = document.getElementById("msg");

	if(!email) {
		msg.innerHTML = "Please enter an email.";
		msg.style.opacity = "1";
		return;
	}
	if(!pw) {
		msg.innerHTML = "Please enter a password.";
		msg.style.opacity = "1";
		return;
	}

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
					msg.innerHTML = "Your password didn't match the given E-mail.";
					msg.style.opacity = "1";
				break;

				case "user":
					msg.innerHTML = "A user with this E-mail doesn't exist.";
					msg.style.opacity = "1";
				break;

				case "verify":
					msg.innerHTML = "You must verify your E-mail before you can log in. Check your inbox!";
					msg.style.opacity = "1";
				break;

				case "illegal-email":
					msg.innerHTML = "Your email was illegal!";
					msg.style.opacity = "1";
				break;

				case "illegal-password":
					msg.innerHTML = "Your password was illegal!";
					msg.style.opacity = "1";
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
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
					document.open();
					document.write(data);
					document.close();
				break;
			}
		},
		error: function(data) {
			alert("There was a problem in logging in. Here's what we know:\n" + data);
		}
	});
}
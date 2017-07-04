function authLogin() {
	var email = document.getElementById("email");
	var pw = document.getElementById("pw");
	/*jQuery.post("/authLogin", {
		email: email,
		pw: pw
	}, function(result) {
		if(result.includes("Error: ")) {
			alert("There was an error:\n" + result);
			return;
		}
		switch(result) {
			case "email":

			break;

			case "pw":

			break;

			case "verification":

			break;

			default:
				document.open();
				document.write(result);
				document.close();
			break;
		}
	});*/

	var xmlhttp = new XMLHttpRequest();
}
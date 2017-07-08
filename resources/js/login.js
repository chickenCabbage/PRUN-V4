var xh = new XMLHttpRequest();

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
	alert("1");
	var params = "email=" + email + "&pw=" + pw;
	alert("2");
	xh.open("POST", "http://127.0.0.1/authLogin", true);
	alert("3");
	xh.send(params);
	alert("4");
}

xh.onreadystatechange = function() {//Call a function when the state changes.
	alert("changed");
	if(xh.readyState == 4 && xh.status == 200) {
		alert(xh.responseText);
	}
	else {
		alert(xh.status);
	}
}
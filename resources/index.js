var updateText;
var lastCheckTime = 0;

window.onLoad = jQuery.get("/update.txt", function(data, status) { //init
	updateText = data;
	assignSplitted();

	var img = document.getElementById("lu-panel");
	var width = img.clientWidth;
	var height = img.clientHeight + (img.clientHeight / 4);
	var offset = (Math.random() * (height - (height / 2))) - (height / 2);
	img.style.bottom = offset + "px";

	setInterval(function() {
		document.getElementById("status").innerHTML = "Checked " + lastCheckTime + " seconds ago."
		if (lastCheckTime == 60){ //reset the check loop
			updateInfo(); //refresh
			lastCheckTime = 0;
		}
		lastCheckTime ++;
	}, 1000);
});

function updateInfo() {
	document.getElementById("status").innerHTML = "Checking for update...";
	jQuery.get("./update.txt", function(data, status) {
		if(data == updateText) {}
		else { //yes update
			document.getElementById("status").innerHTML = "Update!";
			assignSplitted();
			notify(updateText.split("	")[2]);
		}
		updateText = data;
	});
}

function assignSplitted() {
	document.getElementById("lu-time").innerHTML = updateText.split("	")[0] + " : Last update";
	document.getElementById("lu-title").innerHTML = "Update title : " + updateText.split("	")[1];
	document.getElementById("lu-panel").src = updateText.split("	")[2];
}

function notify(image) {
	if (!Notification) {
		alert("Prague Race updated!");
		return;
	}

	if (Notification.permission !== "granted"){ //if you didn't get permission
		Notification.requestPermission();
	}
	else { //if you did though
		var notification = new Notification("Prague Race updated!", {
			icon: image,
			body: "PRUN just noticed an update to Prague Race, you should go check it out!",
		});

		notification.onclick = function() {
			window.open("http://www.praguerace.com/");
			notification.close();      
		};

		setTimeout(function() {
			notification.close();
		}, 60000);
	}
}
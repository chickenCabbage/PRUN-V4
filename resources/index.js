var indexFlag = true;
var updateText;
var lastCheckTime = 0;

window.onLoad = jQuery.get("/update.txt", function(data, status) { //init
	updateText = data;
	document.getElementById("lu-time").innerHTML = updateText.split("	")[0] + " : Last update";
	document.getElementById("lu-title").innerHTML = "Update title : " + updateText.split("	")[1];
	document.getElementById("lu-panel").src = updateText.split("	")[2];

	var img = document.getElementById("lu-panel");
	var width = img.clientWidth;
	var height = img.clientHeight + (img.clientHeight / 4);
	var offset = (Math.random() * (height - (height / 2))) - (height / 2)
	img.style.bottom = offset + "px";

	setInterval(function() {
		document.getElementById("status").innerHTML = "Checked " + lastCheckTime + " seconds ago."
		if (lastCheckTime == 10){ //reset the check loop
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
			document.getElementById("lu-time").innerHTML = updateText.split("	")[0] + " : Last update";
			document.getElementById("lu-title").innerHTML = "Update title : " + updateText.split("	")[1];
			document.getElementById("lu-panel").src = updateText.split("	")[2];
			notify(updateText.split("	")[2]);
		}
		updateText = data;
	});
}
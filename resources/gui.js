function toggleNav() {
	var nav = document.getElementById("nav");
	if(nav.style.top == "0%") {
		nav.style.top = "95%";
	}
	else {
		nav.style.top = "0%";
		document.getElementById("arrow");
	}
}
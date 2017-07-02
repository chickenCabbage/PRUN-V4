function ayo() {
	alert("ayy lmao");
}

window.onscroll = function() {
	var openNav = jQuery("#openNav").visible(true);
	var closeNav = jQuery("#closeNav").visible(true);
	if(openNav && closeNav) {
		document.getElementById("openNav").style.opacity = "0";
		document.getElementById("closeNav").style.opacity = "0";
	}
	else if(openNav) {
		document.getElementById("openNav").style.opacity = "1";
		document.getElementById("closeNav").style.opacity = "0";
	}
	else {
		document.getElementById("openNav").style.opacity = "0";
		document.getElementById("closeNav").style.opacity = "1";
	}
}
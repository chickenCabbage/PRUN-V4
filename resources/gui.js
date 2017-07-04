var hidden = true;
function toggleNav() {
	var nav = document.getElementById("nav");
	if(hidden) { //if it's closed
		hidden = false;
		jQuery("html, body").animate({ //scroll to the bottom
			scrollTop: jQuery(document).height()
		}, "slow", "swing");
	}
	else { //if it's open
		hidden = true;
		jQuery("html, body").animate({ //scroll to the top
			scrollTop: 0
		}, "regular", "swing");
	}
}

window.onscroll = function() {
	var openNav = jQuery("#openNav").visible(true);
	var closeNav = jQuery("#closeNav").visible(true);
	if(openNav && closeNav) {
		document.getElementById("openNav").style.opacity = "0";
		document.getElementById("closeNav").style.opacity = "0";
	}
	else if(openNav) { //if you can see only the top arrow
		document.getElementById("openNav").style.opacity = "1";
		document.getElementById("closeNav").style.opacity = "0";
		hidden = true;
	}
	else { //if you can see only the bottom arrow
		document.getElementById("openNav").style.opacity = "0";
		document.getElementById("closeNav").style.opacity = "1";
		hidden = false;
	}
}
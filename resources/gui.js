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
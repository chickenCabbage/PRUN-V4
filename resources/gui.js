var open = true;
function toggleNav() {
	var nav = document.getElementById("nav");
	if(open) { //if it's closed
		open = false;
		jQuery("html, body").animate({ //scroll to the bottom
			scrollTop: jQuery(document).height()
		}, "slow", "swing");
	}
	else { //if it's open
		open = true;
		jQuery("html, body").animate({ //scroll to the top
			scrollTop: 0
		}, "regular", "swing");
	}
}
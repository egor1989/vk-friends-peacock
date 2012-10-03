function fill_friend_list(friend_list) {
    console.time('fill_friend_list');
    $('.contact').remove();
    friend_list.forEach(function(e) {
	var mobile = "";

	if (e.mobile_phone !== undefined) {
	    mobile = e.mobile_phone;
	}

        $('div.sc_menu').append("<a title='" + mobile + "'" + "class='contact' href='#' onclick='peacock(" + e.uid  + ", 1);'>"
				+ "<img class='contact_photo fl_l' src='" + e.photo + "'/>"
				+ "<span class='contact_name fl_l'>" + e.first_name + " " + e.last_name + "</span>"
				+ "</a>");
    });
    console.timeEnd('fill_friend_list');
}

function addColumns(friends) {
    if (friends === undefined || friends.length === 0) 
        return;
    $("#friends_table tr:first").append("<th>/</th>");
    friends.forEach(function(friend) {
        $("#friends_table tr:first").append("<th><img src=" + friend.photo + "><br>" + friend.first_name + "<br>" + friend.last_name + "</th>");
        if (friend.gr_id == i) console.log(friend.uid);
    });
}


function addRows(friends_table, friends) {
    for (i = 0; i < friends.length; i++) {
        // build row
        row = [];
    
        for (i_row = 0; i_row < friends.length + 1; i_row++) {
            row.push("");
        }
    
        for (k = 0; k < friends[i].friends.length; k++) {
    
            index = 0;
            friends.filter(function(e, idx, a) {
                if (e.uid === friends[i].friends[k].uid) index = idx;
            });
    
            row[0] = "<b><center>" + friends[i].first_name + " " + friends[i].last_name + "</center></b>";
            if (friends[i].friends[k].weight > 0) row[index + 1] = friends[i].friends[k].weight;
        }
    
        friends_table.fnAddData(row);
    }/*
    var c = $("#friends_table tr:first th").length; 
    var i = 0;
    friends.forEach(function(friend) {
        i++;
        var new_column = [];
        new_column.push("<center><b><img src=" + friend.photo + "><br>" + friend.first_name + "<br>" + friend.last_name + "</b></center>");
        for (j = 1; j < c; j++) {
            new_column.push("<center>"+i+"</center>");
        }
        friends_table.fnAddData(new_column);
    });*/
}

function createFriendsTable(friends) {
    //var old_table = $('#friends_table').dataTable({"bSort": false});
    //old_table.fnDestroy();
    addColumns(friends);
    var friends_table = $('#friends_table').dataTable({
        "bPaginate": false,
        "bLengthChange": false,
        "bFilter": true,
        "bSort": false,
        "bInfo": false,
        "bAutoWidth": false,
        "sScrollX": "100%",
        "sScrollY": "100%"
    });
    
    addRows(friends_table, friends);
    
    $("#friends_table td").heatcolor(

    function() {
        return $(this).text();
    }, {
        lightness: 0,
        colorStyle: 'greentored',
        maxval: 4,
        minval: 1,
        reverseOrder: true
    });
    /*$('td', friends_table.fnGetNodes()).hover(function() {
        var iFirstTdId = $('td').index(friends_table.fnGetNodes(0).children[0]);
        // 4 - column number, -1 - because of VK login button, i guess it creates td
        var iCol = ($('td').index(this) - iFirstTdId) % 4;
        var nTrs = friends_table.fnGetNodes();
        $('td:nth-child(' + (iCol + 1) + ')', nTrs).addClass('highlighted');
    }, function() {
        $('td.highlighted', friends_table.fnGetNodes()).removeClass('highlighted');
    });*/
    new FixedColumns( friends_table );
}
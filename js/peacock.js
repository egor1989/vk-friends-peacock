function authInfo(response) {
    if (response.session) {
        console.log('user has logged in:', response.session.mid);
        $('#login_button').remove();
        $('#graph_stage, #table_stage, #search_by_id').show();
        peacock(response.session.mid, 1);
    }
    else {
        console.log('auth failed');
        alert('sorry, authentification failed');
    }
}

function peacock(root_uid, depth) {
    var peacock = new PeacockPlot(root_uid, depth);
    peacock.getUserData();
    return;
}

function setGroups(mutual_friends) {
    console.log('Setting user groups:');
    for (var friend_id = 0; friend_id < mutual_friends.length; friend_id++) {
        var group = false;
        for (var i = 0; i < mutual_friends[friend_id].friends.length - 1; i++) {
            if (mutual_friends[friend_id].friends[i].uid <= mutual_friends[friend_id].uid)
                continue;
            var curr_friend = getFriendById(mutual_friends[friend_id].friends[i].uid);
            for (var j = i + 1; j < mutual_friends[friend_id].friends.length; j++) {
                for (var k = 0; k < curr_friend.friends.length; k++) {
                    if (curr_friend.friends[k].uid == mutual_friends[friend_id].friends[j].uid) {
                        group = true;
                        break;
                    }
                }
                if (group) {
                    if (!mutual_friends[friend_id].gr_id) {
                        mutual_friends[friend_id].gr_id = ++gl_groups;
                    }
                    setUserGroup(mutual_friends[friend_id].gr_id, mutual_friends[friend_id].friends[i].uid);
                    setUserGroup(mutual_friends[friend_id].gr_id, mutual_friends[friend_id].friends[j].uid);
                    group = false;
                }
            }
        }
    }
}

function setUserGroup(gr_id, uid) {
    for (var friend_id = 0; friend_id < gl_root.friends.length; friend_id++) {
        if (gl_root.friends[friend_id].uid == uid) {
            gl_root.friends[friend_id].gr_id = gr_id;
            return;
        }
    }
}

function getFriendById(uid) {
    for (friend_id = 0; friend_id < gl_root.friends.length; friend_id++) {
        if (gl_root.friends[friend_id].uid == uid) {
            return gl_root.friends[friend_id];
        }
    }
}

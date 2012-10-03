/**
 * Created with JetBrains WebStorm.
 * User: vlad
 * Date: 01.10.12
 * Time: 17:08
 * To change this template use File | Settings | File Templates.
 */
function PeacockPlot (root_uid, depth) {
    this.root_uid = root_uid;
    this.depth = depth;
    this.VKExecMaxCalls = 25;
    this.timeout = 300;
}

PeacockPlot.prototype.getCachedData = function() {
    var node = JSON.parse(localStorage.getItem(this.root_uid));
    node ?
        console.log('no cached data found'):
        console.log('cached data loaded succesfully');
    return node;
}

PeacockPlot.prototype.fillFriendsList = function() {
    var friends = this.root.friends;
    console.time('fill_friend_list');
    $('.contact').remove();
    friends.forEach(function(e) {
        var mobile = "";

        if (e.mobile_phone !== undefined) {
            mobile = e.mobile_phone;
        }

        $('div.sc_menu').append("<a title='" + mobile + "'" + "class='contact' href='#' onclick='peacock(" + e.uid  + ", 1); return false;'>"
            + "<img class='contact_photo fl_l' src='" + e.photo + "'/>"
            + "<span class='contact_name fl_l'>" + e.first_name + " " + e.last_name + "</span>"
            + "</a>");
    });
    console.timeEnd('fill_friend_list');
}

PeacockPlot.prototype.startPerformance = function() {
    peacock_view.plot(this.root);
}

PeacockPlot.prototype.stop = function() {
    console.log('canceled');
    this.stop = true;
}

PeacockPlot.prototype.getMutualFriends = function(pos) {
    var self = this;
    if (!pos)
        pos = 0;
    var friends = _.pluck(self.root.friends.slice(pos, pos + this.VKExecMaxCalls / 2), 'uid'),
        timerFrom = new Date().getTime();
    VK.Api.call('execute', {
        code: funcToVKString({root_uid: self.root_uid, friends: friends}, 'function () {\
            var i = 0,\
                result = [];\
            while (i < friends.length) {\
                var mutual = API.friends.getMutual({\
                    target_uid: friends[i],\
                    source_uid: root_uid,\
                    test_mode: 1\
                });\
                var wall = API.wall.get({\
                    owner_id: friends[i],\
                    count: 100,\
                    filter: "others",\
                    test_mode: 1\
                })@.from_id;\
                result = result + [{uid:friends[i], mutual:mutual, wall: wall}];\
                i = i + 1;\
            }\
            return result;\
        }')
    }, function(r) {
        calcProgress(pos, self.root.friends.length);
        // removing ourself and himself from friends
        $.each(r.response, function(i, val) {
            self.root.friends[i + pos].mutual = _.without(val.mutual, self.root_uid, val.uid );
            self.root.friends[i + pos].wall = val.wall ? val.wall.slice(1, 101): [];
            self.root.friends[i + pos].friends = [];
            self.root.friends[i + pos].gr_id = 0;
        });
        pos += friends.length;
        if (self.stop)
            return;
        if (pos < self.root.friends.length) {
            setTimeout(function() {
                try {
                    self.getMutualFriends(pos);
                } catch (ex) {
                    console.error('VK error\n%o', ex);
                    self.getMutualFriends(pos);
                }
            }, self.timeout - (new Date().getTime() - timerFrom));
        }
        else {
            calcProgress(1, 1);
            self.getWeights();
            self.cacheData();
            // TODO: graph builder should be called here
            setTimeout(hideProgressBar(), 500);
            self.startPerformance();
            console.log("finished.\n%o", self.root);
        }
    });
}

PeacockPlot.prototype.startPerformance = function() {
    peacock_view.plot(this.root);
}

PeacockPlot.prototype.cacheData = function() {
    console.log('caching');
    try {
        var root = this.root;
        // очищаем лишние данные
        $.each(root.friends, function(i, friend) {
            delete friend.wall;
        });
        localStorage.setItem(root.uid, JSON.stringify({root: root}));
    } catch(ex) {
        console.log('cache failed');
    }

}

PeacockPlot.prototype.getUserData = function() {
    var self = this,
        data = self.getCachedData(),
        root_uid = self.root_uid;

    if (data) {
        self.root = data.root;
        self.fillFriendsList();
        self.startPerformance();
        return;
    }

    showProgressBar(function() {
        self.stop();
    });
    VK.Api.call('execute',
        {
            code:funcToVKString({root_uid:root_uid}, function () {
                var root = API.getProfiles({
                    uids:root_uid,
                    fields:"uid, first_name, last_name, photo",
                    test_mode:1
                });
                var friends = API.friends.get({
                    uid:root_uid,
                    fields:"uid, first_name, last_name, photo, contacts",
                    test_mode:1
                });
                return {root:root[0], friends:friends};
            })
        }, function (r) {
            console.log(r);
            self.root = r.response.root;
            self.root.friends = r.response.friends;
            // removing ourself from friends
            self.root.friends = _.reject(r.response.friends, function (f) {
                return f.uid == root_uid;
            });
            self.fillFriendsList();
            self.getMutualFriends();
        }
    );
}

PeacockPlot.prototype.getWeights = function() {
    var self = this;
    $.each(self.root.friends, function(i, friend) {
        var mutual = friend.mutual,
            wall = friend.wall;
        if (mutual.length) {
            mutual.forEach(function(uid) {
                var new_connection = {
                    uid: uid,
                    weight: 0
                };
                var groups = _.groupBy(wall, function(msg){
                    return msg;
                });
                new_connection.weight = groups[uid] ? groups[uid].length : 0;
                friend.friends.push(new_connection);
            });
        }
    });
}

function funcToVKString(options, func) {
    var str = typeof func == 'function' ? func.toString() : func,
        fromPattern = 'function () {',
        from = str.indexOf(fromPattern) + fromPattern.length + 1,
        to = str.length - 1,
        result = str.substring(from, to);
    if (options) {
        $.each(options, function(i, val) {
            var option = 'var ' + i + '=' + JSON.stringify(val) + ';';
            result = option + result;
        });
    }
    //console.log(result);
    return result;
}
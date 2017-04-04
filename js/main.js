var log = "https://api.github.com/repos/gustavoquinalha/seotopper/events?per_page=1000";
d3.json(log, makeChart);


function makeChart(eventsJSON) {
    var dataArray = [],
        dataKeyVal = [],
        perDay = {};

    for (item in eventsJSON) {
        var d = new Date(eventsJSON[item].created_at).getDate();

        if (perDay[d]) {
            var t = perDay[d];
            perDay[d] = t + 1;
        } else {
            perDay[d] = 1;
        }
        var fillColor = "#eee";
        var event = "";

        if (eventsJSON[item].type == "WatchEvent") {
            fillColor = "#f1c40f";
            event = "starred";
        }
        if (eventsJSON[item].type == "ForkEvent") {
            fillColor = "#ff4455";
            event = "forked";
        }
        if (eventsJSON[item].type == "PullRequestEvent") {
            fillColor = "#8F4A3F";
            event = "pull request";
        }
        if (eventsJSON[item].type == "PushEvent") {
            fillColor = "#BF4330";
            event = "pushed";
        }
        if (eventsJSON[item].type == "IssueCommentEvent") {
            fillColor = "#295E4F";
            event = "commented";
        }
        if (eventsJSON[item].type == "CreateEvent") {
            fillColor = "#252525";
            event = "created";
        }

        dataKeyVal.push({
            "date": d,
            "type": event,
            "fill": fillColor,
            "avatar": eventsJSON[item].actor.avatar_url,
            "user": eventsJSON[item].actor.login
        });

        var ith = perDay[d];
        var details = "";
        if (eventsJSON[item].payload.pull_request) {
            details = eventsJSON[item].payload.pull_request.title;
        }

        $('#log').append("<div class='item'><div class='container-flex2'><div class='item2'><img class='img-log' src='" + eventsJSON[item].actor.avatar_url + "' width='42'/></div><div class=' item3'><a class='link' href='http://github.com/" +
            eventsJSON[item].actor.login + "' target='_blank'>" +
            eventsJSON[item].actor.login +
            "</a> <br><time class='time'> " + eventsJSON[item].created_at + "</time></div><div class='item3'> " + event + " <span class='details'>" + details + "</span></div><div class='item3  time'>" + eventsJSON[item].created_at + "<div></div></div>");

        dataArray.push(eventsJSON[item]);
    }

    var timeBlock = d3.select(".time")
        .selectAll("div")
        .data(perDay)
        .enter().append("div")


    var blocks = d3.select(".blocks")
        .selectAll("div")
        .data(dataKeyVal)
        .enter().append("div")
        .style("background-color",
            function(d) {
                return d.fill;
            })
        .style("background-image",
            function(d) {
                return "url(" + d.avatar + ")";
            })
        .text(function(d) {
            return d.type
        });
}

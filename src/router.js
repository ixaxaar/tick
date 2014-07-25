var express = require('express');
var router = express.Router();

var Timer = require('./timer');
var settings = require(process.cwd() + "/settings.json");

var pinger = false;
var timers = [];

router.get('/start', function(req, res) {
    if (pinger) return res.send(403); // forbidden

    try {
        pinger = true;
        settings.pingList.forEach(function(p) {
            var server = {};
            server.period = p.period;
            server.callback = p.address;
            server.concurrency = p.concurrency;
            server.method = p.method;
            server.data = p.data;

            timer = new Timer(server);
            timer.start();
            timers.push(timer); // handle stops too
        });
        res.send(200);
    }
    catch (e) {
        res.send(500);
    }

});


router.post('/timer', function(req, res) {
    var body = req.body;

    try {
        var timer = new Timer(body);
        timer.start();
        timers.push(timer); // handle stops too
        res.send(200);
    }
    catch (e) {
        res.send(500);
    }
});


// for everything else
router.all('*', function(req, res) {
    res.send(404);
});


module.exports = router;

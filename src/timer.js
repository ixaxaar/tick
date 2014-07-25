
var request = require('request');

var cyclicTimer = function(t) {
    if (!t.callback) return null;

    this.timeout = t.period || 60*1000; // 1 min default timeout
    this.callback = t.callback;
    this.concurrency = t.concurrency || 1;
    this.method = t.method || "GET";
    this.data = t.data || null;
    this.notify = this.notify.bind(null, this);

    return this;
};

cyclicTimer.prototype.tick = function(callback) {
    // run the timer for one tick
    setTimeout(this.notify, this.timeout);

    return this;
};

cyclicTimer.prototype.start = function() {
    // run the timer cyclically
    this.__timer = setInterval(this.notify, this.timeout);

    return this;
};

cyclicTimer.prototype.stop = function() {
    clearInterval(this.__timer);
    this.__timer = null;

    return this;
};

cyclicTimer.prototype.notify = function(that, cb) {
    // call the callback "concurrency" number of times the callback is called
    // each time the timer expires
    try {
        for (var ctr = 0; ctr < that.concurrency; ctr++) {
            request({
                method: that.method,
                uri: that.callback,
                json: that.data
            }, function(err, res, body){
                if (cb) cb(err,res);
            });
        }
    }
    catch (e) {
        console.log(e);
        if (cb) cb(e);
    }
};

module.exports = cyclicTimer;


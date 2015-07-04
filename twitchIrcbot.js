var ircbot = require('./ircbot.js');

var options, callbacks;
var channelMap;

function init(r_options, r_callbacks){
    options = r_options;
    callbacks = r_callbacks;
    ircbot.init(options, callbacks);       
}

function connect(){
    ircbot.connect();
}


module.exports = {
    init: init,
    connect: connect
};

var ircbot = require('./ircbot.js');

var options, callbacks;
var channelMap;

function init(r_options){
    options = r_options;
    ircbot.init(options, callbacks);       
}

function connect(){
    ircbot.connect();
}

function onLoginSuccess(){
    console.log('loginSuccess');
}

callbacks = {
    onLoginSuccess: onLoginSuccess
}


module.exports = {
    init: init,
    connect: connect
};

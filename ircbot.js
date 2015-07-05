var net = require('net');
var ircSocket = new net.Socket();
var __ = require('underscore');
var options, callbacks;
/*options = {
 * logger: fn,
 * port: number,
 * host: string,
 * username: string,
 * password: string,
 * autoJoinChannelList: []
 * }
 * 
 * callbacks = {
 * loginSuccess: fn()
 *
 * }
 *
 * */

function log(logType, context){
    var prefix;
    switch(logType){
        case 'send':
            prefix = '>>';
            break;
        case 'receive':
            prefix = '<<';
            break;
        case 'sys':
            prefix = '[SYS]';
            break;
        default:
            prefix = '';
    }

    var logText = prefix + ' ' + context;
    if(logText.indexOf('\r\n')<0){
        logText = logText + '\r\n';
    }
    if(typeof options.logger==='function'){
        logger(logText);
    }else{
        process.stdout.write(logText);
    }
}

function invokeCallback(callbackName, argList){
    if(typeof callbacks[callbackName] === "function"){
        callbacks[callbackName].apply(null, argList);
    }
}

function parseMessage(message){
    //get rid of heading spaces
    while(message.length>0 && message.charAt(0) !== ':' && message.charAt(0) !== 'P'){
        message = message.substr(1);
    }

    if(message.length == 0){
        return;
    }
    
    if(message.indexOf("PING") === 0){
        var args = message.split(' ');
        var pong='';
        if(args.length>=2){
            pong = args[1];
        }
        send('PONG', pong);
        return;
    }


    var args = message.split(' ');
    var callbackName = args[1], argList=[];
    switch(args[1]){
        case '001':
            callbackName = 'onLoginSuccess';
            send("JOIN","#tetristhegrandmaster3");
            break;
        default:
            return;
    }
    invokeCallback(callbackName, argList);
}

function send(command, message){
    message = command + ' ' + message + '\r\n';
    log('send', message);
    ircSocket.write(message,'utf8');
}

function onReceive(message){
    message = message.toString();
    log('receive', message);
    var messages = message.split('\r\n');
    __.each(messages, function(message){
        parseMessage(message);
    });
}

function onConnect(){
    log("sys", "connected");
    send('PASS',options.password);
    send('NICK',options.username);
    send('USER','JtChat2');
    //ircSocket.destroy();
}

function onClose(){
    log('sys', 'closed');
}

function onError(error){
    log("sys", "error");
}

function init(r_options, r_callbacks){
    options = r_options;
    callbacks = r_callbacks;
    ircSocket.on("error", onError);
    ircSocket.on("close", onClose);
    ircSocket.on("data", onReceive);
}

function connect(){
    ircSocket.connect(options.port, options.host, onConnect);
}

module.exports = {
    init: init,
    connect: connect,
    send: send
};


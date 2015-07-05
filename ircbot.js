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
 * autoJoinChannels: []
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

function getSenderNickname(sender){
    var exclamationMarkPos = sender.indexOf('!');
    if(exclamationMarkPos === -1){
        return sender;
    }
    return sender.substr(0,exclamationMarkPos ).replace(':','');
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


    var args = message.split(' ',4);
    var sender  = args[0]? args[0]: '';
    sender = getSenderNickname(sender);
    var command = args[1]? args[1]: '';
    var target  = args[2]? args[2]: '';
    var context = args[3]? args[3]: '';



    var callbackName, argList=[];
    switch(command){
        case '001':
            callbackName = 'onLoginSuccess';
            break;
        case '421':
            callbackName = 'onUnknownCommand';
            break;
        case 'JOIN':
            if(sender === options.username){
                enterChannel(target);
                callbackName = 'onJoinChannel';
                send("NAMES", target);
            }
            break;
        case 'PRIVMSG':
            if(target.indexOf('#') > -1){
                callbackName = 'onChatMessage';
            }
            break;
        default:
            return;
    }
    if(typeof callbackName !== 'undefined'){
        invokeCallback(callbackName, argList);
    }
    if(command == '001' && options.autoJoinChannels instanceof Array){
        __.each(options.autoJoinChannels, function(channel){
            joinChannel(channel);
        });
    }
}


function sendRaw(message){
    if(message.indexOf('\r\n') < 0){
        message = message+'\r\n';
    }
    log('send', message);
    ircSocket.write(message,'utf8');
}

function send(command, message){
    message = command + ' ' + message;
    sendRaw(message);
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
    channelMap={};
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
    options = __.extend({},r_options);
    callbacks = __.extend({},r_callbacks);
    ircSocket.on("error", onError);
    ircSocket.on("close", onClose);
    ircSocket.on("data", onReceive);
}

function connect(){
    ircSocket.connect(options.port, options.host, onConnect);
}


var channelMap={};

function enterChannel(channelName){
    delete channelMap[channelName];
    channelMap[channelName]={
        
        userList: [],
        opList: []
    }
}


//irc actions
function joinChannel(channelName){
    send("JOIN","#"+channelName);
}



module.exports = {
    init: init,
    connect: connect,
    send: send,
    sendRaw: sendRaw
};


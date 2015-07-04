var net = require('net');
var ircSocket = new net.Socket();
var options, callbacks;
/*options = {
 * logger: fn,
 * port: number,
 * host: string,
 * username: string,
 * password: string,
 * autoJoinChannelList: []
 * }*/

function log(context, logType){
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

function send(command, message){
    message = command + ' ' + message + '\r\n';
    log(message, 'send');
    ircSocket.write(message,'utf8');
}

function onReceive(message){
    log(message, 'receive');
}

function onConnect(){
    log("connected", "sys");
    send('PASS',options.password);
    send('NICK',options.username);
    send('USER','JtChat2');
    //ircSocket.destroy();
}

function onClose(){
    log('closed', 'sys');
}

function onError(error){
    log("error", "sys");
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
    connect: connect
};


//STUFFPEDANIMALWAR HTTPS
//EXAMPLE STARTED FROM: http://socket.io/get-started/chat/
const express = require('express');
const app = express();
let cors = require('cors');
let fs = require('fs');
let https = require('https');
let bodyParser = require('body-parser');
/////////////////////////////////////////////////
//these ports must be opened up in the default security group on dreamcompute
//https://iad2.dreamcompute.com/project/security_groups/ => Manage Rules
//this can be overridden by passing the port as the first parameter to this file
let listenPort =55556;
const options = {
    key: fs.readFileSync('/etc/letsencrypt/live/stuffedanimalwar.com/privkey.pem'),
    cert: fs.readFileSync('/etc/letsencrypt/live/stuffedanimalwar.com/fullchain.pem')
};

//setup an express application and bind it to an https server
const server = https.createServer(app);
const { Server } = require("socket.io");
const io = new Server(server);

//serve .css and .js and media files
app.use(express.static(__dirname));

//GET PORT TO USE
if(process.argv.length !== 3){
    console.log(`NO PORT SPECIFIED. USING DEFAULT ${listenPort}`);
}
else{
    listenPort = process.argv[2];
    console.log(`PORT SPECIFIED. USING ${listenPort}`);
}

server.listen(listenPort, () => {
    console.log(`listening on *:${listenPort}`);
});

//PAGE MAPPINGS
//IF PUTTING  A NEW PAGE, AND THAT PAGE SUPPORTS CHAT OR STUFFEDANIMAL WAR, DONT FORGET TO ADD THE SOCKET EVENT HANLDER FOR THE PAGE BELOW
app.get('/', function(req, res){
    console.log(req);
        //send a file back as the response
        res.sendFile(__dirname + '/index.html');
});

/**
 * 111111111111111
 */
app.get('/fromkittehwithlove', function(req, res){
        //send a file back as the response
        res.sendFile(__dirname + '/fromkittehwithlove.html');
        });


//ON PERSISTENT CONNECTION
//handler for incoming socket connections
io.on('connection', function(socket){
    let chatClientAddress = socket.handshake.address;
    let chatServerDate = new Date();
    let connectMsgObject = {
                  CHATSERVERUSER:chatClientAddress,
                  CHATSERVERDATE:chatServerDate,
                  CHATCLIENTUSER:chatClientAddress,
                  CHATCLIENTMESSAGE:'CONNECT'
     }; 
    console.log('CONNECT');
    console.log(JSON.stringify(connectMsgObject));
    io.emit('connectSocketEvent',connectMsgObject);

    
    //COMMON--------------------------------------------------------------------------------------
    socket.on('disconnect', function(){
        let chatClientAddress = socket.handshake.address;
        let chatServerDate = new Date();
        let disconnectMsgObject = {
                CHATSERVERUSER:chatClientAddress,
                CHATSERVERDATE:chatServerDate,
                CHATCLIENTUSER:chatClientAddress,
                CHATCLIENTMESSAGE:'DISCONNECT'
         }; 
        console.log('DISCONNECT');
        io.emit('disconnectSocketEvent',disconnectMsgObject);
    });
         
    //ON ERROR
    socket.on('error', function(errorMsgObject){
              console.log('ERROR: ' + errorMsgObject  );
    });
    /**
     * 2 - define what happens when a connection sends a chat message to the server
     */
    socket.on('fromkittehwithlovechatmessage', function(chatMsgObject){
        //emit to everyone else
        sendChatMessage('fromkittehwithlovechatmessage',chatMsgObject);
    });
    /*
     * 2 - define what happens when a connection sends a stuffedanimalwar tap message to the server
     */
    socket.on('fromkittehwithlovetapmessage', function(tapMsgObject){
        //emit to everyone else
        sendTapMessage('fromkittehwithlovetapmessage',tapMsgObject);
    });

    //GENERIC CHATMESSAGE SENDER, FOR MULTIPLE, INDEPENDENT CHAT CHANNELS   
    function sendChatMessage(chatSocketEvent,chatMsgObject){
        //GET THE ADDRESS AND DATE
        let chatClientAddress = socket.handshake.address;
        let chatServerDate = new Date();

        //update the emitted json object with server information
        chatMsgObject.CHATSERVERUSER = chatClientAddress;
        chatMsgObject.CHATSERVERDATE = chatServerDate;

        console.log(JSON.stringify(chatMsgObject));

        //broadcast
        io.emit(chatSocketEvent,chatMsgObject);
    }
    //GENERIC TAPMESSAGE SENDER, FOR MULTIPLE, INDEPENDENT CHAT CHANNELS
    function sendTapMessage(tapSocketEvent,tapMsgObject){
        
        //GET THE ADDRESS AND DATE
        let tapClientAddress = socket.handshake.address;
        let tapServerDate = new Date();
        
        //update the emitted json object with server information
        tapMsgObject.CHATSERVERUSER = tapClientAddress;
        tapMsgObject.CHATSERVERDATE = tapServerDate;
         
        console.log(JSON.stringify(tapMsgObject));
        
        //broadcast TAP message (client page needs to have  a socket.on handler for this)
        io.emit(tapSocketEvent,tapMsgObject);
        
    } 
});




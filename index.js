//STUFFPEDANIMALWAR HTTP JAEMZWARE
//EXAMPLE STARTED FROM: http://socket.io/get-started/chat/
//setup an express application and bind it to an https server
let fs = require('fs');
const express = require('express');
const app = express();
const https = require('https');
const multer = require('multer');
const upload = multer({ storage: multer.memoryStorage() });
//THESE NEED TO BE CREATED LOCALLY IF YOU WANT TO RUN LOCALLY
//openssl genrsa -out key.pem 2048
//openssl req -new -sha256 -key key.pem -out csr.csr
//openssl req -x509 -sha256 -days 365 -key key.pem -in csr.csr -out certificate.pem
// const options = {
//     key: fs.readFileSync('./sslcert/key.pem'),
//     cert: fs.readFileSync('./sslcert/certificate.pem')
// };
const options = {
    key: fs.readFileSync('/etc/letsencrypt/live/stuffedanimalwar.com/privkey.pem'),
    cert: fs.readFileSync('/etc/letsencrypt/live/stuffedanimalwar.com/fullchain.pem')
};
const server = https.createServer(options, app);
const { Server } = require("socket.io");
const io = new Server(server);
let listenPort =55556;

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
 * 1 - define endpoint to serve your custom stuffedanimalwar page (e.g. fromkittehwithlove.html)
 */
app.get('/fromkittehwithlove', function(req, res){
        //send a file back as the response
        res.sendFile(__dirname + '/fromkittehwithlove.html');
        });
app.get('/maddie', function(req, res){
    //send a file back as the response
    res.sendFile(__dirname + '/maddie.html');
});
/**
 * 2 - define endpoint to upload photos to your custom stuffedanimalwar page (e.g. fromkittehwithlove.html)
 */
app.post('/fromkittehwithloveuploadchatimage', upload.single('image'), (req, res) => {
    if (!req.file) {
        return res.status(400).json({ success: false, message: 'No file uploaded.' });
    }

    // Convert the image buffer to a base64 string
    const imageData = `data:${req.file.mimetype};base64,${req.file.buffer.toString('base64')}`;

    let chatImageMessageObject = {
        CHATCLIENTUSER: 'anonymous',
        CHATSERVERUSER: '',
        CHATCLIENTIMAGE: imageData,
        CHATSERVERDATE: ''
    };

    // Step 1: Extract the base64 part (remove the prefix)
    const base64Data = imageData.split(';base64,').pop();

// Step 2: Decode the base64 string to binary data
    const binaryData = Buffer.from(base64Data, 'base64');

// Step 3: Calculate the size in bytes
    const sizeInBytes = binaryData.length;
    console.log("RAW FILE UPLOAD " + sizeInBytes + " BYTES");

    /**
     * 3 - broadcast the right event for you your custom stuffedanimalwar page. the name must match chatImageSocketEvent in your custom stuffedanimalwar page (e.g. fromkittehwithlove.html)
     */
    // Broadcast the image data to all connected Socket.IO clients
    io.emit('fromkittehwithloveuploadchatimage', chatImageMessageObject);

    res.status(200).json({ success: true, message: 'Image uploaded and broadcasted.' });
});
app.post('/maddieuploadchatimage', upload.single('image'), (req, res) => {
    if (!req.file) {
        return res.status(400).json({ success: false, message: 'No file uploaded.' });
    }

    // Convert the image buffer to a base64 string
    const imageData = `data:${req.file.mimetype};base64,${req.file.buffer.toString('base64')}`;

    let chatImageMessageObject = {
        CHATCLIENTUSER: 'anonymous',
        CHATSERVERUSER: '',
        CHATCLIENTIMAGE: imageData,
        CHATSERVERDATE: ''
    };

    // Step 1: Extract the base64 part (remove the prefix)
    const base64Data = imageData.split(';base64,').pop();

// Step 2: Decode the base64 string to binary data
    const binaryData = Buffer.from(base64Data, 'base64');

// Step 3: Calculate the size in bytes
    const sizeInBytes = binaryData.length;
    console.log("RAW FILE UPLOAD " + sizeInBytes + " BYTES");

    /**
     * 3 - broadcast the right event for you your custom stuffedanimalwar page. the name must match chatImageSocketEvent in your custom stuffedanimalwar page (e.g. maddie.html)
     */
    // Broadcast the image data to all connected Socket.IO clients
    io.emit('maddieuploadchatimage', chatImageMessageObject);

    res.status(200).json({ success: true, message: 'Image uploaded and broadcasted.' });
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
     * 4 - define what happens when a connection sends a chat message to the server. the name must match chatSocketEvent in your custom stuffedanimalwarpage (e.g. fromkittehwithlove.html)
     */
    socket.on('fromkittehwithlovechatmessage', function(chatMsgObject){
        //emit to everyone else
        sendChatMessage('fromkittehwithlovechatmessage',chatMsgObject);
    });
    socket.on('maddiechatmessage', function(chatMsgObject){
        //emit to everyone else
        sendChatMessage('maddiechatmessage',chatMsgObject);
    });

    /*
     * 5 - define what happens when a connection sends a tap message to the server. the name must match tapSocketEvent in your custom stuffedanimalwarpage (e.g. fromkittehwithlove.html)
     */
    socket.on('fromkittehwithlovetapmessage', function(tapMsgObject){
        //emit to everyone else
        sendTapMessage('fromkittehwithlovetapmessage',tapMsgObject);
    });
    socket.on('maddietapmessage', function(tapMsgObject){
        //emit to everyone else
        sendTapMessage('maddietapmessage',tapMsgObject);
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




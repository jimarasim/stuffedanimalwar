//STUFFPEDANIMALWAR HTTP JAEMZWARE
//EXAMPLE STARTED FROM: http://socket.io/get-started/chat/
//setup an express application and bind it to an https server
let fs = require('fs');

//SSL CERTS NEED TO BE CREATED LOCALLY IF YOU WANT TO RUN LOCALLY
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

//CREATE EXPRESS AND SOCKET.IO SERVERS
const express = require('express');
const app = express();
const https = require('https');
const multer = require('multer');
const upload = multer({ storage: multer.memoryStorage() });
const server = https.createServer(options, app);
const { Server } = require("socket.io");
const io = new Server(server);
let listenPort =55556;

//GET PORT TO LISTEN TO
if(process.argv.length !== 3){
    console.log(`NO PORT SPECIFIED. USING DEFAULT ${listenPort}`);
}
else{
    listenPort = process.argv[2];
    console.log(`PORT SPECIFIED. USING ${listenPort}`);
}

//CONFIGURE EXPRESS TO SERVE STATIC FILES LIKE IMAGES AND SCRIPTS
app.use(express.static(__dirname));
//CONFIGURE EXPRESS TO TRUST PROXY ON FILE UPLOAD
app.set('trust proxy', true); // Trust the first proxy

//START LISTENING
server.listen(listenPort, () => {
    console.log(`listening on *:${listenPort}`);
});

/**
 * ENDPOINTS & EVENTS[NOTE: BY CONVENTION THERE SHOULD BE AN HTML FILE OF THE SAME NAME FOR EACH ENTRY, CLONED FROM FROMKITTEHWITHLOVE.HTML WITH ITS OWN UNIQUE "endpoint" NAME]
 */
const stuffedAnimalWarEndpoints = ['fromkittehwithlove', 'maddie', 'jacob'];
const stuffedAnimalWarChatSocketEvent = 'chatmessage';
const stuffedAnimalWarTapSocketEvent = 'tapmessage';
const stuffedAnimalWarChatImageSocketEvent = 'uploadchatimage';
const stuffedAnimalWarConnectSocketEvent = 'connect';
const stuffedAnimalWarDisconnectSocketEvent = 'disconnect';
const stuffedAnimalWarPageCounters = stuffedAnimalWarEndpoints.reduce((acc, page) => {
    acc[page] = 0; // Set each page name as a key with an initial value of 0
    return acc;
}, {});

//SERVE INDEX FOR NO ENDPOINT AFTER PORT ADDRESS
app.get('/', function(req, res){
    console.log(req);
        //send a file back as the response
        res.sendFile(__dirname + '/index.html');
});
/**
 * 1 - define endpoints to serve custom stuffedanimalwar pages (e.g. fromkittehwithlove.html, maddie.html)
 */
stuffedAnimalWarEndpoints.forEach(endpoint => {
    //SERVE THE HTML PAGE ENDPOINT
    app.get('/' + endpoint, function(req, res){
        //send a file back as the response
        res.sendFile(__dirname + '/' + endpoint + '.html');
    });
    //UPLOAD AN IMAGE ENDPOINT
    app.post('/' + endpoint + stuffedAnimalWarChatImageSocketEvent, upload.single('image'), (req, res) => {
        if (!req.file) {
            return res.status(400).json({ success: false, message: 'No file uploaded.' });
        }

        //GET THE CLIENT IP
        const clientIp = req.ip;

        //get the date stamp
        let chatServerDate = new Date();

        // Convert the image buffer to a base64 string
        const imageData = `data:${req.file.mimetype};base64,${req.file.buffer.toString('base64')}`;

        let chatImageMsgObject = {
            CHATCLIENTUSER: clientIp,
            CHATSERVERUSER: clientIp,
            CHATCLIENTIMAGE: imageData,
            CHATSERVERDATE: chatServerDate
        };

        // Step 1: Extract the base64 part (remove the prefix)
        const base64Data = imageData.split(';base64,').pop();

// Step 2: Decode the base64 string to binary data
        const binaryData = Buffer.from(base64Data, 'base64');

// Step 3: Calculate the size in bytes
        const sizeInBytes = binaryData.length;
        console.log("RAW FILE UPLOAD " + sizeInBytes + " BYTES FROM:" + clientIp + " AT: " + chatServerDate);

        /**
         * 3 - broadcast the right event for you your custom stuffedanimalwar page. the name must match chatImageSocketEvent in your custom stuffedanimalwar page (e.g. fromkittehwithlove.html)
         */
        // Broadcast the image data to all connected Socket.IO clients
        io.emit(endpoint + stuffedAnimalWarChatImageSocketEvent, chatImageMsgObject);

        res.status(200).json({ success: true, message: 'Image uploaded and broadcasted.' });
    });
});
/**
 *  ON PERSISTENT CONNECTION
 *  handler for incoming socket connections
 *  curl https://ipinfo.io/71.212.60.26 for ip address info (replace ip with desired ip)
 */
io.on('connection', function(socket){
    //Get endpoint that made the connection (passed in .html io() instantiation)
    const endpoint =  socket.handshake.query.endpoint;
    let chatClientAddress = socket.handshake.address;
    let chatServerDate = new Date();
    stuffedAnimalWarPageCounters[endpoint]++;
    let connectMsgObject = {
                  CHATSERVERUSER:chatClientAddress,
                  CHATSERVERDATE:chatServerDate,
                  CHATCLIENTUSER:chatClientAddress,
                  CHATCLIENTMESSAGE:'CONNECT',
                  CHATCLIENTENDPOINT: endpoint,
                  CHATUSERCOUNT: stuffedAnimalWarPageCounters[endpoint]
     }; 
    console.log(JSON.stringify(connectMsgObject));
    io.emit(endpoint + stuffedAnimalWarConnectSocketEvent,connectMsgObject);

    //COMMON--------------------------------------------------------------------------------------
    socket.on('disconnect', function(){
        let chatClientAddress = socket.handshake.address;
        let chatServerDate = new Date();
        stuffedAnimalWarPageCounters[endpoint]--;
        let disconnectMsgObject = {
                CHATSERVERUSER:chatClientAddress,
                CHATSERVERDATE:chatServerDate,
                CHATCLIENTUSER:chatClientAddress,
                CHATCLIENTMESSAGE:'DISCONNECT',
                CHATCLIENTENDPOINT: endpoint,
                CHATUSERCOUNT: stuffedAnimalWarPageCounters[endpoint]
         }; 
        console.log(JSON.stringify(disconnectMsgObject));
        io.emit(endpoint + stuffedAnimalWarDisconnectSocketEvent,disconnectMsgObject);
    });
         
    //ON ERROR
    socket.on('error', function(errorMsgObject){
              console.log('ERROR: ' + errorMsgObject  );
    });

    /**
     * 2 - define sockets to serve custom stuffedanimalwar page Socket Events (e.g. chat message and gameboard tap message)
     */
    stuffedAnimalWarEndpoints.forEach(endpoint => {
        socket.on(endpoint + stuffedAnimalWarChatSocketEvent, function(chatMsgObject){
            //emit to everyone else
            sendChatMessage(endpoint + stuffedAnimalWarChatSocketEvent,chatMsgObject);
        });
        socket.on(endpoint + stuffedAnimalWarTapSocketEvent, function(tapMsgObject){
            //emit to everyone else
            sendTapMessage(endpoint + stuffedAnimalWarTapSocketEvent,tapMsgObject);
        });
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




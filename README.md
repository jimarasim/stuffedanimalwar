stuffedanimalwar is a NodeJS application that uses the Express standalone web server to host interactive web pages utilizing socket.io communication to exchange chat message and tap message data between clients, without the need of data storage.

setup:
1. install node
2. clone this repository
3. run "npm install" from root of repository
4. run "node ." to run stuffedanimalwar. by default it listens on port 55556, to change it just specify the port "node . {port}" e.g. for port 9000 "node . 9000"

fromkittehwithlove.html is a sample of how to create your a custom stuffedanimalwar page.  if you create your own custom stufffedanimalwarpage, you will also have to update index.js and index.html.

index.js - server side javascript that runs Express to host fromkittehwithlove.html and socket.io to respond to fromkittehwithlove.html chatSocketEvent (fromkittehwithlovechatmessage) and fromkittehwithlove.html tapSocketEvent (fromkittehwithlovetapmessage).
if you create your own custom stufffedanimalwarpage, you must add your own socket handlers for chat and tap events. 

fromkittehwithlove.html includes javascript for:
-stuffedanimalwarmechanics.js - for actions in the interactive game pad, or what to do when a tap message object is received from the socket.
-utilities.js - special functions for audio and video players. 
-sockethandler.js - sets up javascript event handlers for fromkittehwithlove.html that respond and send message object data to the socket connection. 

fromkittehwithlove creates the socket itself, and passes it to the following functions that setup the socket

initializeCommonVars sets up the overall masterAlias and unspecifiedAlias.  master alias is the alias, when used, can dj music for everyone; i.e. when they change
a song in the audio player, or paste an mp3 url in the chat, all clients will play the song too (if they're currently playing audio).

initializeChatSocketHandler in fromkittehwithlove.html handles client
ui updates when a chatMsgObject (json) is received from the socket on a
chatSocketEvent. the chatMsgObject is broadcasted across all sockets on the 
server everytime someone sends a chat message.

initializeTapSocketHandler in fromkittehwithlove.html handles client
ui updates when a tapMsgObject (json) is received from the socket on a
tapSocketEvent. the tapMsgObject is broadcasted across all sockets on the
server everytime someone taps the interactive game pad (stuffed animal war).

fromkittehwithlove.html sets the name of the chatSocketEvent and 
the tapSocketEvent it listens for. they are:
    chatSocketEvent = 'fromkittehwithlovechatmessage';
    tapSocketEvent = 'fromkittehwithlovetapmessage';

these exact event names are also wired into index.js for the server-side socket connection. if you add your own fromkittehwithlove.html page, you must
define and listen for its uniquely named chatSocketEvent and tapSocketEvent in both the client html and the server index.js.

your own fromkittehwithlove.html page must also include /socket.io/socket.io.js, which makes the "io" object available in fromkittehwithlove.html, and 
coordinates the socket communication through chatSocketEvent and tapSocketEvent with the index.js socket server.
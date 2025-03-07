stuffedanimalwar is a nodejs application that uses socket communication to exchange chat messages and interactive game pad data and dj music.

it is unsecure http and will run on any port

fromkittehwithlove.html is a sample of how to create your own custom stuffedanimalwar page, but you can just edit and use this one too
fromkittehwithlove.html includes javascript for:
-stuffedanimalwarmechanics.js - for actions in the interactive game pad
-utilities.js - basic functionality for audio and video players
-sockethandler.js - sets up javascript event handlers for fromkittehwithlove.html page elements that handle socket communication with the socket handler in index.js



initializeChatSocketHandler in fromkittehwithlove.html handles client
ui updates when a chatMsgObject (json) is received from the socket on a
chatSocketEvent. the chatMsgObject is broadcasted across all sockets on the 
server everytime someone sends a chat message.

initializeTapSocketHandler in fromkittehwithlove.html handles client
ui updates when a tapMsgObject (json) is received from the socket on a
tapSocketEvent. the tapMsgObject is broadcasted across all sockets on the
server everytime someone taps the interactive game pad (stuffed animal war).

fromkittehwithlove.html sets the name of the chatSocketEvent and 
the tapSocketEvent it listens for, while calling these initialization functions.
let masterAlias = "KITTEH";
let unspecifiedAlias="anonymous";
chatSocketEvent = endpoint+'chatmessage';
tapSocketEvent = endpoint+'tapmessage';

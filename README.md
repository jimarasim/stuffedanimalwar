stuffedanimalwar is a nodejs application that uses socket communication to exchange chat messages and interactive game pad data and dj music.

it is unsecure http and will run on any port

fromkittehwithlove.html is a sample of how to create your own custom stuffedanimalwar page, but you can just edit and use this one too
fromkittehwithlove.html includes javascript for:
stuffedanimalwarmechanics.js - for actions in the interactive game pad
utilities.js - basic functionality for audio and video players
sockethandler.js - sets up javascript event handlers for fromkittehwithlove.html page elements that handle socket communication with the socket handler in index.js

indexsockethandler.js is included in index.html, which is what index.js
serves when stuffedanimalwar is called with no path (only a port). when 
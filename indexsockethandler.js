/* STUFFED ANIMAL WAR - jaemzware.org - 2015*/
//REQUIRES STUFFED ANIMAL WAR MECHANICS FOR SOCKET HANDLER BASE
$.getScript('stuffedanimalwarmechanics.js', function () {
    //REQUIRES UTILITIES FOR SOCKETHANDLER BASE
    $.getScript('utilities.js', function () {
    //REQUIRES SOCKETHANDLER BASE
        $.getScript('sockethandler.js', function () {
            let endpoint = "index";
            let masterAlias = "DJ";
            let unspecifiedAlias = "LURKER";
            chatSocketEvent = endpoint + "chatmessage";
            tapSocketEvent = endpoint + "tapmessage";
            let socket = io();
            initializeCommonVars(socket, masterAlias, unspecifiedAlias);
            initializeChatSocketHandler(socket, chatSocketEvent);
            initializeTapSocketHandler(socket, tapSocketEvent);
        });
    });
});



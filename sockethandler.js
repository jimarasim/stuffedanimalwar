/**
 * jaemzware
 * 
 * * THIS JS FILE REQUIRES utilities.js, stuffedanimalwarmechanics.js
 *
 * THIS FILE HANDLES COMMANDS THAT COME FROM THE SERVER ON THE OTHER END OF THE SOCKET
 *
 * SETS A BUNCH OF CALLBACKS THAT CONTROL THE STUFFEDANIMALWAR GAME BOARD AND THE CHAT BOX - CALLBACKS COME FROM THE SERVICE RUNNING FROM index.js
 *
 * THERE IS A TAP SOCKET HANDLER FOR STUFFEDANIMALWAR GAMEBOARD
 onBaseTapSocketEventDots(tapMsgObject);
 onBaseTapSocketEventLines(tapMsgObject);
 onBaseTapSocketEventLines(tapMsgObject);
 onBaseTapSocketEventCustom(tapMsgObject);
 onBaseTapSocketEventImages(tapMsgObject,tapMsgObject.animal);
 *
 *
 * THERE IS A TAP SOCKET HANDLER FOR THE CHAT BOX
 * onBaseChatSocketEvent -  DECIDE WHETHER TO ADD AN IMAGE, MP3, OR MESSAGE TO THE CHAT WINDOW
 *                          PERFORM THE APPROPRIATE ACTION IN THE CHAT WINDOW: PREPEND AN IMAGE, PREPEND AN MP3 AND PLAY IT, PREPEND A TEXT MESSAGE
 * @type String
 */
let baseEndpoint = null;
let chatSocketEvent = null;
let chatImageSocketEvent = null;
let tapSocketEvent = null;
let connectSocketEvent = null;
let disconnectSocketEvent = null;
let baseSocket = null;
let baseMasterAlias=null;
let baseUnspecifiedAlias=null;
//SOCKET EVENTS///////////////////////////////////////////////////////////////////////////SOCKET EVENTS////////////////////////SOCKET EVENTS//
function initializeCommonVars(socket,masterAlias,unspecifiedAlias,endpoint){
    baseMasterAlias = masterAlias;
    baseUnspecifiedAlias = unspecifiedAlias;
    baseSocket=socket;
    baseEndpoint=endpoint;
}
function initializeSocketHandlers(chatSocketEvent, tapSocketEvent, chatImageSocketEvent){
    //  WHEN A TAP MESSAGE IS RECEIVED FROM THER SERVER
    //  SEND THE OBJECT RECEIVED TO THE APPROPRIATE FUNCTION THAT HANDLES IT, 
    //  DEPENDING ON THE TYPE OF ANIMAL SENT BY $('#stuffedanimalwarsvg').click;
    baseSocket.on(chatSocketEvent, function(chatMsgObject){
        onBaseChatSocketEvent(chatMsgObject);
    });
    baseSocket.on(tapSocketEvent, function(tapMsgObject){
        let animal = tapMsgObject.animal; //see htmlwriter.js writeStuffedAnimalWarAnimalDropdown
        switch(animal){
            case "dots":
                onBaseTapSocketEventDots(tapMsgObject);
                break;
            case "whiteline":
                onBaseTapSocketEventLines(tapMsgObject);
                break;
            case "blackline":
                onBaseTapSocketEventLines(tapMsgObject);
                break;
            case "randomline":
                onBaseTapSocketEventLines(tapMsgObject);
                break;
            case "custom":
                onBaseTapSocketEventCustom(tapMsgObject);
                break;
            default:
                onBaseTapSocketEventImages(tapMsgObject,tapMsgObject.animal);
                break;
        }        
    });
    baseSocket.on(chatImageSocketEvent, function(chatImageMsgObject){
        let chatServerDate = chatImageMsgObject.CHATSERVERDATE;
        let chatClientUser = chatImageMsgObject.CHATCLIENTUSER.replace(/[^a-zA-Z0-9]/g, '');
        let serverStamp = "["+chatServerDate+"]"; //ip and time stamp

        $("<span>").prependTo("#messagesdiv").attr({
            class: "remoteChatClientUser"
        }).text(chatClientUser + " " + serverStamp);

        var img = $("<img/>").attr({
            src: chatImageMsgObject.CHATCLIENTIMAGE,
            alt: chatClientUser + " " + chatImageMsgObject.CHATSERVERDATE,
            class: "thumbnail" // Optional: Add a class for styling the thumbnail
        });

        img.on("click", function () {
            $('#stuffedanimalwarsvg').css('background-image', 'url(' + chatImageMsgObject.CHATCLIENTIMAGE + ')');
        });

        // Prepend the image (or linked image) to the #messagesdiv
        img.prependTo("#messagesdiv");
    });
    baseSocket.on(connectSocketEvent, function(connectMsgObject){
        var span = $("<span/>").text(connectMsgObject.CHATSERVERUSER.replace(/[^a-zA-Z0-9]/g, '') + " CONNECT - Total:" + connectMsgObject.CHATUSERCOUNT);
        span.attr("class", "connectnotification");
        span.prependTo("#messagesdiv");
        $('#chatClientUser').val(connectMsgObject.CHATSERVERUSER.replace(/[^a-zA-Z0-9]/g, ''));
    });
    baseSocket.on(disconnectSocketEvent, function(disconnectMsgObject){
        var span = $("<span/>").text(disconnectMsgObject.CHATSERVERUSER.replace(/[^a-zA-Z0-9]/g, '') + " DISCONNECT - Total:" + disconnectMsgObject.CHATUSERCOUNT);
        span.attr("class", "disconnectnotification");
        span.prependTo("#messagesdiv");
    });
}
function onBaseChatSocketEvent(chatMsgObject){
    let remoteChatClientUser = chatMsgObject.CHATCLIENTUSER;
    let chatServerUser = chatMsgObject.CHATSERVERUSER;
    let chatClientMessage = chatMsgObject.CHATCLIENTMESSAGE;
    let chatServerDate = chatMsgObject.CHATSERVERDATE;
    let serverStamp = "["+chatServerDate+"]"; //ip and time stamp
    
    //smart link - recognize chat links (only at the very beginning of the message), and display them appropriately.
    if (
        chatClientMessage.toLowerCase().indexOf("http://")===0||
        chatClientMessage.toLowerCase().indexOf("https://")===0
       ){
            if( chatClientMessage.toLowerCase().endsWith(".jpg")    ||
                chatClientMessage.toLowerCase().endsWith(".jpeg")   ||
                chatClientMessage.toLowerCase().endsWith(".gif")    ||
                chatClientMessage.toLowerCase().endsWith(".webp")    ||
                chatClientMessage.toLowerCase().endsWith(".png")  )
            {

//                ip and time stamp
//                user alias
                $("<span>").prependTo("#messagesdiv").attr({
                    class: "remoteChatClientUser"
                }).text(remoteChatClientUser + " " + serverStamp);

                var img = $("<img/>").attr({
                    src: chatClientMessage,
                    alt: "chat image",
                    class: "thumbnail"
                 });

                img.on("click", function () {
                    $('#stuffedanimalwarsvg').css('background-image', 'url(' + chatClientMessage + ')');
                });

                img.prependTo("#messagesdiv");
            }
            else if(chatClientMessage.toLowerCase().endsWith(".mp3") && remoteChatClientUser===baseMasterAlias)
            {
                changeMp3(chatClientMessage);
            }
            else if(chatClientMessage.toLowerCase().endsWith(".mp4") && remoteChatClientUser===baseMasterAlias)
            {
                changeMp4(chatClientMessage);
            }
            else{
                $("<span>").prependTo("#messagesdiv").attr({
                                    class: "remoteChatClientUser"
                                 }).text(remoteChatClientUser + " " + serverStamp);
                 //chat message
                $("<span>").prependTo("#messagesdiv").attr({
                   class: "chatclientmessage"
                }).text(chatClientMessage);
            }
        }
    else{
        //server date and user
        $("<div>").prependTo("#messagesdiv").attr({
            class: "right-aligned-container"
        }).append(
            $("<span>").attr({ class: "remoteChatClientUser" }).text(remoteChatClientUser),
            $("<span>").attr({ class: "serverdate" }).text(" " + serverStamp) // Add a space for separation
        );

        //chat message
        $("<span>").prependTo("#messagesdiv").attr({
            class: "chatclientmessage"
        }).text(chatClientMessage);
    }
}
//SOCKET EVENTS///////////////////////////////////////////////////////////////////////////SOCKET EVENTS////////////////////////SOCKET EVENTS//

//HTML EVENTS///////////////////////////////////////////////////////////////////////////HTML EVENTS////////////////////////HTML EVENTS//
$('#stuffedanimalwarsvg').click(function(event){
    //get the user alias
    let chatClientUser = $('#chatClientUser').val();
    if(chatClientUser===""){
        chatClientUser = baseUnspecifiedAlias;
    }

    let tapMsgObject = {
          x:event.pageX,
          y:event.pageY,
          animal:$('#animals option:selected').val(),
          animalName:$('#animals option:selected').text(),
          customimage:$('#imagepathtextbox').val(),
          movement:$("input[name='sawmove']:checked").val(),
          CHATCLIENTUSER: chatClientUser,
          CHATSERVERUSER:'defaultserveruserresponse',
          CHATSERVERDATE:'defaultserverdateresponse',
      }; 
    
    baseSocket.emit(tapSocketEvent,tapMsgObject);
});
$('#chatClientAutoResponder').change(function(){
    //GET THE MESSAGE FROM THE AUTORESPONDER
    let chatAutoResponderMessage = $('#chatClientAutoResponder option:selected').text();

    //SEND IT TO A FUNCTION THAT WILL ASSEMBLE A JSON BLOB, AND SEND IT TO THE SERVER, WHO WILL SEND IT TO EVERYONE ELSE
    emitChatMessage(chatAutoResponderMessage);
});
$('#selectsongs').change(function(){
    let songToPlay = $('#selectsongs option:selected').attr("value");
    let chatClientUser = $("#chatClientUser").val();
    
    console.log("CHATCLIENTUSER:"+chatClientUser+" BASEMASTERALIAS:"+baseMasterAlias);
    
    if(chatClientUser===baseMasterAlias){
        console.log("DJ CHANGED THE SONG:");
        emitChatMessage(songToPlay);
    }
    else{
        changeMp3(songToPlay);
        console.log("DJ DID NOT CHANGE THE SONG:");

    }
});
// Handle form submission
$('#uploadForm').on('submit', function (e) {
    e.preventDefault();
    const chatClientUser = $('#chatClientUser').val();
    const fileInput = e.target.elements.image;
    const file = fileInput.files[0];

    if (!file) {
        alert('Please select a file.');
        e.preventDefault();
        return;
    }

    // Check if the file is an image
    if (!file.type.startsWith('image/')) {
        alert('Please upload a valid image file.');
        e.preventDefault();
        return;
    }

    // Optionally, check file size (e.g., 10MB limit)
    const maxSize = 10 * 1024 * 1024; // 10MB
    if (file.size > maxSize) {
        alert('File size must be less than 10MB.');
        e.preventDefault();
        return;
    }

    // Create a FormData object from the form
    const formData = new FormData(this);
    formData["uploadclientuser"] = chatClientUser;
    console.log("form data:" + JSON.stringify(formData));
    const url = '/' + chatImageSocketEvent;
    fetch(url, {
        method: 'POST',
        body: formData,
        // Do NOT set Content-Type header manually for FormData; let the browser handle it
    })
        .then(response => {
            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }
            return response.json(); // Assuming the server responds with JSON
        })
        .then(data => {
            console.log('Image uploaded successfully', data);
        })
        .catch(error => {
            console.error('Upload failed:', error);
        });
});
//VIDEO PLAYER HTML EVENTS
$('#jaemzwaredynamicvideoplayer').bind("ended", function(){
    let currentFile = $(this).children(":first").attr('src');
    PlayNextVideo(currentFile);
});
//AUDIO PLAYER HTML EVENTS
$('#jaemzwaredynamicaudioplayer').bind("ended", function(){
    let currentFile = $(this).children(":first").attr('src');
    PlayNextTrack(currentFile);
});
$('#nextaudiotrack').click(function(){
    let currentFile = $('#selectsongs option:selected').attr("value");
    PlayNextTrack(currentFile);
});
$('#selectvideos').change(function(){
    let videoToPlay = $('#selectvideos option:selected').attr("value");
    let poster = $('#selectvideos option:selected').attr("poster");
    let chatClientUser = $("#chatClientUser").val();
    changeMp4(videoToPlay,poster);
});
$('#chatClientMessage').keypress(function (event) {
    if (event.which === 13) {
        emitChatMessage($('#chatClientMessage').val());   
        $('#chatClientMessage').val('');
        return false; 
    }
});
$('#sendchatbutton').click(function () {
        emitChatMessage($('#chatClientMessage').val());
        $('#chatClientMessage').val('');
});

function emitChatMessage(messageString){
    //get the user alias
    let chatClientUser = $('#chatClientUser').val();
    if(chatClientUser===""){
        chatClientUser = baseUnspecifiedAlias;
    }

    //CONSTRUCT THE MESSAGE TO EMIT IN JSON, WITH THE USERNAME INCLUDED
    let chatMessageObject = {
              CHATCLIENTUSER: chatClientUser,
              CHATSERVERUSER:'defaultserveruserresponse',
              CHATCLIENTMESSAGE:messageString,
              CHATSERVERDATE:'defaultserverdateresponse'
          };  

    //send the message
    console.log(`BASESOCKET EMIT: ${chatSocketEvent}`);
    baseSocket.emit(chatSocketEvent,chatMessageObject); 
}
//HTML EVENTS///////////////////////////////////////////////////////////////////////////HTML EVENTS////////////////////////HTML EVENTS//

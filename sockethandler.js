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
let endpoint = null;
let chatSocketEvent = null;
let chatImageSocketEvent = null;
let tapSocketEvent = null;
let connectSocketEvent = null;
let disconnectSocketEvent = null;
let baseSocket = null;
let baseMasterAlias=null;
let baseUnspecifiedAlias=null;
//SOCKET EVENTS///////////////////////////////////////////////////////////////////////////SOCKET EVENTS////////////////////////SOCKET EVENTS//
function initializeCommonVars(socket,masterAlias,unspecifiedAlias){
    baseMasterAlias = masterAlias;
    baseUnspecifiedAlias = unspecifiedAlias;
    baseSocket=socket;
}
function initializeTapSocketHandler(socket){
    //  WHEN A TAP MESSAGE IS RECEIVED FROM THER SERVER
    //  SEND THE OBJECT RECEIVED TO THE APPROPRIATE FUNCTION THAT HANDLES IT, 
    //  DEPENDING ON THE TYPE OF ANIMAL SENT BY $('#stuffedanimalwarsvg').click;
    socket.on(tapSocketEvent, function(tapMsgObject){
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
    baseSocket=socket;
}
function initializeChatSocketHandler(socket){
    socket.on(chatSocketEvent, function(chatMsgObject){
        onBaseChatSocketEvent(chatMsgObject);
    });
    socket.on(chatImageSocketEvent, function(chatImageMessageObject){
        console.log("IMAGE UPLOADED BROADCASTED");

        // Create the image element
        var img = $("<img/>").attr({
            src: chatImageMessageObject.CHATCLIENTIMAGE,
            alt: chatImageMessageObject.CHATSERVERUSER + " " + chatImageMessageObject.CHATSERVERDATE,
            class: "thumbnail" // Optional: Add a class for styling the thumbnail
        });

        // If it's a data URL, handle it differently
        img.on("click", function () {
            // Open a new window and write the image into it
            var newWindow = window.open();
            newWindow.document.write("<img src='" + chatImageMessageObject.CHATCLIENTIMAGE + "' alt='" + img.attr("alt") + "' />");
            newWindow.document.close();
        });

        // Prepend the image (or linked image) to the #messagesdiv
        img.prependTo("#messagesdiv");
    });
    
    baseSocket=socket;
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
            if( chatClientMessage.toLowerCase().indexOf(".jpg")   >   0 ||
                chatClientMessage.toLowerCase().indexOf(".jpeg")  >   0 ||
                chatClientMessage.toLowerCase().indexOf(".gif")   >   0 ||
                chatClientMessage.toLowerCase().indexOf(".png")   >   0)
            {

                //show the image if it's just an image tag
//                ip and time stamp
                $("<span>").prependTo("#messagesdiv").attr({
                    class: "serverdate"
                }).text(serverStamp);

//                user alias
                $("<span>").prependTo("#messagesdiv").attr({
                    class: "remoteChatClientUser"
                }).text(remoteChatClientUser);

                var img = $("<img/>").attr({
                    src: chatClientMessage,
                    alt: "chat image",
                    class: "thumbnail"
                 });

                var link = $("<a/>").attr({
                    href: chatClientMessage,
                    target: "_blank"
                }).append(img);

                link.prependTo("#messagesdiv");
            }
          else if(chatClientMessage.toLowerCase().indexOf(".mp3") && remoteChatClientUser===baseMasterAlias)
            {
                //change the source of the AUDIO player
                changeMp3(chatClientMessage);
                console.log("DJ BROADCAST CHANGED THE SONG");

            }
            else{

//                ip and time stamp
               $("<span>").prependTo("#messagesdiv").attr({
                  class: "serverdate"
               }).text(serverStamp);

//                user alias
                $("<span>").prependTo("#messagesdiv").attr({
                                    class: "remoteChatClientUser"
                                 }).text(remoteChatClientUser);

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

    // Create a FormData object from the form
    const formData = new FormData(this);

    // Send the image to the server using jQuery AJAX
    $.ajax({
        url: '/fromkittehwithloveuploadchatimage',
        type: 'POST',
        data: formData,
        processData: false, // Don't process the data
        contentType: false, // Don't set content type
        success: function (response) {
            console.log('Image uploaded successfully');
        },
        error: function (xhr, status, error) {
            console.error('Upload failed:', error);
        },
    });
    var $input = $('input[type="file"][name="image"]');
    $input.replaceWith($input.val('').clone(true));
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

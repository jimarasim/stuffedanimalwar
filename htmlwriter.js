/* jaemzware.org - research project stuffed animal war - 20150822 */
//SKATEPARKDATA//////////////////////////////////////////////SKATEPARKDATA//////////////////////////////////////////////////SKATEPARKDATA

//ARRAYS FOR HOLDING STATE OR COUNTRY SPECIFIC SKATEPARK DATA
let WASkateparks = new Array();
let ORSkateparks = new Array();
let MTSkateparks = new Array();
let IDSkateparks = new Array();
let DKSkateparks = new Array();

//CALL THIS FUNCTION TO WRITE OUT THE SKATEPARK LISTING DIV. skateparkDataFilename MUST BE IN THE SAME DIRECTORY AND ADHERE TO SKATECRETEORDIE FORMAT
function writeSkateparkData(skateparkDataFilename){

    //CREATE THE DIV AREA WHERE THE SKATEPARK DATA WILL BE HELD ON THE PAGE
    document.write("<div style='width:100%;' id=\"skateparksdiv\"></div>");

    //GET THE SKATEPARK DATA FROM THE JSON FILE
    $.getJSON(skateparkDataFilename, function(skateparkJsonFile) {
        let skateparkArray = skateparkJsonFile.skateparks;

        //PARSE THE PARKS INTO DIFFERENT GLOBAL ARRAYS ORDERED BY STATE OR COUNTRY
        //WASHINGTON ANNOTATIONS ARE THE ONLY ONES THAT DON'T HAVE A 2 CODE IDENTIFIER AT THE END (WA)
        for(i=0;i<skateparkArray.length;i++){
            if(skateparkArray[i].initialAnnotationId.indexOf("OR") >= 0){
                ORSkateparks.push(skateparkArray[i]);
            }
            else if(skateparkArray[i].initialAnnotationId.indexOf("MT") >= 0){
                MTSkateparks.push(skateparkArray[i]);
            }
            else if(skateparkArray[i].initialAnnotationId.indexOf("ID") >= 0){
                IDSkateparks.push(skateparkArray[i]);
            }
            else if(skateparkArray[i].initialAnnotationId.indexOf("DK") >= 0){
                DKSkateparks.push(skateparkArray[i]);
            }
            else{
                WASkateparks.push(skateparkArray[i]);
            }
        }
        //ADD DROPDOWN TO SWITCH BETWEEN PARKS
        //VALUES: WA OR MT ID DK
        //ONCLICK: CLEAR ALL PARKS FROM DIV, ADD PARKS FROM SELECTION TO DIV
        $("#skateparksdiv").append("<select style='margin-top:10px;' onchange='switchparks(this.value)'><option value='WASHINGTON' selected>WASHINGTON</option><option value='OREGON'>OREGON</option><option value='MONTANA'>MONTANA</option><option value='IDAHO'>IDAHO</option><option value='DENMARK'>DENMARK</option></select>");
        //DISPLAY WASHINGTON PARKS BY DEFAULT
        switchparks("WASHINGTON");
    });
}

//THIS FUNCTION GETS CALLED WHEN THE PARK DROPDOWN SELECTS A NEW OPTION TO SWITCH THE PARKS DISPLAYED
//CLEAR ALL PARKS FROM DIV, ADD PARKS FROM SELECTION TO DIV
function switchparks(stateorcountry){
    //CHECK WHICH STATE OR COUNTRY WAS SELECTED, AND LOAD THE APPROPRIATE ARRAY
    if(stateorcountry=="WASHINGTON"){
        loadparks(WASkateparks);
    }
    else if(stateorcountry=="OREGON"){
        loadparks(ORSkateparks);
    }
    else if(stateorcountry=="MONTANA"){
        loadparks(MTSkateparks);
    }
    else if (stateorcountry=="IDAHO"){
        loadparks(IDSkateparks);
    }
    else if (stateorcountry=="DENMARK"){
        loadparks(DKSkateparks);
    }
}

//THIS FUNCTION TAKES A SKATEPARKS ARRAY, AND ADDS THE SPANS TO THE DIV
function loadparks(skateparksarraytoload){
    //REMOVE ALL SKATEPARK DETAIL SPANS TO CLEAR THE WAY FOR THE NEXT STATE OR COUNTRY
    $(".skateparkdetail").remove();

    //ADD THE SKATEPARK DETAIL SPANS SPECIFIED BY skateparksarraytoload
    for(i=0;i<skateparksarraytoload.length;i++){
        $("#skateparksdiv").append("<span class='skateparkdetail'><a href='https://maps.google.com/maps?q="+skateparksarraytoload[i].initialLatitude+","+skateparksarraytoload[i].initialLongitude+"'>"+skateparksarraytoload[i].initialName+"</a></span>").append("<br class='skateparkdetail' />");
    }
}

//STUFFEDANIMALWAR//////////////////////////////////////////////STUFFEDANIMALWAR//////////////////////////////////////////////////STUFFEDANIMALWAR
function writeStuffedAnimalWar(stuffedAnimalMediaObject){
    writeStuffedAnimalWarDiv(stuffedAnimalMediaObject);
    writeStuffedAnimalWarForm(stuffedAnimalMediaObject);
    document.write("<hr />");  
}  
function writeStuffedAnimalWarDiv(stuffedAnimalMediaObject) {
    document.write("<div id=\"stuffedanimalwardiv\">");
    //IF THE BACKGROUND IMAGE WAS SPECIFIED
    if(stuffedAnimalMediaObject && stuffedAnimalMediaObject.backgroundimage){
        //MAKE SURE IT'S AN IMAGE WE EXPECT; I.E. A URL WITH AN IMAGE EXTENSION AT THE END OF IT, OR gamemedia FOR LOCAL FILE REFERENCES
        if (    stuffedAnimalMediaObject.backgroundimage.indexOf("http://")===0||
                stuffedAnimalMediaObject.backgroundimage.indexOf("https://")===0||
                stuffedAnimalMediaObject.backgroundimage.indexOf("gamemedia/")===0){ 
            if( stuffedAnimalMediaObject.backgroundimage.indexOf(".jpg")   >   0 ||
                stuffedAnimalMediaObject.backgroundimage.indexOf(".jpeg")  >   0 ||
                stuffedAnimalMediaObject.backgroundimage.indexOf(".JPG")  >   0 ||
                stuffedAnimalMediaObject.backgroundimage.indexOf(".gif")   >   0 ||
                stuffedAnimalMediaObject.backgroundimage.indexOf(".png")   >   0){
                //USE IT
                document.write("<svg id=\"stuffedanimalwarsvg\" style=\"height:1500px;background-image:url('"+stuffedAnimalMediaObject.backgroundimage+"');background-size: 100% auto;\">");
            }
            else{
                //JUST WRITE THE DEFAULT IMAGE
                document.write("<svg id=\"stuffedanimalwarsvg\">");
                //SHOW IN LOG WHY WE DIDNT USE IT
                console.log('BACKGROUNDIMAGEPROVIDED  DOES NOT CONTAIN A VALID ENOUGH IMAGE URL. NEEDS TO END WITH .jpg, .jpeg, .JPG, .gif, .png'+stuffedAnimalMediaObject.backgroundimage);
            }
        }
        else{
            //JUST WRITE THE DEFAULT IMAGE
            document.write("<svg id=\"stuffedanimalwarsvg\">");
            //SHOW IN LOG WHY WE DIDNT USE IT
            console.log('BACKGROUNDIMAGEPROVIDED  DOES NOT CONTAIN A VALID ENOUGH IMAGE URL. NEEDS TO START WITH http:// gamemedia https://'+stuffedAnimalMediaObject.backgroundimage);
        }
    }
    else{
        //JUST WRITE THE DEFAULT IMAGE
        document.write("<svg id=\"stuffedanimalwarsvg\">");
        //SHOW IN LOG WHY WE DIDNT USE IT
        console.log('BACKGROUNDIMAGENOTPROVIDED');
    }
    document.write("<rect id=\"stuffedanimalwarsvgrect\" x=\"0\" y=\"0\" width=\"1\" height=\"1\" style=\"fill:rgb(0,0,255);stroke-width:1;stroke:rgb(0,0,0)\" />");
    document.write("</svg>"); 
    document.write("</div>");
}
function writeStuffedAnimalWarForm(stuffedAnimalMediaObject){
    document.write("<h1>STUFFED ANIMAL WAR</h1>");
    document.write("<form id='stuffedanimalwarform'>");
    document.write("<table id='stuffedanimalwarformtable'>");
    //ANIMAL CHOICES
    document.write("<tr>");
    document.write("<td>");
        document.write("<select id=\"animals\" name=\"sawstyle\" size=1 >");
        //SPECIFIED ANIMALS
        if(stuffedAnimalMediaObject && stuffedAnimalMediaObject.animals[0]){
            for (let i=0;i<stuffedAnimalMediaObject.animals.length;i++){
                document.write("<option value=\""+stuffedAnimalMediaObject.animals[i].file+"\">"+stuffedAnimalMediaObject.animals[i].title+"</option>");
            }
        }
        document.write("<option value=\"dots\">C I R C L E S</option>");
        document.write("<option value=\"line01\">C U R S O R</option>");
        document.write("<option value=\"custom\">I M A G E URL</option>");
        document.write("<option value=\"line02\" selected>L I N E S</option>");
        document.write("</select>");
    document.write("</td>");
    document.write("</tr>");
    document.write("<tr>");
    document.write("<td>");
        //CUSTOM URL TEXT BOX
        document.write("<input style=\"vertical-align:top;text-align:left;\" id=\"imagepathtextbox\" size=\"35\" placeholder=\"CUSTOM URL\" />");
        document.write("<br />");
        //MOVEMENT DIRECTION
        document.write("<select style=\"vertical-align:bottom;text-align:left;\" id=\"movement\" name=\"sawmove\" size=1 >");
        document.write("<option value=\"UP\" selected>UP</option>");
        document.write("<option value=\"DOWN\">DOWN</option>");
        document.write("<option value=\"LEFT\">LEFT</option>");
        document.write("<option value=\"RIGHT\">RIGHT</option>");
        document.write("</select>");
    document.write("</td>");
    document.write("</tr>");
    document.write("</table>");
    document.write("</form>");  
}
//STUFFEDANIMALWAR//////////////////////////////////////////////STUFFEDANIMALWAR//////////////////////////////////////////////////STUFFEDANIMALWAR
//AUDIOVIDEOPHOTOS//////////////////////////////////////////////AUDIOVIDEOPHOTOS//////////////////////////////////////////////////AUDIOVIDEOPHOTOS
function writeMediaFromJson(mediaObject){
    writeAudioFromJson(mediaObject);
    writeVideoFromJson(mediaObject);
    writePhotosFromJson(mediaObject);
}
function writeAudioFromJson(mediaObject){
    //AUDIO
    if(mediaObject.songspath && mediaObject.songs && mediaObject.songs[0]){
        document.write("<h1>MUSIC</h1>");
        document.write("<form id='audioform'>");
        document.write("<div id='audioformdiv'>");
        document.write("<table id='audiotable'>");
        //paint the song selection dropdown
        document.write("<tr>");
        document.write("<td class='audioplayertd'>");
        document.write("<select id=\"selectsongs\">");
        //paint song selection dropdown options (songs)
        for (let i=0;i<mediaObject.songs.length;i++){
            document.write("<option value=\""+mediaObject.songspath+mediaObject.songs[i].file+"\">"+mediaObject.songs[i].title+"</option>");
        }
        document.write("</select>");
        document.write("</td>");
        document.write("</tr>");

        //paint the audio player
        document.write("<tr>");
        document.write("<td class='audioplayertd' colspan='2'>");
        document.write("<audio id=\"jaemzwaredynamicaudioplayer\" controls=\"\" preload=\"none\">");
        document.write("<source id=\"jaemzwaredynamicaudiosource\" src=\""+mediaObject.songspath+mediaObject.songs[0].file+"\" type=\"audio/mpeg\">");
        document.write("HTML5 Audio Tag support not available with your browser. For source type='audio/mpeg'");
        document.write("</audio>");
        document.write("</td>");
        document.write("</tr>");

        document.write("<tr>");

        //previous and next buttons
        document.write("<td>");
        document.write("<input type='button' id='nextaudiotrack' value='next' />");
        document.write("</td>");
        document.write("</tr>");
        document.write("</table>");  
        document.write("</div'>");
        document.write("</form>");
    }
}
function writeVideoFromJson(mediaObject){
    //VIDEO

    //IF THERES A VIDEO PATH IN THE MEDIAOBJECT, AND THERE IS AT LEAST ONE VIDEO
    if(mediaObject.videos && mediaObject.videos[0]){
        document.write("<h1>VIDEOS</h1>");

        //WRITE A WEB PAGE FORM FOR THE VIDEOS EMBEDDED IN A DIV
        document.write("<form id='videoform'>")
        document.write("<div id='videoformdiv'>");

        //PUT A TABLE IN THE DIV
        document.write("<table id='videotable'>");

        //WRITE THE FIRST TABLE ROW
        document.write("<tr>");

        //WRITE THE FIRST TABLE COLUMN
        document.write("<td>");

        //WRITE A SELECT DROPDOWN FOR THE VIDEOS PASSED THROUGH THE MEDIA OBJECT
        document.write("<select id=\"selectvideos\">");

        //WRITE A SELECT DROPDOWN OPTION FOR EACH VIDEO PASSED THROUGH THE MEDIA OBJECT
        for (let i=0;i<mediaObject.videos.length;i++){

            //IF A FILENAME WAS SPECIFIED IN THE MEDIA OBJECT
            if(mediaObject.videos[i].file){

                //IF THE FULL URL WAS SPECIFIED IN THE FILENAME (DETECTED BY CONTAINING HTTPS OR HTTP IN THE URL, DONT USE THE VIDEOS PREPENDING PATH SPECIFIED
                if(mediaObject.videos[i].file.indexOf("http")!==-1 &&
                          mediaObject.videos[i].file.indexOf("https")!==-1){

                    console.log("PROVIDED PARTIAL PATH FOR VIDEO OPTION");

                    //MAKE THE VALUE OF THE OPTION THE FULL URL SPECIFIED IN THE FILENAME
                    //mediaObject.videos[i].file
                    document.write("<option poster=\""+mediaObject.videos[i].poster+"\" value=\""+mediaObject.videos[i].file+"\">"+mediaObject.videos[i].title+"</option>");
                }
                //ELSE THE FULL URL WAS NOT SPECIFIED...
                else{
                    console.log("PROVIDED FULL PATH FOR VIDEO OPTION");
                    //SO WE'LL PREPEND THE VIDEOSPATH TO THE FILENAME PASSED THROUGH THE MEDIAOBJECT
                    //mediaObject.videospath+mediaObject.videos[i].file
                    document.write("<option poster=\""+mediaObject.videos[i].poster+"\" value=\""+mediaObject.videospath+mediaObject.videos[i].file+"\">"+mediaObject.videos[i].title+"</option>");
                    console.log("GOT HERE");
                }
            }
        }

        //FINISH WRITING THE SELECT DROPDOWN FOR EACH VIDOE PASSED THROUGH THE MEDIA OBJECT
        document.write("</select>");
        document.write("</td>");
        document.write("</tr>");

        //PUT A POSTER IMAGE
        document.write("<tr>");
        document.write("<td>");
        //if a poster image was provided in the media object for the video
        if(mediaObject.videos[0].poster){
            //IF THE FULL URL WAS SPECIFIED, DONT USE THE VIDEOS PREPENDING PATH SPECIFIED
            if(mediaObject.videos[0].file.indexOf("http:\/\/")!==-1 && mediaObject.videos[0].file.indexOf("https:\/\/")!==-1){
                document.write("<video id=\"jaemzwaredynamicvideoplayer\" poster=\""+mediaObject.videospath+mediaObject.videos[0].poster+"\" width=\"640\" height=\"480\" controls=\"controls\" preload=\"metadata\" title=\"skatecreteordie tv\">");
            }
            else{
                document.write("<video id=\"jaemzwaredynamicvideoplayer\" poster=\""+mediaObject.videos[0].poster+"\" width=\"640\" height=\"480\" controls=\"controls\" preload=\"metadata\" title=\"skatecreteordie tv\">");
            }
        }
        else{
            //provide a default image for the video poweter
            document.write("<video id=\"jaemzwaredynamicvideoplayer\" poster=\"http://skatecreteordie.com/media/kitteh.jpg\" width=\"640\" height=\"480\" controls=\"controls\" preload=\"metadata\" title=\"skatecreteordie tv\">");
        }

        document.write("mp4 not supported in this browser");
        document.write("<source src=\""+mediaObject.videospath+mediaObject.videos[0].file+"\" type=\"video/mp4\" id=\"jaemzwaredynamicvideosource\">");
        document.write("</video>");
        document.write("</td>");
        document.write("</tr>");

        document.write("</table>");  
        document.write("</div>");
        document.write("</form>");
    }
}
function writePhotosFromJson(mediaObject){
    //PHOTOS
    if(mediaObject.photospath && mediaObject.photos && mediaObject.photos[0]){
        //paint the photos
        for (let i=0;i<mediaObject.photos.length;i++){
            let filepath = mediaObject.photospath+mediaObject.photos[i].file;
            let filetitle=mediaObject.photos[i].title;
            document.write("<div class=\"skatecreteordiephoto\"><span class=\"skatecreteordiephototitle\">"+filetitle+"</span><a href=\""+filepath+"\"><img src=\""+filepath+"\" alt=\""+mediaObject.photos[i].title+"\" /></a></div>");

        }
    }
}
//AUDIOVIDEOPHOTOS//////////////////////////////////////////////AUDIOVIDEOPHOTOS//////////////////////////////////////////////////AUDIOVIDEOPHOTOS
//CHAT//////////////////////////////////////////////CHAT//////////////////////////////////////////////////CHAT
function writeChat(){writeChatForm();}
function writeChatForm(){
    document.write("<h1>CHAT</h1>");
    document.write("<form id='chatform'>");
    document.write("<div id='chatformdiv'>");
    document.write("<table id='chattable'>");
        document.write("<tr>");
            document.write("<td id=\"chatclientusertd\">");
            document.write("<input id=\"chatClientUser\" placeholder=\"alias\"/>");
            document.write("</td>");
            document.write("<td id=\"chatclientmessagetd\">");
            document.write("<input id=\"chatClientMessage\" placeholder=\"message\" />");
            document.write("</td>");
        document.write("</tr>");
        document.write("<tr>");
            document.write("<td colspan='2'>");
            document.write("<select id=\"chatClientAutoResponder\" size=1 >");
            writeDefaultAutoResponderOptions();
            document.write("</select>");
            document.write("</td>");
        document.write("</tr>");
        document.write("<tr>");
            document.write("<td colspan='2'>");
            document.write("<div id=\"messagesdiv\"></div>");
            document.write("</td>");
        document.write("</tr>");
    document.write("</table>");
    document.write("</div>");
    document.write("</form>");
}
function writeDefaultAutoResponderOptions(){
    document.write("<option value=\"blank\" selected>--I don't know what to say--</option>");
    document.write("<option value=\"checkoutthisspot\">check out this spot</option>");
        document.write("<option value=\"claimer\">claimer</option>");

    document.write("<option value=\"didyougoogle\">did you google that comeback?</option>");
    document.write("<option value=\"doitswitch\">do it switch</option>");
    document.write("<option value=\"doitfrontside\">do it frontside</option>");
    document.write("<option value=\"getsome\">get some</option>");
    document.write("<option value=\"holdmybeerwatchthis\">hold my beer, watch this</option>");
    document.write("<option value=\"idk\">i dont know</option>");
    document.write("<option value=\"ikr\">i know right</option>");
    document.write("<option value=\"ilikeyou\">i like you</option>");
    document.write("<option value=\"iloveyou\">i love you</option>");
    document.write("<option value=\"ithinkyoure\">i think youre attractive</option>");
    document.write("<option value=\"idratherplaywithmycat\">id rather play with my cat</option>");
    document.write("<option value=\"ilikeyou\">i like you</option>");
    document.write("<option value=\"itsabust\">it's a bust</option>");
    document.write("<option value=\"linkisbusted\">that link is busted</option>");
    document.write("<option value=\"look it up\">look it up</option>");
    document.write("<option value=\"lol\">LOL</option>");
    document.write("<option value=\"nice\">nice</option>");
    document.write("<option value=\"nuhuh\">Nuh UH!</option>");
    document.write("<option value=\"ok\">ok</option>");
    document.write("<option value=\"picsoritdidnthappen\">pics or it didnt happen</option>");
    document.write("<option value=\"sarcastic\">sarcastic clap</option>");
    document.write("<option value=\"silence\">silence for effect</option>");
    document.write("<option value=\"vague\">vague hipster comment</option>");
    document.write("<option value=\"witty\">witty comeback</option>");
    document.write("<option value=\"omg\">OMG</option>");
    document.write("<option value=\"picsoritdidnthappen\">pics or it didnt happen</option>");
    document.write("<option value=\"skateordie\">skate or die</option>");
    document.write("<option value=\"stfu\">STFU</option>");
    document.write("<option value=\"thatlinkisrad\">that link is rad</option>");
    document.write("<option value=\"thatscool\">thats cool</option>");
    document.write("<option value=\"thatsiteistooslow\">that site is too slow</option>");
    document.write("<option value=\"thatsucks\">that sucks</option>");
    document.write("<option value=\"thatscool\">thats cool</option>");
    document.write("<option value=\"thatswhatshesaid\">thats what she said</option>");
    document.write("<option value=\"thisisnotapoliticalforum\">this is not a political forum</option>");
    document.write("<option value=\"thisisnotareligious>this is not a religious forum</option>");
    document.write("<option value=\"threetoclaimit>three to claim it</option>");
    document.write("<option value=\"whatever\">whatever</option>");
    document.write("<option value=\"youinspireme\">you inspire me</option>");
    document.write("<option value=\"youlookverynicetoday\">you look very nice today</option>");
    document.write("<option value=\"yourock\">you rock</option>");
    document.write("<option value=\"youropinioniswrong\">your opinion is wrong</option>");
    document.write("<option value=\"yousuck\">you suck</option>");
    document.write("<option value=\"youknowyourearealupperson\">youre a real UP person</option>");
    document.write("<option value=\"youremybestfriend\">youre my best friend</option>");
    document.write("<option value=\"youreworkingthatoutfitgirl\">youre working that outfit girl</option>");
    document.write("<option value=\"yourewrong\">youre wrong</option>");
    document.write("<option value=\"wink\">;)</option>");
    document.write("<option value=\"smiley\">:)</option>");
    document.write("<option value=\"bigsmiley\">:D</option>");
}
//CHAT//////////////////////////////////////////////CHAT//////////////////////////////////////////////////CHAT
function writeChaturbate(){
    document.write("<div id='chaturbatediv'>" +
        "<iframe src='https://chaturbate.com/in/?tour=SHBY&campaign=6736U&track=embed&room=kassiedior&bgcolor=white' height='528' width='850' style='border: none;'></iframe>" +
        "</div>");
}








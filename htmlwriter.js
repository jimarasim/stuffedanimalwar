function writeStuffedAnimalWar(stuffedAnimalMediaObject){
    document.write("<div id='sawflexdiv'>");
    writeStuffedAnimalWarDiv(stuffedAnimalMediaObject);
    writeStuffedAnimalWarForm(stuffedAnimalMediaObject);
    document.write("</div>");
    document.write("<hr />");  
}  
function writeStuffedAnimalWarDiv(stuffedAnimalMediaObject) {
    document.write("<div id=\"stuffedanimalwardiv\">");
    //IF THE BACKGROUND IMAGE WAS SPECIFIED
    if(stuffedAnimalMediaObject && stuffedAnimalMediaObject.backgroundimage){
        //MAKE SURE IT'S AN IMAGE WE EXPECT; I.E. A URL WITH AN IMAGE EXTENSION AT THE END OF IT, OR gamemedia FOR LOCAL FILE REFERENCES
        if (    stuffedAnimalMediaObject.backgroundimage.toLowerCase().indexOf("http://")===0||
                stuffedAnimalMediaObject.backgroundimage.toLowerCase().indexOf("https://")===0||
                stuffedAnimalMediaObject.backgroundimage.toLowerCase().indexOf("gamemedia/")===0){
            if( stuffedAnimalMediaObject.backgroundimage.toLowerCase().indexOf(".jpg")   >   0 ||
                stuffedAnimalMediaObject.backgroundimage.toLowerCase().indexOf(".jpeg")  >   0 ||
                stuffedAnimalMediaObject.backgroundimage.toLowerCase().indexOf(".gif")   >   0 ||
                stuffedAnimalMediaObject.backgroundimage.toLowerCase().indexOf(".png")   >   0){
                //USE IT
                document.write("<svg id=\"stuffedanimalwarsvg\" style=\"height:500px;background-image:url('" + stuffedAnimalMediaObject.backgroundimage + "');background-size: 100% auto;\">");
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
    document.write("<form id='stuffedanimalwarform'>");
    document.write("<table id='stuffedanimalwarformtable'>");
    //MESSAGES FROM CHAT FORM
    document.write("<tr>");
    document.write("<td colspan='2'>");
        document.write("<div id=\"messagesdiv\"></div>");
    document.write("</td>");
    document.write("</tr>");

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
        document.write("<option value=\"dots\" selected>CIRCLES</option>");
        document.write("<option value=\"whiteline\">WHITE LINE</option>");
        document.write("<option value=\"blackline\">BLACK LINE</option>");
        document.write("<option value=\"randomline\">RANDOM LINE</option>");
        document.write("<option value=\"custom\">CUSTOM URL</option>");
        document.write("</select>");
    document.write("</td>");
    document.write("<td>");
    //CUSTOM URL TEXT BOX
    document.write("<input style=\"vertical-align:top;text-align:left;\" id=\"imagepathtextbox\" size=\"35\" placeholder=\"CUSTOM URL\" />");
    document.write("</td>");
    document.write("</tr>");
    document.write("<tr>");
    document.write("<td  colspan='2'>");
        //MOVEMENT DIRECTION
    document.write("<div style=\"vertical-align:bottom;text-align:left;\">");
    document.write("<label style=\"display: inline-block;margin-right: 10px;\"><input type=\"radio\" id=\"movement-up\" name=\"sawmove\" value=\"UP\" checked>UP</label>");
    document.write("<label style=\"display: inline-block;margin-right: 10px;\"><input type=\"radio\" id=\"movement-down\" name=\"sawmove\" value=\"DOWN\">DOWN</label>");
    document.write("<label style=\"display: inline-block;margin-right: 10px;\"><input type=\"radio\" id=\"movement-left\" name=\"sawmove\" value=\"LEFT\">LEFT</label>");
    document.write("<label style=\"display: inline-block;margin-right: 10px;\"><input type=\"radio\" id=\"movement-right\" name=\"sawmove\" value=\"RIGHT\">RIGHT</label>");
    document.write("</div>");
    document.write("</td>");
    document.write("</tr>");
    document.write("</table>");
    document.write("</form>");  
}
//STUFFEDANIMALWAR//////////////////////////////////////////////STUFFEDANIMALWAR//////////////////////////////////////////////////STUFFEDANIMALWAR
//AUDIOVIDEOPHOTOS//////////////////////////////////////////////AUDIOVIDEOPHOTOS//////////////////////////////////////////////////AUDIOVIDEOPHOTOS
function writeAudioFromJson(mediaObject){
    //AUDIO
    if(mediaObject.songspath && mediaObject.songs && mediaObject.songs[0]){
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
                if(mediaObject.videos[i].file.indexOf("http://")!==-1 ||
                          mediaObject.videos[i].file.indexOf("https://")!==-1){

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
            if(mediaObject.videos[0].poster.indexOf("http://")!==-1 ||
                mediaObject.videos[0].poster.indexOf("https://")!==-1){
                document.write("<video id=\"jaemzwaredynamicvideoplayer\" poster=\""+mediaObject.videos[0].poster+"\" width=\"640\" height=\"480\" controls=\"controls\" preload=\"metadata\" title=\"skatecreteordie tv\">");
            }
            else{
                document.write("<video id=\"jaemzwaredynamicvideoplayer\" poster=\""+mediaObject.videospath+mediaObject.videos[0].poster+"\" width=\"640\" height=\"480\" controls=\"controls\" preload=\"metadata\" title=\"skatecreteordie tv\">");
            }
        }
        else{
            //provide a default image for the video poweter
            document.write("<video id=\"jaemzwaredynamicvideoplayer\" poster=\"http://skatecreteordie.com/media/kitteh.jpg\" width=\"640\" height=\"480\" controls=\"controls\" preload=\"metadata\" title=\"skatecreteordie tv\">");
        }

        document.write("mp4 not supported in this browser");
        if(mediaObject.videos[0].file.indexOf("http://")!==-1 ||
            mediaObject.videos[0].file.indexOf("https://")!==-1) {
            document.write("<source src=\"" + mediaObject.videos[0].file + "\" type=\"video/mp4\" id=\"jaemzwaredynamicvideosource\">");
        } else {
            document.write("<source src=\"" + mediaObject.videospath + mediaObject.videos[0].file + "\" type=\"video/mp4\" id=\"jaemzwaredynamicvideosource\">");
        }
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
function writeChatForm(responsesObject){
    document.write("<form id='chatform'>");
    document.write("<div id='chatformdiv'>");
    document.write("<table id='chattable'>");
        document.write("<tr>");
            document.write("<td id=\"chatclientusertd\">");
                document.write("<input id=\"chatClientUser\" placeholder=\"alias\"/>");
            document.write("</td>");
            document.write("<td>");
                document.write("<select id=\"chatClientAutoResponder\" size=1 >");
                writeDefaultAutoResponderOptions(responsesObject);
                document.write("</select>");
            document.write("</td>");
            document.write("<td id=\"chatclientmessagetd\">");
                document.write("<input id=\"chatClientMessage\" placeholder=\"hit enter to send message text or URL ending with .jpg .gif .png .mp3\" />");
            document.write("</td>");
            document.write("</form>");
        document.write("</tr>");
        document.write("<tr>");
    document.write("<form id=\"uploadForm\" enctype=\"multipart/form-data\">");
            document.write("<td id=\"chatclientuploadformtd\" colspan='2'>");
            document.write("<input type=\"file\" name=\"image\" accept=\"image/*\" required>");
            document.write("</td>");
            document.write("<td id=\"chatclientuploadformtd\">");
            document.write("<button type=\"submit\">Upload Image</button>");
            document.write("</td>");
            document.write("</form>");
        document.write("</tr>");
    document.write("</table>");
    document.write("</div>");

}
function writeDefaultAutoResponderOptions(responsesObject){
    document.write("<option value=\"blank\" selected>--I don't know what to say--</option>");
    responsesObject.responses.forEach(item => {
        let responseText = item.response;
        // Remove spaces, quotes, and single quotes
        let value = responseText.replace(/[\s"']/g, '');
        document.write(`<option value="${value}">${responseText}</option>`);
    });
}
//CHAT//////////////////////////////////////////////CHAT//////////////////////////////////////////////////CHAT








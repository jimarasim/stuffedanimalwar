/*
 * THESE ARE UTILITY FUNCTIONS FOR CONTROLLING THE AUDIO AND VIDEO PLAYERS ON THE PAGE  THESE ARE RESPONSES TO THE
 * SERVER PUSH OVER SOCKET, I BELIEVE
 */


/* UTILITY - GETRANDOMCOLORVALUE (COMMON)
 * this function returns a random color value, used by drawing new things
 */
function GetRandomColorValue(){
    return Math.floor((Math.random() * 255) + 1);
}

//AUDIO SPECIFIC UTILITIES
function PlayNextTrack(currentFile){
    //don't do anything if there are no songs
    if($('#selectsongs option').length===0){
        return;
    }

    var current=$('#selectsongs option[value="'+currentFile+'"]').attr('value');
    var first=$('#selectsongs option').first().attr('value');
    var last=$('#selectsongs option').last().attr('value');
    var next=$('#selectsongs option[value="'+currentFile+'"]').next().attr('value');

    console.log("FIRST:"+first+" CURRENT:"+current+" NEXT:"+next+" LAST:"+last);

    //if the current song is the last song, play the first song
    if(current===last){
        changeMp3(first);
    }
    else{ //otherwise, play the next song
        changeMp3(next);
    }
}
function PlayNextVideo(currentFile){
    //don't do anything if there are no videos
    if($('#selectvideos option').length===0){
        return;
    }

    var current=$('#selectvideos option[value="'+currentFile+'"]').attr('value');
    var first=$('#selectvideos option').first().attr('value');
    var last=$('#selectvideos option').last().attr('value');
    var next=$('#selectvideos option[value="'+currentFile+'"]').next().attr('value');
    var firstposter=$('#selectvideos option').first().attr('optionposter');
    var nextposter=$('#selectvideos option[value="'+currentFile+'"]').next().attr('optionposter');

    //if the current video is the last video, play the first video
    if(current===last){
        changeMp4(first,firstposter);
    }
    else{ //otherwise, play the next video
        changeMp4(next,nextposter);
    }
}
function changeMp3(mp3Url){
    //change the source of the AUDIO player
    $('#jaemzwaredynamicaudiosource').attr("src",mp3Url);
    document.getElementById("jaemzwaredynamicaudioplayer").load();
    document.getElementById("jaemzwaredynamicaudioplayer").play();
    $('#selectsongs').val(mp3Url);
}

function changeMp4(mp4Url){
    //change the source of the VIDEO player with default video cover image
    changeMp4(mp4Url,"http://skatecreteordie.com/media/kitteh.jpg");
}
function changeMp4(mp4Url,coverImageUrl){
    console.log("CHANGE MP4");
    //change the source of the VIDEO player
    $('#jaemzwaredynamicvideosource').attr("src",mp4Url);
    $('#jaemzwaredynamicvideoplayer').attr("poster",coverImageUrl);
    document.getElementById("jaemzwaredynamicvideoplayer").pause();
    document.getElementById("jaemzwaredynamicvideoplayer").load();
    document.getElementById("jaemzwaredynamicvideoplayer").play();
    $('#selectvideos').val(mp4Url);
}


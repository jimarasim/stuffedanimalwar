/* 
 * jaemzware
 *
 * CONTROL SHAPES ON THE STUFFEDANIMALWAR GAMEBOARD. THERE ARE NO SOCKET CALLS IN HERE.  THESE ARE RESPONSES TO THE
 * SERVER PUSH OVER SOCKET, I BELIEVE
 */
let animalObjects = []; //{'objectId':'','timerId':'','xAxisAttr':'',yAxisAttr:''}
let shapeObjects = []; //{'objectId':'','timerId':'','xAxisAttr':'',yAxisAttr:''}
let animalPositionIncrement = 10; //distance animal moves each reposition
let shapePositionIncrement = 10; //distance shape moves each reposition
let animalInterval = 75; //milliseconds between animal repositions
let radius = 5; //RADIUS of the dot shape to draw
let lineWidth = 5; //width of the line shape to draw
let imageHeightPixels = 100; //height of the stuffed animals
let imageWidthPixels = 100; //width of the stuffed animals

function moveAnimalObjectUp(animalObjectId,animalXAxisAttr,animalYAxisAttr) {
    let xPosition = $('#'+animalObjectId).attr(animalXAxisAttr);    //get the current location
    let yPosition = $('#'+animalObjectId).attr(animalYAxisAttr);    //get the current location
    let svgHeight = $('#stuffedanimalwarsvg').height();
    if(yPosition>0){    //if still on the gameboard
        //randomize the distance of how much each animal moves
        let randomAnimalPositionIncrement=Math.floor((Math.random() * animalPositionIncrement) + 1);
        yPosition=parseInt(yPosition)-parseInt(randomAnimalPositionIncrement);        //update the coordinates
        xPosition=parseInt(xPosition);        //update the coordinates
        $('#'+animalObjectId).attr(animalYAxisAttr,yPosition);
        $('#'+animalObjectId).attr(animalXAxisAttr,xPosition);
    }
    else{
        $('#'+animalObjectId).attr(animalYAxisAttr,svgHeight);
        $('#'+animalObjectId).attr(animalXAxisAttr,xPosition);
    }  
}
function moveAnimalObjectLeft(animalObjectId,animalXAxisAttr,animalYAxisAttr) {
    let xPosition = $('#'+animalObjectId).attr(animalXAxisAttr);    //get the current location
    let yPosition = $('#'+animalObjectId).attr(animalYAxisAttr);    //get the current location
    let svgWidth = $('#stuffedanimalwarsvg').width();
    if(xPosition>0){    //if still on the gameboard
        //randomize the distance of how much each animal moves
        let randomAnimalPositionIncrement=Math.floor((Math.random() * animalPositionIncrement) + 1);
        yPosition=parseInt(yPosition);        //update the coordinates
        xPosition=parseInt(xPosition)-parseInt(randomAnimalPositionIncrement);        //update the coordinates
        $('#'+animalObjectId).attr(animalYAxisAttr,yPosition);
        $('#'+animalObjectId).attr(animalXAxisAttr,xPosition);
    }
    else{
        $('#'+animalObjectId).attr(animalYAxisAttr,yPosition);
        $('#'+animalObjectId).attr(animalXAxisAttr,svgWidth);
    }  
}
function moveAnimalObjectDown(animalObjectId,animalXAxisAttr,animalYyAxisAttr) {
    //get the current location
    let yPosition = $('#'+animalObjectId).attr(animalYyAxisAttr);
    let xPosition = $('#'+animalObjectId).attr(animalXAxisAttr);
    let svgHeight = $('#stuffedanimalwarsvg').height();
    if(yPosition<svgHeight){     //if still on SVG gameboard
        //randomize the distance of how much each animal moves
        let randomAnimalPositionIncrement=Math.floor((Math.random() * animalPositionIncrement) + 1);
        yPosition=parseInt(yPosition)+parseInt(randomAnimalPositionIncrement);         //update the coordinates
        $('#'+animalObjectId).attr(animalYyAxisAttr,yPosition);
        $('#'+animalObjectId).attr(animalXAxisAttr,xPosition);
    }
    else{
        $('#'+animalObjectId).attr(animalYyAxisAttr,'0');
        $('#'+animalObjectId).attr(animalXAxisAttr,xPosition);  //MOVE BACK TO THE TOP OF THE SVG
    }
}
function moveAnimalObjectRight(animalObjectId,animalXAxisAttr,animalYAxisAttr) {
    //get the current location
    let yPosition = $('#'+animalObjectId).attr(animalYAxisAttr);
    let xPosition = $('#'+animalObjectId).attr(animalXAxisAttr);
    let svgWidth = $('#stuffedanimalwarsvg').width();
    if(xPosition<svgWidth){     //if still on SVG gameboard
        //randomize the distance of how much each animal moves
        let randomAnimalPositionIncrement=Math.floor((Math.random() * animalPositionIncrement) + 1);
        xPosition=parseInt(xPosition)+parseInt(randomAnimalPositionIncrement);         //update the coordinates
        $('#'+animalObjectId).attr(animalYAxisAttr,yPosition);
        $('#'+animalObjectId).attr(animalXAxisAttr,xPosition);
    }
    else{
        $('#'+animalObjectId).attr(animalXAxisAttr,'0');
        $('#'+animalObjectId).attr(animalYAxisAttr,yPosition);  //MOVE BACK TO THE TOP OF THE SVG
    }
}
function moveShapeObjectUp(shapeObjectId,shapeXAxisAttr,shapeYAxisAttr) {
    //get the current location
    let xPosition = $('#'+shapeObjectId).attr(shapeXAxisAttr);
    let yPosition = $('#'+shapeObjectId).attr(shapeYAxisAttr);
    let svgHeight = $('#stuffedanimalwarsvg').height();
    if(yPosition>0){    //if still on the SVG gameboard
        yPosition=parseInt(yPosition)-parseInt(shapePositionIncrement);              //update the coordinates
        $('#'+shapeObjectId).attr(shapeYAxisAttr,yPosition);$('#'+shapeObjectId).attr(shapeXAxisAttr,xPosition);
    }
    else{
        $('#'+shapeObjectId).attr(shapeYAxisAttr,svgHeight);$('#'+shapeObjectId).attr(shapeXAxisAttr,xPosition);
    }
    
    //check if any image animal was hit, and stop it if so
    for(let i=0;i<animalObjects.length;i++){
        if(HitTest(animalObjects[i],shapeObjectId,shapeXAxisAttr,shapeYAxisAttr)){
            shapeObjectThatHitAnimal = jQuery.grep(shapeObjects, function(shapeObject) {  //REMOVE THE SHAPE
                return shapeObject.objectId === shapeObjectId;});
            clearInterval(shapeObjectThatHitAnimal.timerId);             //stop the shapeObjectThatHitAnimal timer
            $('#'+shapeObjectId).remove();            //remove the shapeObjectThatHitAnimal 
            clearInterval(animalObjects[i].timerId);            //stop the animal timer
            $('#'+animalObjects[i].objectId).fadeToggle('slow', function() {            //fade out the animal
                this.remove();                //remove the animal from the svg
            });
        }
    }
}
function moveShapeObjectLeft(shapeObjectId,shapeXAxisAttr,shapeYAxisAttr) {
    //get the current location
    let xPosition = $('#'+shapeObjectId).attr(shapeXAxisAttr);
    let yPosition = $('#'+shapeObjectId).attr(shapeYAxisAttr);
    let svgWidth = $('#stuffedanimalwarsvg').width();
    if(xPosition>0){    //if still on the SVG gameboard
        xPosition=parseInt(xPosition)-parseInt(shapePositionIncrement);              //update the coordinates
        $('#'+shapeObjectId).attr(shapeYAxisAttr,yPosition);
        $('#'+shapeObjectId).attr(shapeXAxisAttr,xPosition);
    }
    else{
        $('#'+shapeObjectId).attr(shapeXAxisAttr,svgWidth);
        $('#'+shapeObjectId).attr(shapeYAxisAttr,yPosition);
    }
    
    //check if any image animal was hit, and stop it if so
    for(let i=0;i<animalObjects.length;i++){
        if(HitTest(animalObjects[i],shapeObjectId,shapeXAxisAttr,shapeYAxisAttr)){
            shapeObjectThatHitAnimal = jQuery.grep(shapeObjects, function(shapeObject) {  //REMOVE THE SHAPE
                return shapeObject.objectId === shapeObjectId;});
            clearInterval(shapeObjectThatHitAnimal.timerId);             //stop the shapeObjectThatHitAnimal timer
            $('#'+shapeObjectId).remove();            //remove the shapeObjectThatHitAnimal 
            clearInterval(animalObjects[i].timerId);            //stop the animal timer
            $('#'+animalObjects[i].objectId).fadeToggle('slow', function() {            //fade out the animal
                this.remove();                //remove the animal from the svg
            });
        }
    }
}
function moveShapeObjectDown(shapeObjectId,shapeXAxisAttr,shapeYAxisAttr) {
    //get the current location
    let xPosition = $('#'+shapeObjectId).attr(shapeXAxisAttr);
    let yPosition = $('#'+shapeObjectId).attr(shapeYAxisAttr);
    let svgHeight = $('#stuffedanimalwarsvg').height();
    //if still on the gameboard
    if(yPosition<svgHeight){
        //update the coordinates
        yPosition=parseInt(yPosition)+parseInt(shapePositionIncrement);
        $('#'+shapeObjectId).attr(shapeYAxisAttr,yPosition);$('#'+shapeObjectId).attr(shapeXAxisAttr,xPosition);
    }
    else{
        $('#'+shapeObjectId).attr(shapeYAxisAttr,'0');$('#'+shapeObjectId).attr(shapeXAxisAttr,xPosition);
    }    
    
    //check if any image animal was hit, and stop it if so
    for(let i=0;i<animalObjects.length;i++){
        if(HitTest(animalObjects[i],shapeObjectId,shapeXAxisAttr,shapeYAxisAttr)){
            shapeObjectThatHitAnimal = jQuery.grep(shapeObjects, function(shapeObject) {  //REMOVE THE SHAPE
                return shapeObject.objectId === shapeObjectId;});
            clearInterval(shapeObjectThatHitAnimal.timerId);             //stop the shapeObjectThatHitAnimal timer
            $('#'+shapeObjectId).remove();            //remove the shapeObjectThatHitAnimal 
            clearInterval(animalObjects[i].timerId);            //stop the animal timer
            $('#'+animalObjects[i].objectId).fadeToggle('slow', function() {            //fade out the animal
                this.remove();                //remove the animal from the svg
            });
        }
    }
}
function moveShapeObjectRight(shapeObjectId,shapeXAxisAttr,shapeYAxisAttr) {
    //get the current location
    let xPosition = $('#'+shapeObjectId).attr(shapeXAxisAttr);
    let yPosition = $('#'+shapeObjectId).attr(shapeYAxisAttr);
    let svgWidth = $('#stuffedanimalwarsvg').width();
    //if still on the gameboard
    if(xPosition<svgWidth){
        //update the coordinates
        xPosition=parseInt(xPosition)+parseInt(shapePositionIncrement);
        $('#'+shapeObjectId).attr(shapeYAxisAttr,yPosition);
        $('#'+shapeObjectId).attr(shapeXAxisAttr,xPosition);
    }
    else{
        $('#'+shapeObjectId).attr(shapeXAxisAttr,'0');
        $('#'+shapeObjectId).attr(shapeYAxisAttr,yPosition);
    }    
    
    //check if any image animal was hit, and stop it if so
    for(let i=0;i<animalObjects.length;i++){
        if(HitTest(animalObjects[i],shapeObjectId,shapeXAxisAttr,shapeYAxisAttr)){
            shapeObjectThatHitAnimal = jQuery.grep(shapeObjects, function(shapeObject) {  //REMOVE THE SHAPE
                return shapeObject.objectId === shapeObjectId;});
            clearInterval(shapeObjectThatHitAnimal.timerId);             //stop the shapeObjectThatHitAnimal timer
            $('#'+shapeObjectId).remove();            //remove the shapeObjectThatHitAnimal 
            clearInterval(animalObjects[i].timerId);            //stop the animal timer
            $('#'+animalObjects[i].objectId).fadeToggle('slow', function() {            //fade out the animal
                this.remove();                //remove the animal from the svg
            });
        }
    }
}

function startAnimalObjectTimerUp(animalObjectId,xAxisAttr,yAxisAttr,animalInterval){
    let timerId=window.setInterval(moveAnimalObjectUp,animalInterval,animalObjectId,xAxisAttr,yAxisAttr);
    let animalObjectTimerId = {'objectId':animalObjectId,'timerId':timerId,'xAxisAttr':xAxisAttr,'yAxisAttr':yAxisAttr};
    animalObjects.push(animalObjectTimerId);
}
function startAnimalObjectTimerDown(animalObjectId,xAxisAttr,yAxisAttr,animalInterval){
    let timerId = window.setInterval(moveAnimalObjectDown,animalInterval,animalObjectId,xAxisAttr,yAxisAttr);
    let animalObjectTimerId = {'objectId':animalObjectId,'timerId':timerId,'xAxisAttr':xAxisAttr,'yAxisAttr':yAxisAttr};
    animalObjects.push(animalObjectTimerId);
}
function startAnimalObjectTimerLeft(animalObjectId,xAxisAttr,yAxisAttr,animalInterval){
    let timerId=window.setInterval(moveAnimalObjectLeft,animalInterval,animalObjectId,xAxisAttr,yAxisAttr);
    let animalObjectTimerId = {'objectId':animalObjectId,'timerId':timerId,'xAxisAttr':xAxisAttr,'yAxisAttr':yAxisAttr};
    animalObjects.push(animalObjectTimerId);
}
function startAnimalObjectTimerRight(animalObjectId,xAxisAttr,yAxisAttr,animalInterval){
    let timerId = window.setInterval(moveAnimalObjectRight,animalInterval,animalObjectId,xAxisAttr,yAxisAttr);
    let animalObjectTimerId = {'objectId':animalObjectId,'timerId':timerId,'xAxisAttr':xAxisAttr,'yAxisAttr':yAxisAttr};
    animalObjects.push(animalObjectTimerId);
}

function startShapeObjectTimerUp(shapeObjectId,xAxisAttr,yAxisAttr,shapeInterval){
    let timerId = window.setInterval(moveShapeObjectUp,shapeInterval,shapeObjectId,xAxisAttr,yAxisAttr);
    let shapeObjectTimerId = {'objectId':shapeObjectId,'timerId':timerId,'xAxisAttr':xAxisAttr,'yAxisAttr':yAxisAttr};
    shapeObjects.push(shapeObjectTimerId);
}
function startShapeObjectTimerDown(shapeObjectId,xAxisAttr,yAxisAttr,shapeInterval){
    let timerId = window.setInterval(moveShapeObjectDown,shapeInterval,shapeObjectId,xAxisAttr,yAxisAttr);
    let shapeObjectTimerId = {'objectId':shapeObjectId,'timerId':timerId,'xAxisAttr':xAxisAttr,'yAxisAttr':yAxisAttr};
    shapeObjects.push(shapeObjectTimerId);
}
function startShapeObjectTimerLeft(shapeObjectId,xAxisAttr,yAxisAttr,shapeInterval){
    let timerId = window.setInterval(moveShapeObjectLeft,shapeInterval,shapeObjectId,xAxisAttr,yAxisAttr);
    let shapeObjectTimerId = {'objectId':shapeObjectId,'timerId':timerId,'xAxisAttr':xAxisAttr,'yAxisAttr':yAxisAttr};
    shapeObjects.push(shapeObjectTimerId);
}
function startShapeObjectTimerRight(shapeObjectId,xAxisAttr,yAxisAttr,shapeInterval){
    let timerId = window.setInterval(moveShapeObjectRight,shapeInterval,shapeObjectId,xAxisAttr,yAxisAttr);
    let shapeObjectTimerId = {'objectId':shapeObjectId,'timerId':timerId,'xAxisAttr':xAxisAttr,'yAxisAttr':yAxisAttr};
    shapeObjects.push(shapeObjectTimerId);
}

function onBaseTapSocketEventDots(tapMsgObject){
    
    //get the coordinates emitted
    let pointX = tapMsgObject.x;
    let pointY = tapMsgObject.y;

    //draw a circle from the new to the old location
    let newCircle = document.createElementNS('http://www.w3.org/2000/svg','circle');
    let circleId = 'circle'+$.now();

    newCircle.setAttribute('id',circleId);
    newCircle.setAttribute('cx',pointX);
    newCircle.setAttribute('cy',pointY);
    newCircle.setAttribute('r',radius);
    
    //RANDOM COLOR
    newCircle.setAttribute('style','transform=translate(75,25);stroke:rgb('+GetRandomColorValue()+','+GetRandomColorValue()+','+GetRandomColorValue()+');fill:rgb('+GetRandomColorValue()+','+GetRandomColorValue()+','+GetRandomColorValue()+');'); //WHITE FILL / WHITE STROKE (OUTER CIRCLE) 
    
    $("#stuffedanimalwarsvg").append(newCircle);

    //move the state rectangle to where the click was made
    $("#stuffedanimalwarsvgrect").attr("x",pointX);
    $("#stuffedanimalwarsvgrect").attr("y",pointY); 

        //commented out to draw lines
    //start a timer for the line, depending on the direction
//    let direction = tapMsgObject.movement;
//    let objectTimerId;
//    switch(direction){
//        case 'UP':
//            objectTimerId = startShapeObjectTimerUp(circleId,"cx","cy",shapeInterval);
//            break;
//        case 'DOWN':
//            objectTimerId = startShapeObjectTimerDown(circleId,"cx","cy",shapeInterval);
//            break;
//        case 'LEFT':
//            objectTimerId = startShapeObjectTimerLeft(circleId,"cx","cy",shapeInterval);
//            break;
//        case 'RIGHT':
//            objectTimerId = startShapeObjectTimerRight(circleId,"cx","cy",shapeInterval);
//            break;
//        default:
//            console.log("UNKNOWN DIRECTION FOR DOT:"+direction);
//            break;
//    }
}
function onBaseTapSocketEventLines(tapMsgObject){
    //get the coordinates emitted
    let newPointX = tapMsgObject.x;
    let newPointY = tapMsgObject.y;

    //save off these coordinates (for drawing a line)
    let oldPointX =$("#stuffedanimalwarsvgrect").attr("x");
    let oldPointY =$("#stuffedanimalwarsvgrect").attr("y");

    //draw a line from the new to the old location
    let newLine = document.createElementNS('http://www.w3.org/2000/svg','line');
    let lineId='line'+$.now();

    newLine.setAttribute('id',lineId);
    //XYxy
    if(tapMsgObject.animal==='line01'){
        newLine.setAttribute('x1',newPointX);
        newLine.setAttribute('y1',newPointY);
    
        newLine.setAttribute('x2',newPointX); //
        newLine.setAttribute('y2',newPointY); //
    }
    //xyXY
    else if(tapMsgObject.animal==='line02'){ 
        newLine.setAttribute('x1',oldPointX);
        newLine.setAttribute('y1',oldPointY);
    
        newLine.setAttribute('x2',newPointX); //
        newLine.setAttribute('y2',newPointY); //
    }
    else{
        console.log('UNKNOWN LINE ANIMAL:'+tapMsgObject.animal);
    }

    
    //RANDOM COLOR LINE
    newLine.setAttribute('style','stroke:rgb('+GetRandomColorValue()+','+GetRandomColorValue()+','+GetRandomColorValue()+');stroke-width:'+lineWidth+';'); 

    //ADD LINE TO THE SVG
    $("#stuffedanimalwarsvg").append(newLine);

    //MOVE THE CURSOR
    //move the state rectangle to where the click was made
    $("#stuffedanimalwarsvgrect").attr("x",newPointX);
    $("#stuffedanimalwarsvgrect").attr("y",newPointY); 

    //commented out to draw lines
//    //start a timer for the line, depending on the direction
//    let direction = tapMsgObject.movement;
//    let objectTimerId;
//    switch(direction){
//        case 'UP':
//            objectTimerId = startShapeObjectTimerUp(lineId,"x1","y1",shapeInterval);
//            break;
//        case 'DOWN':
//            objectTimerId = startShapeObjectTimerDown(lineId,"x1","y1",shapeInterval);
//            break;
//        case 'LEFT':
//            objectTimerId = startShapeObjectTimerLeft(lineId,"x1","y1",shapeInterval);
//            break;
//        case 'RIGHT':
//            objectTimerId = startShapeObjectTimerRight(lineId,"x1","y1",shapeInterval);
//            break;
//        default:
//            console.log("UNKNOWN DIRECTION FOR LINE:"+direction);
//            break;
//    }
}
function onBaseTapSocketEventCustom(tapMsgObject){
    if (
        tapMsgObject.customimage.indexOf("http://")===0||
        tapMsgObject.customimage.indexOf("https://")===0
       ){ 
            if( tapMsgObject.customimage.indexOf(".jpg")   >   0 ||
                tapMsgObject.customimage.indexOf(".jpeg")  >   0 ||
                tapMsgObject.customimage.indexOf(".JPG")  >   0 ||
                tapMsgObject.customimage.indexOf(".gif")   >   0 ||
                tapMsgObject.customimage.indexOf(".png")   >   0){
                onBaseTapSocketEventImages(tapMsgObject,tapMsgObject.customimage);
            }
            else{
                console.log('MESSAGE SENT DOES NOT CONTAIN A VALID ENOUGH IMAGE URL'+tapMsgObject.customimage);
            }
        }
}
function onBaseTapSocketEventImages(tapMsgObject,imagePath){
    let width=imageWidthPixels;
    let height=imageHeightPixels;
    let animalId='animal'+$.now();

    //get the coordinates emitted
    let pointX = tapMsgObject.x-(width/2);
    let pointY = tapMsgObject.y-(height/2);
    
    let svgimg = document.createElementNS('http://www.w3.org/2000/svg','image');
    svgimg.setAttributeNS(null,'id',animalId);
    svgimg.setAttributeNS(null,'class','animalimage');
    svgimg.setAttributeNS(null,'height',height);
    svgimg.setAttributeNS(null,'width',width);
    svgimg.setAttributeNS('http://www.w3.org/1999/xlink','href', imagePath);
    svgimg.setAttributeNS(null,'x',pointX);
    svgimg.setAttributeNS(null,'y',pointY);
    svgimg.setAttributeNS(null, 'visibility', 'visible');
    $('#stuffedanimalwarsvg').append(svgimg);

    $("#stuffedanimalwarsvgrect").attr("x",tapMsgObject.x);
    $("#stuffedanimalwarsvgrect").attr("y",tapMsgObject.y); 
    
    //start a timer for the line, depending on the direction
    let direction = tapMsgObject.movement;
    let objectTimerId;
    
    //randomize the speed at how often the animal moves
//    let randomAnimalInterval=Math.floor((Math.random() * animalInterval) + 1);
//TODO: TEST HOW FAST THE DEFAULT SETTINGS GO
    let randomAnimalInterval=animalInterval;

    switch(direction){
        case 'UP':
            objectTimerId = startAnimalObjectTimerUp(animalId,"x","y",randomAnimalInterval);
            break;
        case 'DOWN':
            objectTimerId = startAnimalObjectTimerDown(animalId,"x","y",randomAnimalInterval);
            break;
        case 'LEFT':
            objectTimerId = startAnimalObjectTimerLeft(animalId,"x","y",randomAnimalInterval);
            break;
        case 'RIGHT':
            objectTimerId = startAnimalObjectTimerRight(animalId,"x","y",randomAnimalInterval);
            break;
        default:
            return;
            console.log("UNKNOWN DIRECTION FOR ANIMAL:"+direction);
            break;
    }
}

/* 
 * HIT TEST
 */
function HitTest(animalObject,shapeObjectId,shapeXAxisAttr,shapeYAxisAttr){
    let shapePointX=            parseInt($('#'+shapeObjectId).attr(shapeXAxisAttr));
    let shapePointY=            parseInt($('#'+shapeObjectId).attr(shapeYAxisAttr));
    let animalOriginPointX =    parseInt($('#'+animalObject.objectId).attr(animalObject.xAxisAttr));
    let animalOriginPointY =    parseInt($('#'+animalObject.objectId).attr(animalObject.yAxisAttr));
    let animalWidthPixels =     parseInt($('#'+animalObject.objectId).attr('width'));
    let animalHeightPixels =    parseInt($('#'+animalObject.objectId).attr('height'));
    
    if(     shapePointX >= animalOriginPointX && 
            shapePointX <= (animalOriginPointX + animalWidthPixels) &&
            shapePointY >= animalOriginPointY &&
            shapePointY <= (animalOriginPointY + animalHeightPixels)){
        return true;
    }
    else{
        return false;
    }
}

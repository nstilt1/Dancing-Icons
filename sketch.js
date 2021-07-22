var bg, clock, discord, messages, notes, recorder, reddit, spotify, icons;
var originals;
var maxDistance = 25;

var ogDimensions = [];
var checkDimensions = true;
var song;


/**
 * Created by Noah Stiltner, aka Somedooby
 * The black "buttons" are to be used by clicking and holding, then dragging up or down, then releasing
 * the mouse button to change the value that the button is associated with.
 * They have now been replaced by keypresses, but they do still exist if you want to uncomment the create
 * canvas line and comment out the current one.
 * 
 * 
 * The first black "button" changes the speed of all app icons
 * A and S change this value now.
 * 
 * The second black "button" changes the rate that the radius changes that the circles move in. The code
 * can be changed, as I have stated in the comments below, to change the invertible spiral to become a 
 * spiral-like and possibly a flower-like motion depending on the settings.
 * W and E change this value now
 * 
 * The third black "button" changes the amount that the icons are affected by sound.
 * N and M change this value now.
 * 
 * The yellow "button" is used to play/pause the music file.
 * P toggles the music now.
 * 
 * The red/green "button" is used to make all of the icons to behave uniformly.
 * U toggles this feature now.
 * 
 *
 * Don't forget to check out my album, Treatment, by Somedooby. The name is derived from Somebody, which
 * I used before I discovered the cooler name.
 */

function preload(){

    soundFormats('mp3');
    song = loadSound('assets/DBT.mp3');
    //song = loadSound('assets/liftoff.mp3');
    bg = loadImage('assets/background.png');

    // Note: My moving background GIF was tooooo BIG :(
    //bg = loadImage('assets/background.gif');
    clock = loadImage('assets/clock.png');
    discord = loadImage('assets/discord.png');
    messages = loadImage('assets/messages.png');
    notes = loadImage('assets/notes.png');
    recorder = loadImage('assets/recorder.png');
    reddit = loadImage('assets/reddit.png');
    spotify = loadImage('assets/spotify.png');


    icons = new Array( clock, discord, messages, notes, recorder, reddit, spotify );

    //ogDimensions = new Array(icons.length);
    
    //var ogWidth = icons[i].width;
    //var ogHeight = icons[i].height;
    
}

function getCoords(y){
    return 60 + y * 120;
}

function syncChange(){
    if(synced){
        synced = false;
        syncColor = color('red');
    }else{
        synced = true;
        syncColor = color('green');
    }
}

var chunks = [];
var recording = false;
var recorder;
function record(){
    chunks.length = 0;

    var stream = document.querySelector('canvas').captureStream(30);
    recorder = new MediaRecorder(stream);
    recorder.ondataavailable = e => {
        if(e.data.size){
            chunks.push(e.data);
        }
    }
    recorder.onstop = exportVideo;
}

function exportVideo(e) {
    var blob = new Blob(chunks, {'type' : 'video/mp4'});

    var videoElement = document.createElement('video');
    videoElement.setAttribute("id", Date.now());
    videoElement.controls = true;
    document.body.appendChild(videoElement);
    videoElement.src = window.URL.createObjectURL(blob);

    var url = URL.createObjectURL(blob);
    var a = document.createElement('a');
    document.body.appendChild(a);
    a.style = 'display: none';
    a.href = url;
    a.download = 'canvas.mp4';
    a.click();
    window.URL.revokeObjectURL(url);
}

var syncColor;
var canvas;

function setup(){
    syncColor = color('green');


    canvas = createCanvas(1080,2160);
    //createCanvas(1700,2160);
    image(bg, 0, 0);

    // Create control 1: float speed
    fill(color('black'));
    circle(1140,getCoords(0),120);

    // Create control 2: other speed
    fill(color('black'));
    circle(1140,getCoords(1),120);

    // play/pause music
    fill(color('yellow'));
    circle(1140,getCoords(3),120);

    // change multiplier on energy
    fill(color('black'));
    circle(1140,getCoords(4),120);

    fill(syncColor);
    circle(1140,getCoords(2),120);

    fill(color("black"));
    textSize(40);
    textAlign(LEFT, CENTER);
    text("Float Rate", 1200, getCoords(0));
    text("delta-Radius Rate", 1200, getCoords(1));
    text("Sync/Unsync Movement", 1200, getCoords(2));
    text("Play/Pause Music", 1200, getCoords(3));
    text("Change music multiplier", 1200, getCoords(4));

    rectMode(CENTER);
    
    frameRate(30);

    originals = new Array(
        new Array( 539, 246 ),  // clock
        new Array( 945, 546 ),  // discord
        new Array( 336, 538 ),  // messages
        new Array( 144, 230 ),  // notes
        new Array( 336, 1160 ), // recorder
        new Array( 742, 846 ),  // reddit
        new Array( 742, 538 )   // spotify
    )
    if(checkDimensions){
        for(var i = 0; i < icons.length; i++){
            ogDimensions[i] = [icons[i].width, icons[i].height];
        }
        checkDimensions = true;
    }
    

    fft = new p5.FFT();

    record();
    
}

var clicked1 = false;
var clicked2 = false;
var clicked3 = false;
var my;
var adjust = 0.00632;
var weird = 0.001;

var synced = true;


// Determines which "button" is pressed
function mousePressed(){
    
    
    console.log(millis());
    console.log("x= " + mouseX);
    console.log("y= " + mouseY);
    if(dist(mouseX,mouseY,1140,getCoords(0)) <= 60){
        clicked1 = true;
        my = mouseY;
    }else if(dist(mouseX,mouseY,1140,getCoords(1)) <= 60){
        clicked2 = true;
        my = mouseY;
    }else if(dist(mouseX,mouseY,1140,getCoords(2)) <= 60){
        syncChange();
    }else if(dist(mouseX,mouseY,1140,getCoords(3)) <= 60){

        if(!song.isPlaying())
            song.play();
        else
            song.pause();

    }else if(dist(mouseX,mouseY,1140,getCoords(4)) <= 60){
        clicked3 = true;
        my = mouseY;
    }
}
/*
function mouseMoved(){
    if(clicked){
        console.log("t");
        if(mouseY > my){
            adjust -= ((mouseY-my)%10) * 0.0004;
        }else if(mouseY < my){
            adjust += ((my-mouseY)%10) * 0.0004;
        }
    }
}
*/

function keyTyped(){
    if(key == 'p'){
        if(!song.isPlaying())
            song.play();
        else
            song.pause();
    }else if(key == 'a'){
        adjust -= 0.0004;
        if(adjust < 0)
            adjust = 0;
        console.log("adjust = " + adjust);
    }else if(key == 's'){
        adjust += 0.0004;
        console.log("adjust = " + adjust);
    }else if(key == 'w'){
        weird -= 0.0004;
        console.log("weird = " + weird);
    }else if(key == 'e'){
        weird += 0.0004;
        console.log("weird = " + weird);
    }else if(key == 'n'){
        musicAdjustment -= 0.005;
        console.log("Music Adjustment Multiplier: " + musicAdjustment);
    }else if(key == 'm'){
        musicAdjustment += 0.005;
        console.log("Music Adjustment Multiplier: " + musicAdjustment);
    }else if(key == 'u'){
        syncChange();
    }else if(key == 'r'){
        recording = !recording;
        if(recording)
            recorder.start();
        else
            recorder.stop();
    }
}


// determines how much to change the values associated with each "button"
function mouseReleased(){

    // changes the adjustment of time to make sure the icons don't move too fast
    // first circle
    if(clicked1){
        if(mouseY > my){
            adjust -= ((mouseY-my)/10) * 0.0004;
        }else if(mouseY < my){
            adjust += ((my-mouseY)/10) * 0.0004;
        }
        if(adjust < 0){
            adjust = 0;
        }
        console.log("adjust = " + adjust);

        // changes the rate that the radius changes
        // the radius changes between positive and negative, which can be changed with an absolute value 
        // function in the for loop in draw()
        // second circle
    }else if(clicked2){
        if(mouseY > my){
            weird -= ((mouseY-my)/10) * 0.0004;
        }else if(mouseY < my){
            weird += ((my-mouseY)/10) * 0.0004;
        }
        if(weird < 0){
            weird = 0;
        }
        console.log("weird = " + weird);

        // changes the amount of movement occurs resulting from sound
        // fifth circle
    }else if(clicked3){
        if(mouseY > my){
            musicAdjustment -= ((mouseY-my)/10) * 0.05;
        }else if(mouseY < my){
            musicAdjustment += ((my-mouseY)/10) * 0.2;
        }
        if(musicAdjustment < 0)
            musicAdjustment = 0;
        console.log("Music Adjustment Multiplier: " + musicAdjustment);
    }
    clicked1 = false;
    clicked2 = false;
    clicked3 = false;
}

var musicAdjustment = 3.76;

var time2 = 0;

//var frame = 0;

function draw(){
    //frame++;
    time2++;
    imageMode(CORNER);
    image(bg,0,0);
    imageMode(CENTER);

    fill(color('black'));
    textSize(32);
    text('Sync',1140,300);

    fill(syncColor);
    circle(1140,300,120);

    // for moving with the sounds
    fft.analyze();
    var energy = fft.getEnergy(15,9001); // tried 250, 500, 1600, 9001
    //var energy = fft.getEnergy("bass"); // tried 250, 500, 1600, 9001
    
    if(energy == 0)
        energy = 1;


    //console.log(energy);

    var time = millis() + energy*musicAdjustment;


    // something I've tried to make movement from sounds. it didn't work well for some reason
    // I was expecting it to work

    //time2 += energy*musicAdjustment;
    //time += time2;
    //console.log(time2);


    var t0, t1;
    if(synced){
        t0 = sin(time*adjust) * maxDistance;
        t1 = cos(time*adjust) * maxDistance;
    }

    for(var i = 0; i < icons.length; i++){
        if(!synced){
            // i affects the phase of the movement
            // adjust is used to adjust the speed of the movement
            if(i < 3){
                if(i < 1){
                    // default circlular motion
                    t0 = sin(time*adjust+i) * maxDistance;
                    t1 = -cos(time*adjust+i) * maxDistance;
                }else{
                    t0 = sin(time*adjust+i) * maxDistance;
                    t1 = cos(time*adjust+i) * maxDistance;
                }
            }else{
                /**
                 * these are for making "circular" movements that have a variable radius, which results in 
                 * an invertible spiral when the radius is negative to make a normal spiral
                 * (probably like a flower) use the code in the comments
                 * 
                 * var weird is a multiplier affecting the rate that the radius changes
                 */
                if(i % 2 == 0){
                    t0 = sin(time*adjust+i) * maxDistance; //*sin(time*weird+i);
                    t1 = cos(time*adjust+i) * maxDistance; //*sin(time*weird+i);

                    //SPIRAL-like movement/maybe a flower depending on the settings:
                    t0 *= abs(sin(time*weird+i));
                    t1 *= abs(cos(time*weird+i));

                    //  
                    //t0 *= sin(time*weird+i);
                    //t1 *= cos(time*weird+i);
                }else{
                    t0 = sin(time*adjust+i) * maxDistance; //*sin(time*weird+i);
                    t1 = -cos(time*adjust+i) * maxDistance; //*sin(time*weird+i);
                    t0 *= sin(time*weird+i);
                    t1 *= cos(time*weird+i);
                }
            }
        }

        // the numeric values at the end are to adjust the placement of the app icons
        var x = originals[i][0] + t0;
        var y = originals[i][1] + t1;

        /**
         * Code for making icons grow and shrink
         */


        var musicMaxSize = 90;
        var delta = energy/255*musicMaxSize;
        if(energy < 80){
            delta = 0;
        }else{
            delta -= 60/(195)*musicMaxSize;
        }
        

        
        var img = icons[i].get();
        //icons[i].resize(ogDimensions[i][0]*137+delta,ogDimensions[i][1]*137+delta);
        
        if(song.isPlaying()){
            //if(time2 % 3 == 0)
                //icons[i].resize(ogDimensions[i][0]+delta,ogDimensions[i][1]+delta);
                img.resize(ogDimensions[i][0]+delta,ogDimensions[i][1]+delta);

        }else{
            if(t1 != 0){
                
                var maxSize = 25;
                // bipolar growth, largest point at top and bottom
                var absT1 = abs(t1);
                //img.resize(absT1/maxDistance*maxSize+ogDimensions[i][0], absT1/maxDistance*maxSize+ogDimensions[i][1]);

                // monopolar growth, largest point at top
                //img.resize(-t1/maxDistance*maxSize+ogDimensions[i][0], -t1/maxDistance*maxSize+ogDimensions[i][1]);

                // "bouncing" icons
                img.resize(-t1/maxDistance*maxSize+ogDimensions[i][0], t1/maxDistance*maxSize+ogDimensions[i][1]);
            }
        }

        push();
        translate(x,y);
        //rotate(sin(time*0.00095+i)*PI*45/180);
        
        var xRatio = t0/maxDistance;
        rotate(xRatio*PI*35/180);

        // Display icon
        //image(img, x, y);
        image(img,0,0);
        pop();
        
    }
}
/*
// failed recording code
var videoStream = canvas.captureStream(30);
var mediaRecorder = new MediaRecorder(videoStream);
var chunks = [];
mediaRecorder.ondataavailable = function(e) {
  chunks.push(e.data);
};
mediaRecorder.onstop = function(e) {
    var blob = new Blob(chunks, { 'type' : 'video/mp4' }); // other types are available such as 'video/webm' for instance, see the doc for more info
     chunks = [];
     var videoURL = URL.createObjectURL(blob);
     video.src = videoURL;
};
mediaRecorder.start();

setTimeout(function(){mediaRecorder.stop(); }, 50000);

*/

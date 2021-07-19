var bg, clock, discord, messages, notes, recorder, reddit, spotify, icons;
var originals;
var maxDistance = 12;
var ims = [];

var song;


/**
 * The black "buttons" are to be used by clicking and holding, then dragging up or down, then releasing
 * the mouse button to change the value that the button is associated with.
 * 
 * 
 * The first black "button" changes the speed of all app icons
 * 
 * The second black "button" changes the rate that the radius changes that the circles move in. The code
 * can be changed, as I have stated in the comments below, to change the invertible spiral to become a 
 * spiral-like and possibly a flower-like motion depending on the settings.
 * 
 * The third black "button" changes the amount that the icons are affected by sound.
 * 
 * The yellow "button" is used to play/pause the music file.
 * 
 * The red/green "button" is used to make all of the icons to behave uniformly.
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
}

var syncColor;

function setup(){
    syncColor = color('green');



    //createCanvas(1080,2160);
    createCanvas(1200,2160);
    image(bg, 0, 0);

    // Create control 1: float speed
    fill(color('black'));
    circle(1140,getCords(0),120);

    // Create control 2: other speed
    fill(color('black'));
    circle(1140,getCords(1),120);

    // play/pause music
    fill(color('yellow'));
    circle(1140,getCords(3),120);

    // change multiplier on energy
    fill(color('black'));
    circle(1140,getCords(4),120);

    fill(syncColor);
    circle(1140,getCords(2),120);

    rectMode(CENTER);
    frameRate(30);

    originals = new Array(
        new Array( 534, 226 ),  // clock
        new Array( 945, 546 ),  // discord
        new Array( 336, 538 ),  // messages
        new Array( 144, 230 ),  // notes
        new Array( 336, 1160 ), // recorder
        new Array( 742, 846 ),  // reddit
        new Array( 742, 538 )   // spotify
    )

    fft = new p5.FFT();
    
}

var clicked1 = false;
var clicked2 = false;
var clicked3 = false;
var my;
var adjust = 0.00632;
var weird = 0.001;

var synced = true;

function getCords(y){
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

// Determines which "button" is pressed
function mousePressed(){
    console.log(millis());
    if(dist(mouseX,mouseY,1140,getCords(0)) <= 60){
        clicked1 = true;
        my = mouseY;
    }else if(dist(mouseX,mouseY,1140,getCords(1)) <= 60){
        clicked2 = true;
        my = mouseY;
    }else if(dist(mouseX,mouseY,1140,getCords(2)) <= 60){
        syncChange();
    }else if(dist(mouseX,mouseY,1140,getCords(3)) <= 60){

        if(!song.isPlaying())
            song.play();
        else
            song.pause();

    }else if(dist(mouseX,mouseY,1140,getCords(4)) <= 60){
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

    image(bg,0,0);

    fill(color('black'));
    textSize(32);
    text('Sync',1140,300);

    fill(syncColor);
    circle(1140,300,120);

    // for moving with the sounds
    fft.analyze();
    var energy = fft.getEnergy(15,9001); // tried 250, 500, 1600, 9001

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
                // these are for making "circular" movements that have a variable radius, which results in 
                // an invertible spiral when the radius is negative to make a normal spiral
                // (probably like a flower) use the code in the comments
                if(i % 2 == 0){
                    t0 = sin(time*adjust+i) * maxDistance; //*sin(time*weird+i);
                    t1 = cos(time*adjust+i) * maxDistance; //*sin(time*weird+i);

                    //SPIRAL-like movement/maybe a flower depending on the settings:
                    // t0 *= abs(sin(time*weird+i));
                    // t1 *= abs(cos(time*weird+i));

                    // weird is the multiplier for 
                    t0 *= sin(time*weird+i);
                    t1 *= cos(time*weird+i);
                }else{
                    t0 = sin(time*adjust+i) * maxDistance; //*sin(time*weird+i);
                    t1 = -cos(time*adjust+i) * maxDistance; //*sin(time*weird+i);
                    t0 *= sin(time*weird+i);
                    t1 *= cos(time*weird+i);
                }
            }
        }
        var x = originals[i][0] + t0 -55;
        var y = originals[i][1] + t1 -45;
        image(icons[i], x, y);
        
    }
}
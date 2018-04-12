var face = [];
var position = {x:0, y:0};
var scale = 0;
var orientation = {x:0, y:0, z:0};
var mouthWidth = 0;
var mouthHeight = 0;
var eyebrowLeft = 0;
var eyebrowRight = 0;
var eyeLeft = 0;
var eyeRight = 0;
var jaw = 0;
var nostrils = 0;
var mySound;
var mySound2;
var img1;
var img2;
var img3;
var img4;
var img5;
var img6;

function preload(){
	//music
	soundFormats('mp3'); 
	mySound = loadSound('sound/shush.mp3');
	mySound2 = loadSound('sound/playit.mp3');
  }

function setup() {
  	createCanvas(800, 800);
	setupOsc(8338, 3334);
	img1 = loadImage('images/apple.png');
	img2 = loadImage('images/grindstone.png');
	img3 = loadImage('images/window.png');
	img4 = loadImage('images/mirror.png');
	img5 = loadImage('images/bug.png');
	img6 = loadImage('images/loud.png');
	mySound.setVolume(0.4);
	mySound2.loop();
	mySound2.setVolume(0.2);
	background(255);
}

function draw() {
	imageMode(CENTER);
	image(img4, 400, 400, 800, 800)
	// FACE_OUTLINE : 0 - 16
	// LEFT_EYEBROW : 17 - 21
	// RIGHT_EYEBROW : 22 - 26
	// NOSE_BRIDGE : 27 - 30
	// NOSE_BOTTOM : 31 - 35
	// LEFT_EYE : 36 - 41
	// RIGHT_EYE : 42 - 47
	// INNER_MOUTH : 48 - 59
	// OUTER_MOUTH : 60 - 65

	// Apple in your eye
	var eye1 = map(eyeLeft, 1, 3, img1);
	image(img1, position.x, position.y, img1.width/4, img1.height/4);
	// Eyes are the window to your soul 
	var eye2 = map(eyeRight, 1, 3, img3);
	image(img3, position.x + 160, position.y, img3.width/10, img3.height/10);
	// Brows speak louder than words
	var brow = map(scale, 1, 3, img6);
	image(img6, position.x + 100, position.y-100, img6.width/6, img6.height/10);
	// Keep your nose to the grindstone 
	var nose = map(nostrils, 1, 3, img2);
	image(img2, position.x + 100, position.y + 120, img2.width/8, img2.height/8);

	// Cute as a bug's ear
	ellipseMode(CENTER);
	var brow1 = map(eyebrowLeft, 1, 5, 0, 255);
	image(img5, position.x -80, position.y + 100, img2.width/8, img2.height/8);
	// Box somebody's ears
	rectMode(CENTER);
	var brow2 = map(eyebrowRight, 1, 5, 0, 255);
	fill(random(255), brow2-120, random(255));
	rect(position.x + 250 , position.y + 100, 50, 50);

	// Bite one's tongue
	ellipseMode(CENTER);
	var mouth = map(mouthHeight, 1, 8, 100, 250);
	var mouthw = map(mouthWidth, 12, 15, 100, 200);
	fill(255, 122, 131);
	ellipse(position.x + 100, position.y + 300, mouthw-10, mouth);
	// Shush sound
    if(mouth > 150 && !mySound.isPlaying()){
        mySound.play();
        mySound2.pause();
        fill(0, 0, 0);
        ellipse(position.x + 100, position.y + 300, 70, 500);
    }
    if(mouth <= 150 && mySound.isPlaying()){
	        mySound.pause();
	        mySound2.play();
	    }

}


function receiveOsc(address, value) {
	if (address == '/raw') {
		face = [];
		for (var i=0; i<value.length; i+=2) {
			face.push({x:value[i], y:value[i+1]});
		}
	}
	else if (address == '/pose/position') {
		position = {x:value[0], y:value[1]};
		//print(position); 
	}
	else if (address == '/pose/scale') {
		scale = value[0];
	}
	else if (address == '/pose/orientation') {
		orientation = {x:value[0], y:value[1], z:value[2]};
	}
	else if (address == '/gesture/mouth/width') {
		mouthWidth = value[0];
		//console.log(mouthWidth);
	}
	else if (address == '/gesture/mouth/height') {
		mouthHeight = value[0];
		//console.log(mouthHeight);
	}
	else if (address == '/gesture/eyebrow/left') {
		eyebrowLeft = value[0];
		//print(eyebrowLeft);
	}
	else if (address == '/gesture/eyebrow/right') {
		eyebrowRight = value[0];
	}
	else if (address == '/gesture/eye/left') {
		eyeLeft = value[0];
	}
	else if (address == '/gesture/eye/right') {
		eyeRight = value[0];
		//console.log(eyeRight);
	}
	else if (address == '/gesture/jaw') {
		jaw = value[0];
		//print(jaw);
	}
	else if (address == '/gesture/nostrils') {
		nostrils = value[0];
	}
}

function setupOsc(oscPortIn, oscPortOut) {
	var socket = io.connect('http://127.0.0.1:8081', { port: 8081, rememberTransport: false });
	socket.on('connect', function() {
		socket.emit('config', {	
			server: { port: oscPortIn,  host: '127.0.0.1'},
			client: { port: oscPortOut, host: '127.0.0.1'}
		});
	});
	socket.on('message', function(msg) {
		if (msg[0] == '#bundle') {
			for (var i=2; i<msg.length; i++) {
				receiveOsc(msg[i][0], msg[i].splice(1));
			}
		} else {
			receiveOsc(msg[0], msg.splice(1));
		}
	});
}
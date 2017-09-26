//Donald Trump Tomato game!
//Written by Lauren DiGiovanni

//Images
var myBG;
var paddle;
var tomato;

//Trump default pic, damaged pic, and boolean to determine if the target must reset
var target;
var dTarget;
var targetMustReset = true;

//Tomato X, Y, and directions, along with boolean to determine if the tomato is out of bounds
var tomatoX;
var tomatoY;
var tomatoXdir;
var tomatoYdir;
var tomatoMustReset = true;

//paddle's X variable, set by default to 350
var paddleX = 350;

//X and Y of target
var targetX;
var targetY;

//coordinates of the walls
var wallLeftX = 50;
var wallRightX = 675;

//Defaults of moveValX and moveValY to represent the speed that the tomato travels at
var moveValX = 1;
var moveValY = 1;

//Score and miss counter
var score = 0;
var misses = 0;

//fc, originally named frameCount but then I realized that's an actual p5 variable lol
//fc is used as a countdown for the amount of frames (I use 30) that damaged trump shows up
var fc = 0;
//Boolean set to true to show that this is the first time the target is being set
var isFirstReset = true;
//Old target's x and y variables for use of the damaged target image
var oldTargetX;
var oldTargetY;
//distance between tomato and target
var distance;

//Sounds bing and bong
var bing;
var bong;

//Trump sound clips for when he's hit
var sound1;
var sound2;
var sound3;

//Used to prevent balls going too far into the walls if their acceleration is too high, which can cause a bug
//If give it a second is true, then the program will wait another frame of draw to change the x and y direction of the tomato
var giveItASecond = false;
//boolCounter counts down until giveItASecond can be false again when it is set to true.
var boolCounter = 0;

//Preload images and sounds....
function preload(){
	myBG = loadImage('background.png');
	tomato = loadImage('tomato.png');
	target = loadImage('target.png');
	dTarget = loadImage('dTarget.png');
	paddle = loadImage('paddle.png');

	soundFormats('ogg', 'mp3');

	bing = loadSound("bing.ogg");
	bong = loadSound("bong.ogg");

	sound1 = loadSound("oyaye.mp3");
	sound2 = loadSound("wrong.mp3");
	sound3 = loadSound("fired.mp3");
}
//Setup canvas, using center image and rectangle moes
function setup(){
	createCanvas(700,600);
	imageMode(CENTER);
	rectMode(CENTER);
}
function draw(){
	//Draw BG
	image(myBG, 350, 300);
	//Draw walls
	fill(200,0,0, 95);
	rect(0, 350, 50, 680);
	rect(700, 350, 50, 680);
	rect(350, 0, 750, 50);
	//If the A key is held down, move the paddle left.
	if(keyIsDown(65)){
		if(paddleX-100 > 0){
			paddleX -=5;
		}
	}
	//If D is being held down, move the paddle right
	if(keyIsDown(68)){
		if(paddleX+100 < 700){
			paddleX +=5;
		}
	}
	image(paddle, paddleX, 580, 200, 30);

	//If the target has been hit or must be set for the first time
	if(targetMustReset === true){
		if(!isFirstReset){
			oldTargetX = targetX;
			oldTargetY = targetY;
			targetY = (Math.random() * 320) + 80;
			targetX = (Math.random() * 500) + 100;
			//The damaged image of the target will appear for 30 frames
			fc = 30;
		}
		else{
			targetY = (Math.random() * 320) + 80;
			targetX = (Math.random() * 500) + 100;
			oldTargetY = targetY;
			oldTargetX = targetX;
			isFirstReset = false;
		}
		targetMustReset = false;
	}
	image(target, targetX, targetY, 100, 130);
	//Show the damaged image in the old spot while fc > 0
	if(fc > 0){
		image(dTarget, oldTargetX, oldTargetY, 100, 100);
		fc-= 1;
	}
	//If the tomato has fallen through the floor...
	if(tomatoMustReset){
		tomatoYdir = "down";
		var rand = random(2);
		if(rand <= 1){
			tomatoXdir = "left";
		}
		else{
			tomatoXdir = "right";
		}
		//Place tomato in the middle of the screen
		tomatoX = 350;
		tomatoY = 300;
		//Set random speeds
		moveValX = random(3);
		moveValY = random(3);
		tomatoMustReset = false;
	}
	if(boolCounter > 0){
		boolCounter--;
		if(boolCounter == 0){
			giveItASecond = false;
		}
	}
	else{
		//If the tomato hits the leftmost wall...
		if (tomatoX <= 67.5 && !giveItASecond){
			turnAroundX();
			giveItASecond = true;
			boolCounter = 2;
		}
		//If the tomato hits the rightmost wall...
		else if(tomatoX >= 637.5 && !giveItASecond){
			turnAroundX();
			giveItASecond = true;
			boolCounter = 2;
		}
		//If the tomato hits the ceiling...
		if(tomatoY <= 65 && !giveItASecond){
			tomatoYdir = "down";
			var bingNum = random(2);
			if(bingNum <= 1){
				bing.play();
			}
			else{
				bong.play();
			}
			giveItASecond = true;
			boolCounter = 2;
		}
		//If the tomato hits the paddle, turn the tomato around according to the part of the paddle it hits
		if(hitsPaddle()){
			turnAroundPaddle();
		}
		//If the tomato misses the paddle...
		else if(tomatoY > 580){
			//Increment miss counter and reset tomato
			misses++;
			tomatoMustReset = true;
		}
		//Change the position of the tomato
		if(tomatoXdir == "left"){
			tomatoX-=moveValX;
		}
		else{
			tomatoX+=moveValX;
		}
		if(tomatoYdir == "down"){
			tomatoY+=moveValY;
		}
		else{
			tomatoY-=moveValY;
		}
		//Ups the speed of the tomato until it resets
		moveValX+=.01;
		moveValY+=.01;
	}
	image(tomato, tomatoX, tomatoY, 100, 100);
	//If the tomato hits the target...
	if(isTargetCollision()){
		//Play one of three random noises
		var randNum = random(3);
		if(randNum<=1){
			sound1.play();
		}
		else if(randNum<=2){
			sound2.play();
		}
		else if(randNum > 2){
			sound3.play();
		}
		//Up the score
		score++;
		//Reset the target
		targetMustReset = true;
	}
	fill(255);
	textSize(32);
	//Prints the score and misses to the screen
	text("Score: " + score, 75,75);
	text("Misses: " + misses, 75, 105);
}
//If the tomato needs to change X direction
function turnAroundX(){
	//Play either bing or bong sound at random
	var bingNum = random(2);
	if(bingNum <= 1){
		bing.play();
	}
	else{
		bong.play();
	}
	if(tomatoXdir == "left"){
		tomatoXdir = "right";
	}
	else{
		tomatoXdir = "left";
	}
}
//If the tomato needs to change Y direction...
function turnAroundY(){
	//Play either bing or bong sound at random
	var bingNum = random(2);
	if(bingNum <= 1){
		bing.play();
	}
	else{
		bong.play();
	}
	if(tomatoYdir == "down"){
		tomatoYdir = "up";
	}
	else{
		tomatoYdir = "down";
	}
}
//Check to see if the tomato makes a collision with the paddle
function hitsPaddle(){
	if(tomatoX <= paddleX+105 && tomatoX >= paddleX-105 && tomatoY >= 535 && tomatoY <= 575){
		return true;
	}
	else{
		return false;
	}
}
//Turns the tomato around depending on which part of the paddle it hits.  Goes left if it hits the left half of the paddle, right if it hits the right part
function turnAroundPaddle(){
	if(tomatoX <paddleX){
		turnAroundY();
		tomatoXdir = "left";
	}
	else{
		turnAroundY();
		tomatoXdir = "right";
	}
}
//Checks to see if there is a collision between the tomato and the target
function isTargetCollision(){
	distance = dist(targetX, targetY, tomatoX, tomatoY);

	if(distance < 100){
		return true;
	}
	return false;
}

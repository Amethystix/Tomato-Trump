var myBG;
var paddle;
var tomato;
var target;
var targetMustReset = true;

var tomatoX;
var tomatoY;
var tomatoXdir;
var tomatoYdir;
var tomatoMustReset = true;

var paddleX = 350;

var targetX;
var targetY;

var wallLeftX = 50;
var wallRightX = 675;

var moveValX = 1;
var moveValY = 1;

var score = 0;

var frameCount = 0;
var isFirstReset = true;
var oldTargetX;
var oldTargetY;
var distance;

function preload(){
	myBG = loadImage('background.png');
	tomato = loadImage('tomato.png');
	target = loadImage('target.png');
	paddle = loadImage('paddle.png');
}
function setup(){
	createCanvas(700,600);
	imageMode(CENTER);
	rectMode(CENTER);
}
function draw(){
	image(myBG, 350, 300);
	fill(200,0,0, 95);
	rect(0, 350, 50, 680);
	rect(700, 350, 50, 680);
	rect(350, 0, 750, 50);


	image(paddle, paddleX, 580, 200, 30);

	if(targetMustReset === true){
		if(!isFirstReset){
			oldTargetX = targetX;
			oldTargetY = targetY;
			targetY = (Math.random() * 300) + 60;
			targetX = (Math.random() * 450) + 50;
			frameCount = 30;
		}
		else{
			targetY = (Math.random() * 300) + 60;
			targetX = (Math.random() * 450) + 50;
			oldTargetY = targetY;
			oldTargetX = targetX;
			isFirstReset = false;
		}
		targetMustReset = false;
	}
	image(target, targetX, targetY, 100, 130);
	if(frameCount > 30){
		image(dTarget, oldTargetX, oldTargetY, 100, 130);
		frameCount--;
	}
	if(tomatoMustReset){
		tomatoYdir = "down";
		var rand = random(2);
		if(rand <= 1){
			tomatoXdir = "left";
		}
		else{
			tomatoXdir = "right";
		}
		tomatoX = random(500) + 75;
		tomatoY = random(450);
		moveValX = random(3);
		moveValY = random(3);
		tomatoMustReset = false;
	}
	else{
		if (tomatoX <= 75){
			turnAroundX();
		}
		else if(tomatoX >= 625){
			turnAroundX();
		}
		if(tomatoY <= 65){
			tomatoYdir = "down";
		}
		if(hitsPaddle()){
			turnAroundPaddle();
		}
		else if(tomatoY > 550){
			tomatoMustReset = true;
		}
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
		moveValX+=.01;
		moveValY+=.01;
	}
	image(tomato, tomatoX, tomatoY, 100, 100);
	if(isTargetCollision()){
		score++;
		targetMustReset = true;
	}


}
function turnAroundX(){
	if(tomatoXdir == "left"){
		tomatoXdir = "right";
	}
	else{
		tomatoXdir = "left";
	}
}
function turnAroundY(){
	if(tomatoYdir == "down"){
		tomatoYdir = "up";
	}
	else{
		tomatoYdir = "down";
	}
}
function hitsPaddle(){
	if(tomatoX <= paddleX+105 && tomatoX >= paddleX-105 && tomatoY >= 535 && tomatoY <= 575){
		return true;
	}
	else{
		return false;
	}
}
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
function isTargetCollision(){
	distance= dist(targetX, targetY, tomatoX, tomatoY);
	if(dist < 50){
		return true;
	}
}
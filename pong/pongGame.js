/*A Karapostolakis
  2015-06-08
  A Pong game made in JavaScript*/
"use strict";
var canvas;
var ctx;
var canvasHeight;
var canvasWidth;
var paddleLeftX;
var paddleLeftY;
var paddleRightX;
var paddleRightY;
var paddleWidth;
var paddleHeight;
var ballX;
var ballY;
var ballDirectionX;
var ballDirectionY;
var scoreLeft;
var scoreRight;
var scoreTimer;
var wPressed = false;
var sPressed = false;
var upPressed = false;
var downPressed = false;
var intervalId;
var hitPaddleSound = new Audio("hitPaddle.wav");
var hitWallSound = new Audio("hitWall.wav");
var missSound = new Audio("miss.wav");

function ballReset() {
	console.log("ball reset");
	ballX = 376;
	ballY = canvasHeight / 2;
};

function init() {
	//get reference to canvas
	canvas = document.getElementById("pongCanvas");
	ctx = canvas.getContext("2d");
	canvasHeight = canvas.height;
	canvasWidth = canvas.width;
	//check for audio functionality
	if (new Audio().canPlayType("audio/wav") == "") {
		alert("Your browser does not support WAV format audio. You will not hear sound in this game.");
	};
	//initialize all variables
	ballReset();
	ballDirectionX = -2;
	ballDirectionY = 2;
	paddleHeight = 30;
	paddleWidth = 8;
	paddleLeftX = 120;
	paddleLeftY = (canvasHeight - paddleHeight) / 2;
	paddleRightX = 632;
	paddleRightY = (canvasHeight - paddleHeight) / 2;
	scoreLeft = 0;
	scoreRight = 0;
	scoreTimer = -1;
	//refresh canvas every 10 milliseconds
	clearInterval(intervalId);
	intervalId = setInterval(draw, 10);
};

//detect key press
function onKeyDown(evt) {
	//either W or S
	if (evt.keyCode == 87) {
		wPressed = true;
	} else if (evt.keyCode == 83) {
		sPressed = true;
	};
	//either up or down
	if (evt.keyCode == 38) {
		upPressed = true;
	} else if (evt.keyCode == 40) {
		downPressed = true;
	};
};

//detect key release
function onKeyUp(evt) {
	//either W or S
	if (evt.keyCode == 87) {
		wPressed = false;
	} else if (evt.keyCode == 83) {
		sPressed = false;
	};
	//either up or down
	if (evt.keyCode == 38) {
		upPressed = false;
	} else if (evt.keyCode == 40) {
		downPressed = false;
	};
};

//bind key events to detection functions
$(document).keydown(onKeyDown);
$(document).keyup(onKeyUp);

function drawField() {
	//draw background
	ctx.fillStyle = "#000000";
	ctx.fillRect(0, 0, canvasWidth, canvasHeight);
	//draw dividing line, set draw colour
	ctx.fillStyle = "#FFFFFF";
	for (var i = 80; i <= 560; i += 16) {
		ctx.fillRect(376, i, 4, 8);
	};
};

function draw() {
	//advance timer
	scoreTimer--;
	//reset ball if timer has run out
	if (scoreTimer == 0) {
		ballReset();
	};
	//draw field
	drawField();
	//draw scores
	ctx.font = "64px pong_scoreregular";
	ctx.textAlign = "end";
	ctx.fillText(scoreLeft, 248, 112);
	ctx.fillText(scoreRight, 632, 112);
	//end animation if either score has reached 11
	if (scoreLeft >= 11 || scoreRight >= 11) {
		clearInterval(intervalId);
	};
	//move left paddle
	if (wPressed && paddleLeftY > 0) {
		paddleLeftY -= 5;
	} else if (sPressed && paddleLeftY + paddleHeight < canvasHeight) {
		paddleLeftY += 5;
	};
	//move right paddle
	if (upPressed && paddleRightY > 0) {
		paddleRightY -= 5;
	} else if (downPressed && paddleRightY + paddleHeight < canvasHeight) {
		paddleRightY += 5;
	};
	//draw left paddle
	ctx.fillRect(paddleLeftX, paddleLeftY, paddleWidth, paddleHeight);
	//draw right paddle
	ctx.fillRect(paddleRightX, paddleRightY, paddleWidth, paddleHeight);
	//draw ball
	ctx.fillRect(ballX, ballY, 8, 8);
	//if ball hits top or bottom of field (and timer not running)
	if ((ballY + ballDirectionY > canvasHeight || ballY + ballDirectionY < 0) && scoreTimer < 0) {
		//bounce off
		ballDirectionY = -ballDirectionY;
		//play sound
		hitWallSound.play();
	};
	//if ball hits left side and timer not running
	if (ballX < 0 && scoreTimer <= 0) {
		//point for right side
		scoreRight++;
		//play sound
		missSound.play();
		//start timer
		scoreTimer = 100;
	};
	//if ball hits right side and timer not running
	if (ballX > canvasWidth && scoreTimer <= 0) {
		//point for left side
		scoreLeft++;
		//play sound
		missSound.play();
		//start timer
		scoreTimer = 100;
	};
	//if ball hits left paddle
	if ((ballX > paddleLeftX && ballX < paddleLeftX + paddleWidth) && (ballY > paddleLeftY && ballY < paddleLeftY + paddleHeight)) {
		//bounce off
		ballDirectionX = -ballDirectionX;
		//make it go in a different direction depending on where it hit the paddle
		ballDirectionY = 8 * ((ballY - (paddleLeftY + paddleHeight / 2)) / paddleHeight);
		//play sound
		hitPaddleSound.play();
	};
	//if ball hits right paddle
	if ((ballX > paddleRightX && ballX < paddleRightX + paddleWidth) && (ballY > paddleRightY && ballY < paddleRightY + paddleHeight)) {
		//bounce off
		ballDirectionX = -ballDirectionX;
		//make it go in a different direction depending on where it hit the paddle
		ballDirectionY = 8 * ((ballY - (paddleRightY + paddleHeight / 2)) / paddleHeight);
		//play sound
		hitPaddleSound.play();
	};
	//move ball
	ballX += ballDirectionX;
	ballY += ballDirectionY;
};
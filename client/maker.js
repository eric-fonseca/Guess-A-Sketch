"use strict";

var canvas = $("#canvas");
var ctx = canvas[0].getContext("2d");
var canvas2 = $("#canvas2");
var ctx2 = canvas2[0].getContext("2d");
var drawing = false;
var guessing = false;
var id = Math.round(new Date().getTime() + (Math.random() * 100)); //create a random id for the user
var users = {};
var mousePos = {};
var socket = io.connect(window.location.hostname);
var color = "#000000"; //default color = black
var strokeSize = 5; //default size = 5
var wordList = ["cat", "sun", "cup", "ghost", "flower", "pie", "cow", "banana", "snowflake", "bug", "book", "jar", "snake", "light", "tree", 
"lips", "apple", "slide", "socks", "smile", "swing", "coat", "shoe", "water", "heart", "hat", "ocean", "kite", "dog", "mouth", "milk", "duck", 
"eyes", "skateboard", "bird", "boy", "apple", "person", "girl", "mouse", "ball", "house", "star", "nose", "bed", "whale", "jacket", "shirt", 
"hippo", "beach", "egg", "face", "cookie", "cheese", "ice cream cone", "drum", "circle", "spoon", "worm", "spider web", "horse", "door", "song",
"trip", "backbone", "bomb", "round", "treasure", "garbage", "park", "pirate", "ski", "state", "whistle", "palace", "baseball", "coal", "queen",
"dominoes", "photograph", "computer", "hockey", "aircraft", "hot dog", "salt and pepper", "key", "iPad", "whisk", "frog", "lawnmower", "mattress",
"pinwheel", "cake", "circus", "battery", "mailman", "cowboy", "password", "bicycle", "skate", "electricity", "lightsaber", "thief", "teapot", 
"deep", "spring", "nature", "shallow", "toast", "outside", "America", "roller blading", "gingerbread man", "bowtie", "half", "spare", "wax",
"light bulb", "platypus", "music", "snag", "jungle", "important", "mime", "peasant", "baggage", "hail", "clog", "pizza sauce", "password", 
"scream", "newsletter", "pro", "dripping", "pharmacist", "lie", "catalog", "ringleader", "husband", "laser", "diagonal", "comfy", "myth", "dorsal",
"biscuit", "hydrogen", "macaroni", "rubber", "darkness", "yolk", "exercise", "vegetarian", "chestnut", "ditch", "wobble", "glitter", "neighborhood",
"dizzy", "fireside", "retail", "drawback", "logo", "fabric", "mirror", "barber", "jazz", "migrate", "drought", "commercial", "dashboard", "bargain",
"double", "download", "professor", "landscape", "ski goggles", "vitamin"];

canvas[0].width = document.body.clientWidth * 0.6; //set the left canvas width to take up 60% of the screen
canvas[0].height = canvas2[0].height = document.body.clientHeight * 0.8; //set the height of both canvases to take up 80% of the screen
canvas2[0].width = document.body.clientWidth * 0.3; //set the right canvas width to take up 30% of the screen

ctx.lineCap = ctx2.lineCap = 'round'; //circular brush
ctx.lineJoin = ctx2.lineJoin = 'round';

$(document).ready(function() {

	var randomWord = wordList[Math.floor(Math.random() * wordList.length)];
	$("#word").html("Draw your word: " + randomWord);
    
    socket.on('draw', function(data){
    	if(data.drawing && users[data.id]){ //receive data from other users
    		ctx.strokeStyle = data.color;
    		ctx.lineWidth = data.strokeSize;
    		ctx.beginPath();
    		ctx.moveTo(users[data.id].x - 20, users[data.id].y - 80);
        	ctx.lineTo(data.x - 20, data.y - 80);
        	ctx.stroke();
    	}
    	else if(data.guessing && users[data.id]){
    		ctx2.strokeStyle = data.color;
    		ctx2.lineWidth = data.strokeSize;
    		ctx2.beginPath();
    		ctx2.moveTo(users[data.id].x - document.body.clientWidth * 0.6 - 60, users[data.id].y - 80);
        	ctx2.lineTo(data.x - document.body.clientWidth * 0.6 - 60, data.y - 80);
        	ctx2.stroke();
    	}
    	users[data.id] = data;
    	users[data.id].updated = new Date().getTime();
    });
    
    $(document).on("mousedown", function (e){ //fade the instructions after you click anywhere on the screen	
    	$("#instructions").fadeOut();
	});
    
    $("#canvas").on("mousedown", function(e){ //save mouse position and start drawing
    	e.preventDefault();
    	drawing = true;
    	mousePos.x = e.pageX;
    	mousePos.y = e.pageY;
    });
    
    $("#canvas").on("mouseup", function(e){ //stop drawing
    	drawing = false;
    });
    
    $("#canvas").on("mouseleave", function(e){ //stop drawing
    	drawing = false;
    });
    
    $("#canvas2").on("mousedown", function(e){ //save mouse position and start drawing
    	e.preventDefault();
    	guessing = true;
    	mousePos.x = e.pageX;
    	mousePos.y = e.pageY;
    });
    
    $("#canvas2").on("mouseup", function(e){ //stop drawing
    	guessing = false;
    });
    
    $("#canvas2").on("mouseleave", function(e){ //stop drawing
    	guessing = false;
    });
    
    $(document).on("mousemove", function(e){
    	socket.emit('mousemove',{ //send information to other users
    		'x': e.pageX,
    		'y': e.pageY,
    		'drawing': drawing,
    		'guessing': guessing,
    		'id': id,
    		'color': color,
    		'strokeSize': strokeSize
    	});
    	if(drawing){
    		ctx.strokeStyle = color;
    		ctx.lineWidth = strokeSize;
    		ctx.beginPath();
    		ctx.moveTo(mousePos.x - 20, mousePos.y - 80);
        	ctx.lineTo(e.pageX - 20, e.pageY - 80);
        	ctx.stroke();
    		mousePos.x = e.pageX;
    		mousePos.y = e.pageY;
    	}
    	if(guessing){
    		ctx2.strokeStyle = color;
    		ctx2.lineWidth = strokeSize;
    		ctx2.beginPath();
    		ctx2.moveTo(mousePos.x - document.body.clientWidth * 0.6 - 60, mousePos.y - 80);
        	ctx2.lineTo(e.pageX - document.body.clientWidth * 0.6 - 60, e.pageY - 80);
        	ctx2.stroke();
    		mousePos.x = e.pageX;
    		mousePos.y = e.pageY;
    	}
    });
    
    $(".color").on("click", function(e) { //change the color to the id of the selected color
        color = this.id;
    });
    
    $('select').on('change', function() { //change the stroke size to the selected value
  		strokeSize = this.value;
	});
	
	setInterval(function(){ //remove a user if they haven't updated in 10 seconds (they probably left)
        for(var name in users){
            if(new Date().getTime() - users[name].updated > 10000){
                delete users[name];
            }
        }
    },1000); 
    
    setInterval(function(){ //randomly choose a new word every 90 seconds
    	randomWord = wordList[Math.floor(Math.random() * wordList.length)];
    	$("#word").html("Draw your word: " + randomWord);
    },90000); 
});
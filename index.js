var mathLib = require('./math');
var jokesLib = require('./jokes');

var app = {};

app.config = {
	'timer': 1000
};

app.printJoke = function(){

	var allJokes = jokesLib.alljokes();

	var numberOfJokes = allJokes.length;

	var randomNo = mathLib.getRandomNumber(1, numberOfJokes);

	var showJoke = allJokes[randomNo - 1];

	console.log('selected joke  ', showJoke);
}

app.indefinateLoop = function() {
	setInterval(app.printJoke, app.config.timer);
}

app.indefinateLoop();
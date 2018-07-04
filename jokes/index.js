var fs = require('fs');

var jokes = {};

jokes.alljokes = function(){
	
	var fileContent = fs.readFileSync(__dirname+'/joke.txt', 'utf8');

	var arrayofJokes = fileContent.split('?');

	return arrayofJokes;

}

module.exports = jokes;
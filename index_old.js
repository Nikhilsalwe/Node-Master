/*
 * Primary file for API
 *
 */

// Dependencies
var http = require('http');
var url = require('url');
var StringDecoder = require('string_decoder').StringDecoder;

 // Configure the server to respond to all requests with a string
var server = http.createServer(function(req,res){

  // Parse the url
  var parsedUrl = url.parse(req.url, true);

  // Get the path
  var path = parsedUrl.pathname;
  var trimmedPath = path.replace(/^\/+|\/+$/g, '');

  // Get the query string as an object
  var queryStringObject = parsedUrl.query;

  // Get the HTTP method
  var method = req.method.toLowerCase();

  //get the headers as an objectc

  var headers = req.headers;

  //Get the payload if, any

  var decoder = new StringDecoder('utf-8');
  var buffer = '';

  req.on('data', function(data){
    buffer += decoder.write(data);
  });

  req.on('end', function(){
    buffer += decoder.end();

    //we are adding chosehandle func here because this req end will get called for every req
    //choose the handler this request go to if not found called notFound

    var chosenHandler = typeof(router[trimmedPath]) !== undefined ? router[trimmedPath] : handlers.notFound;

    //set the data to send handler

    var data = {
    	'trimmedPath': trimmedPath,
    	'queryStringObject': queryStringObject,
    	'method': method,
    	'headers': headers,
    	'payload': buffer
    }

    //router request to specified handle
    chosenHandler(data, function(statusCode, payload){
    	//use the status code define by handle or use by default 200
    	statusCode = typeof(statusCode) == 'number'? statusCode : 200;

    	//use ppayload called by object or else use empty
    	payload = typeof(payload) == 'object' ? payload : {};

    	//convert payload to string
    	payloadString = JSON.stringify(payload);

    	//send response now 
    	res.writeHead(statusCode);
  		res.end(payload);
    })

  

  // Log the request/response
  console.log('Request received received with eaders:--  ', buffer);

  });


});

// Start the server
server.listen(3000,function(){
  console.log('The server is up and running now');
});

//define handler
var handlers = {}

//define handlers function
handlers.sample = function(data, callback){
	//callback send http status code and a payload object
	callback(406, {'name': 'I am sample request'});
};

//define default handler
handlers.notFound = function(callback)(){
	callback(404);
};

//define a request router
var router = {
	'sample': handlers.sample // when samplle request comes this handler get called
}
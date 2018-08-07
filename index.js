/*
 * Primary file for API
 *
 */

// Dependencies
var http = require('http');
var https = require('https');
var url = require('url');
var StringDecoder = require('string_decoder').StringDecoder;
var config = require('./config');
var fs = require('fs');
var _data = require('./lib/data');

//Testing

// _data.create('test','newFile2',{'foo': 'Nikhil'}, function(err){
//   console.log('this is the error', err);
// });

// _data.read('test','newFile3', function(err, data){
//   console.log('this is the error', err, 'and this was the data', data);
// })

// _data.update('test','newFile', {'fizz':'salwe'}, function(err){
//   console.log('this is the error', err);
// })

_data.delete('test','newFile', function(err){
  console.log('this is the error', err);
})





// Instanttiate http server
var httpServer = http.createServer(function(req,res){
  unifiedServer(req,res);
});

// Start the http server
httpServer.listen(config.httpPort,function(){
  console.log("The server is up " + config.httpPort + " in " + config.envName + " and running now");
});

//Instantial https server
var httpsServerOptions = {
  'key': fs.readFileSync('./https/key.pem'),
  'cert': fs.readFileSync('./https/cert.pem')
};

var httpsServer = https.createServer(httpsServerOptions, function(req,res){
  unifiedServer(req,res);
});

//start https server
httpsServer.listen(config.httpsPort,function(){
  console.log("The server is up " + config.httpsPort + " in " + config.envName + " and running now");
});

//All the server login to handle http and https server
var unifiedServer = function(req, res){
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

  req.on('end', function() {
      buffer += decoder.end();

      // Check the router for a matching path for a handler. If one is not found, use the notFound handler instead.
      var chosenHandler = typeof(router[trimmedPath]) !== 'undefined' ? router[trimmedPath] : handlers.notFound;

      // Construct the data object to send to the handler
      var data = {
        'trimmedPath' : trimmedPath,
        'queryStringObject' : queryStringObject,
        'method' : method,
        'headers' : headers,
        'payload' : buffer
      };

      // Route the request to the handler specified in the router
      chosenHandler(data,function(statusCode,payload){

        // Use the status code returned from the handler, or set the default status code to 200
        statusCode = typeof(statusCode) == 'number' ? statusCode : 200;

        // Use the payload returned from the handler, or set the default payload to an empty object
        payload = typeof(payload) == 'object'? payload : {};

        // Convert the payload to a string
        var payloadString = JSON.stringify(payload);

        //set content type
        res.setHeader('Content-Type', 'application/json');

        // Return the response
        res.writeHead(statusCode);
        res.end(payloadString);
        console.log("Returning this response: ",statusCode,payloadString);

      });

  });
}

//define handler
var handlers = {}

//define handlers function
handlers.ping = function(data, callback){
  //callback send http status code and a payload object
  callback(200);
};



// Not found handler
handlers.notFound = function(data,callback){
  callback(404);
};

//define a request router
var router = {
  'ping': handlers.ping // when samplle request comes this handler get called
}
//Used the app.js from colour server tutorial

// load necessary modules
var http = require('http');
var fs = require('fs');
var mime = require('mime-types');
var url = require('url');
var board = require('./res/makeBoard.js');

const ROOT = "./public_html";

// create http server
var server = http.createServer(handleRequest); 
server.listen(2406);
console.log('Server listening on port 2406');

var users = {};

function handleRequest(req, res) {
	
	//process the request
	console.log(req.method+" request for: "+req.url);
	
	//parse the url
	var urlObj = url.parse(req.url,true);
	var filename = ROOT+urlObj.pathname;
	
	if(urlObj.pathname==="/memory/intro"){
		console.log("new User: "+urlObj.query.username);
		
		
		client = {pairs:board.makeBoard(4)};

		users[urlObj.query.username] = client;

		console.log(users[urlObj.query.username].pairs);
		var usersJSON = JSON.stringify(users);
		res.writeHead(200);
		
		res.end(usersJSON);

	}
	else if(urlObj.pathname==="/memory/card"){
		console.log("user : "+urlObj.query.username);
		console.log("row : "+urlObj.query.rowindex);
		console.log("column : "+urlObj.query.columnindex);

		//Create a return package with the value, the row and column co-ordinate
		var returnPackage = {};
		valueInt = users[urlObj.query.username].pairs[urlObj.query.rowindex][urlObj.query.columnindex];

		returnPackage["value"] = valueInt;
		returnPackage["row"] = urlObj.query.rowindex;
		returnPackage["column"] = urlObj.query.columnindex

		console.log(returnPackage);
		

		var valueJSON = JSON.stringify(returnPackage);
		res.writeHead(200);
		
		res.end(valueJSON);

	}
	else{
		//the callback sequence for static serving...
		fs.stat(filename,function(err, stats){
			if(err){   //try and open the file and handle the error, handle the error
				respondErr(err);
			}else{
				if(stats.isDirectory())	filename+="/index.html";
			
				fs.readFile(filename,"utf8",function(err, data){
					if(err)respondErr(err);
					else respond(200,data);
				});
			}
		});
	}		
	
	//locally defined helper function
	//serves 404 files 
	function serve404(){
		fs.readFile(ROOT+"/404.html","utf8",function(err,data){ //async
			if(err)respond(500,err.message);
			else respond(404,data);
		});
	}
		
	//locally defined helper function
	//responds in error, and outputs to the console
	function respondErr(err){
		console.log("Handling error: ",err);
		if(err.code==="ENOENT"){
			serve404();
		}else{
			respond(500,err.message);
		}
	}
		
	//locally defined helper function
	//sends off the response message
	function respond(code, data){
		// content header
		res.writeHead(code, {'content-type': mime.lookup(filename)|| 'text/html'});
		// write message and signal communication is complete
		res.end(data);
	}	
	
};//end handle request




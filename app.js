var colors = require("colors"); //awsome console

function errPrint(text) {
	console.log("\n--------------------");
	console.log(colors.red("ERROR: ") + text);
	console.log("--------------------\n");
}
function wrnPrint(text) {
	console.log(colors.yellow("WARNING: ") + text);
}

var http = require("http");
var port = 80;

var fs = require("fs");
var forbiddenFiles = ["./prefs.html"];

var landingPage = "./index.html"; //the page you get when you request "/"

function authLogin(json) {
	try {
		var prefs = fs.readFileSync("./prefs.html"); //serve the prefs page
		return prefs;
	}
	catch(err) {
		errPrint("in authLogin: " + err);
		return "Error: " + err;
	}
}

http.createServer(function(request, response) { //on every request to the server:
	var filePath = "." + request.url;
	if(filePath == "./") filePath = landingPage; //there isn't actually a file as the directory.
	//so we need to redirect the filepath to the actual landing page.
	if(request.method == "GET") { //if the request has no hidden data
		for (var i = forbiddenFiles.length - 1; i >= 0; i--) {
			if(filePath.includes(forbiddenFiles[i])) {
				serveError(403, "403, file firbidden.", request, response);
			}
		}

		if(filePath.indexOf("?") != -1) { //if there's GET data
			//do stuff here /////////////////////////////////////////////////////////////
		}
		try {
			var content = fs.readFileSync(filePath); //check if the file exists and read it!
			//no error yet? That means the file was found.
			var type = filePath.split(".")[filePath.split(".").length - 1];
			switch(type) {
				//images:
				case "png":
					response.writeHead(200, {"Content-Type": "image/png"});
				break;
				case "jpg":
				case "jpeg":
					response.writeHead(200, {"Content-Type": "image/jpg"});
				break;
				case "ico":
					response.writeHead(200, {"Content-Type": "image/x-icon"});
				break;

				//scripts or programs
				case "js":
					response.writeHead(200, {"Content-Type": "application/javascript"});
				break;

				//serve as text/format
				default:
					response.writeHead(200, {"Content-Type": "text/" + type});
				break;
			} //end switch(type)
			response.end(content); //serve the requseted file
		} //end try
		catch(error) {
			if(error.code == "ENOENT") { //the file wasn't found
				serveError(404, "404, file not found", request, response);
				wrnPrint("Could not find file " + filePath);
			}
			else {
				serveError(500, "500: " + error.toString().replace("Error: ", ""), request, response);
			}
		} //end catch
	} //end if(request.method == "GET")
	else if(request.method == "POST") {
		switch(filePath) { //what is the user trying to do?
			case "./authLogin": //if trying to log in
				extractPost(request, response); //get the data to a readable format
			break;
		}
	}
}).listen(port);

function extractPost(request, response) {
	var data = "";
	request.on("data", function(chunk) { //if there's still data in the request that we haven't read
		//check for stuff here ///////////////////////////////////////////////////////////////////////////////
		data += chunk.toString(); //append it to the total data
		if(data.toString().length > 1e6) { //kill the connection if there's too much data at once
			request.connection.destroy(); //disconnect
			wrnPrint("Too much data, killing connection.");
		}
	});
	request.on("end", function() { //when it's done reading the request
		if(response) { //if the called gave a response object for autoserving
			serveText(authLogin(toJson(data)), response); //do so
		}
		else { //otherwise
			return data; //return normally
		}
	});
} //end extractPost()

function toJson(data) {
	var json = {
		email: data.split("=")[1].split("&")[0],
		pw: data.split("=")[2].split("&")[0]
	}
	return json;
} //end toJson()

function serveText(text, response) {
	try {
		response.writeHead(200, {"Content-Type": "text/plain"});
		response.end(text);
	}
	catch(err) { //if an error was thrown
		errPrint("in serving plaintext: " + err);
		response.writeHead(500, {"Content-Type": "text/plain"});
		response.end("Error: " + err);
	}
} //end serveText()

function serveError(code, text, request, response) { //internal server error
	try {
		var content = fs.readFileSync("./error.html").toString().replace("ERRBODY", text);
		response.writeHead(code, {"Content-Type": "text/html"});
		response.end(content);
	}
	catch(error2) { //if another error was thrown
		var msg = "A severe error occured.\n" + error2 + "\n\nCaused by " + request.url + "\n\n" + text;
		errPrint(msg);
		response.writeHead(500, {"Content-Type": "text/plain"});
		response.end(msg);
	}
} //end serveError()

console.log("Starting now, " + new Date().toString());
console.log("Listening on port "  + port + ".");
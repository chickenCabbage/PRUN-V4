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

var landingPage = "./index.html"; //the page you get when you request "/"

function authLogin() {
	
}

http.createServer(function(request, response) { //on every request to the server:
	var filePath = "." + request.url;
	if(filePath == "./") filePath = landingPage; //there isn't actually a file as the directory.
	//so we need to redirect the filepath to the actual landing page.
	if(request.method == "GET") { //if the request has no hidden data
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

				//disallowed
				case "usr":
				case "unv":
					throw "forbidden";
				break;

				//serve as plaintext
				default:
					response.writeHead(200, {"Content-Type": "text/" + type});
				break;
			} //end switch(type)
			response.end(content); //serve the requseted file
		} //end try
		catch(error) {
			if(error.code == "ENOENT") { //the file wasn't found
				serveError(404, "404, file not found", request, response);
			}
			else if(error == "forbidden") { //trying to get to user files
				serveError(403, "403, access forbidden", request, response);
			}
			else {
				serveError(500, "500: " + error.toString().replace("Error: ", ""), request, response);
			}
		} //end catch
	} //end if(request.method == "GET")
	else if(request.method == "POST") {
		switch(filePath) {
			case "/authLogin": //if trying to log in
				var data = toJson(extractPost(request)); //get the data to a readable format
				var result = authLogin(data); //see if the credentials match

				if(result.includes("Error: ")) { //if there was an error:
					serveError(500, "500: " + result.replace("Error: ", ""), request, response);
				}
				else { //if there wasn't an error:
					response.writeHead(200, {"Content-Type": "text/plain"});
					response.end(result); //give the results
				}
			break;
		}
	}
}).listen(port);
console.log("Starting now, " + new Date().toString());
console.log("Listening on port "  + port + ".");

function extractPost(request) {
	var data = "";
	request.on("data", function(chunk) { //if there's still data in the request that we haven't read
		//check for stuff here ///////////////////////////////////////////////////////////////////////////////
		data += chunk.toString(); //append it to the total data
		//kill the connection if there's too much data
		if (data.toString().length > 1e6) request.connection.destroy();
	});
	request.on("end", function() { //when it's done reading the request
		return data;
	});
} //end extractPost()

function toJson() {

}

function serveError(code, text, request, response) { //internal server error
	try {
		var content = fs.readFileSync("./error.html").toString().replace("ERRBODY", text);
		response.writeHead(code, {"Content-Type": "text/html"});
		response.end(content);
	}
	catch(error2) { //if another error was thrown
		var msg = "A severe error occured.\n" + error2 + "\n\nCaused by " + request.url + "\n\n" + text
		errPrint(msg);
		response.writeHead(500, {"Content-Type": "text/plain"});
		response.end(msg);
	}
} //end serveError()
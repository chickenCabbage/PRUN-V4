var colors = require("colors"); //awsome console

function errPrint(text) {
	console.log("\n--------------------");
	console.log(colors.red("ERROR: ") + text);
	console.log("--------------------\n");
}
function wrnPrint(text) {
	console.log(colors.yellow("WARNING: ") + text);
}

var fs = require("fs");
var forbiddenFiles = ["./prefs.html", "./mysqlConfig.json"];
var landingPage = "./index.html"; //the page you get when you request "/"

var mysql = require('mysql');
var mysqlConfig = JSON.parse(fs.readFileSync("./mysqlConfig.json"));
var con = mysql.createConnection({
	host: mysqlConfig.host,
	user: mysqlConfig.user,
	password: mysqlConfig.password,
	database: mysqlConfig.database
});
con.connect(function(err) {
	if(err) { //if an error was thrown
		errPrint("Could not connect to MySQL!");
		throw err;
	}
});

var http = require("http");
var port = 80;

var crypto = require("crypto"); //password hashing

http.createServer(function(request, response) { //on every request to the server:
	var filePath = "." + request.url;
	if(filePath == "./") filePath = landingPage; //there isn't actually a file as the directory.
	//so we need to redirect the filepath to the actual landing page.

	if(forbiddenFiles.join().includes(filePath)) {
		serveError(403, "403, file forbidden.", request, response);
	}

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
			authLogin(parsePost(data, request, response), response); //do so
		}
		else { //otherwise
			return data; //return normally
		}
	});
} //end extractPost()

function querySQL(cmd) {
	var dataPromise = new Promise(function(resolve, reject) {
		con.query(cmd, function(err, result) {
			resolve(result);
		});
	});
	return dataPromise;
} //end querySQL()

function parsePost(data, request, response) {
	var json = {
		email: data.split("=")[1].split("&")[0],
		pw: hash(data.split("=")[2].split("&")[0])
	}

	if(testEmail(json.email)) {
		if(testPassword(json.pw)) return json;
		else {
			serveText("illegal-password", response);
			return;
		}
	}
	else {
		serveText("illegal-email", response);
		return;
	}
} //end parsePost()

function parseCookies(cookies) {
	cookies = {
		email: cookies.split("=")[1].split(";")[0],
		pw: cookies.split("=")[2]
	}
	return cookies;
} //end parseCookies()

function hash(text) { //encrypt text
	try {
		return crypto.createHash("md5").update(text).digest("hex");
	}
	catch(err) {
		errPrint("in hashing: " + err);
		return null;
	}
} //end hash()

function testEmail(email) {
	if(new RegExp(/^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/).test(email.replace("%40", "@"))) {
		return true;
	}
	else return false;
} //end testEmail()

function testPassword(pw) {
	if(new RegExp(/(?=.*?[a-z])(?=.*?[0-9]).{8,20}/).test(pw)) {
		return true;
	}
	else return false;
} //end testPassword()

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

function authLogin(postJson, response) {
	try {
		var cmd = "SELECT pw, updates FROM users WHERE email = '" + postJson.email + "';";
		querySQL(cmd).then(function(data) { //wait for the promise
			var pw = data[0].pw;
			var ver = data[0].updates;
			
			if(ver == "v") { //if the user wasn't verified yet
				serveText("verify", response);
				return;
			}

			if(pw == postJson.pw) { //success!
				var prefs = fs.readFileSync("./prefs.html"); //serve the prefs page
				if(response) {
					response.writeHead(200, {
						"Set-Cookie": [
							"email=" + postJson.email + "; expires=2628000000;",
							"pw=" + hash(postJson.pw) + "; expires=2628000000; HttpOnly;" //add cookies
						],
						"Content-Type": "text/plain"
					}); //end response.writeHead
					response.end(prefs);
				}
				else {
					return prefs;
				}
			} //end if
			else { //password was wrong
				serveText("password", response);
			}
		}).catch(function(fromReject) { //MySQL could not give an answer
			serveText("user", response);
		});
	}
	catch(err) {
		errPrint("in authLogin: " + err);
		if(response) {
			serveError(500, err, null, response);
		}
		else {
			return "Error: " + err;
		}
	} //end catch
} //end authLogin()

console.log("Starting now, " + new Date().toString());
console.log("Listening on port "  + port + ".");
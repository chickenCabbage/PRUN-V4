var insp = require("node-metainspector");
var client = new insp("http://praguerace.com/", {
	timeout: 9999, //maximal reply time in ms. 9999 ~= 10 seconds
	headers: { //custom headers for the request
		"User-Agent": "prunScraper/update.js" //user agent
	}
}); //crawling config

var intervalTime = 2 * 60 * 1000;

/*var exec = require("child_process").exec; //for mailing jars*/

var fs = require("fs"); //for readng the files
var title = fs.readFileSync("./update.txt").toString().split("	")[1]; //stores the page's title

var colors = require("colors"); //for fancy console
function errPrint(text) {
	console.log("\n--------------------");
	console.log(colors.red("ERROR: ") + text);
	console.log("--------------------\n");
} //end errPrint()
function wrnPrint(text) {
	console.log(colors.yellow("WARNING: ") + text);
}

function now() { //return the current time
	var date = new Date();
	return date.toString();
}

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

function querySQL(cmd) {
	var dataPromise = new Promise(function(resolve, reject) {
		con.query(cmd, function(err, result) {
			resolve(result);
		});
	});
	return dataPromise;
} //end querySQL()

function testEmail(email) {
	if(new RegExp(/^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/).test(email.replace("%40", "@"))) {
		return true;
	}
	else {
		errPrint("Illegal email!");
		return false;
	}
} //end testEmail()

client.on("fetch", function(){ //when client.fetch() is called
	try {
		title = fs.readFileSync("./update.txt").toString().split("	")[1]; //read the current data
		if(client.title != title) { //if the title changed - new page!
			title = client.title;

			var time = client.parsedDocument(".cc-publishtime").html() //the div content
			.split("<br>")[0].split("posted ")[1] + " EST"; //remove excess HTML/data
			time = time.toString().replace("pm", "PM");

			fs.writeFile("./update.txt", time + "	" + client.title + "	" + client.images[0]); //change update.txt
			wrnPrint("UPDATED! on " + time + ": " + client.title); //woo
			console.log("Recoginzed on " + now() + "\n");

			var cmd = "SELECT email FROM users WHERE updates = 'y';";
			querySQL(cmd).then(function(data) { //wait for the promise
				var allEmails = "";
				for(i = 0; i < data.length; i ++) {
					if(!testEmail) allEmails = allEmails + data[i].email.replace("%40", "@") + " ";
				}
				wrnPrint(allEmails);
			}).catch(function(fromReject) { //MySQL could not give an answer
				errPrint("SQL promise rejected! " + fromReject);
			});
		}//end if
	}//end try
	catch(err) {
		errPrint(err);
	}
});

client.on("error", function(err) { //if an error occures
	errPrint(err);
});

console.log("Starting now, " + now() + ".");
if(((intervalTime / 1000) / 60) == 0) {
	console.log("Checking at interval of " + (intervalTime / 1000) + " seconds.\n");
}
else {
	console.log("Checking at interval of " + ((intervalTime / 1000) / 60) + " minutes.\n");
}
client.fetch(); //initialization

setInterval(function() { //do this every [intervalTime] miliseconds
  client.fetch();
}, intervalTime);
var mysql = require('mysql');

var con = mysql.createConnection({
	host: "localhost",
	user: "root",
	password: "please",
	database: "prun"
});

con.connect();

function querySQL(cmd) {
	var dataPromise = new Promise(function(resolve, reject) {
		con.query(cmd, function(err, result) {
			resolve(result);
			con.end();
		});
	});
	return dataPromise;
}

querySQL("select * from users").then(function(fromResolve) {
	return fromResolve;
});
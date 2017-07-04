var mysql = require('mysql');

var con = mysql.createConnection({
	host: "localhost",
	user: "root",
	password: "please",
	database: "prun"
});

function querySQL(cmd) {
	con.connect(function(err) {
		if (err){
			throw err;
		}
		con.query(cmd, function (err, result, fields) {
			if(err) {
				throw err;
			}
			console.log(result[0]);
			con.end();
		});
	});
}

querySQL("SELECT * FROM users where email='alon.shiboleth@gmail.com';");
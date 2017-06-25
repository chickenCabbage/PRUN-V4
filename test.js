var mysql = require('mysql');

var con = mysql.createConnection({
	host: "localhost",
	user: "root",
	password: "please",
	database: "prun"
});

function doStuff(sql) {
	con.connect();
	con.query(sql, function (err, rows, fields) {
		console.log(rows.toString().split("'")[4]);
		return;
	});
}
doStuff("select case when updates = 'yes' then email end from users;");
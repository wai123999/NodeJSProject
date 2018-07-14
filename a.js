var mysql = require('mysql');
var con = mysql.createConnection({
        host: "localhost",
        user: "root",
        password: "qwe986532147",
        database: "wen"
});

con.connect(function(err) {
  console.log("Connected!");
});


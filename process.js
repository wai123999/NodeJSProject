var express = require('express');
var bodyParser = require('body-parser');//parse post message use
var path = require('path');
var http = require('http');
var app = express();
var mysql = require('mysql');

var exec = require('child_process').exec;
app.set('view engine','ejs');  //tell express use ejs template engine


app.use(express.static(__dirname+'/css'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.set('port',4000);

app.listen(app.get('port'),function(){
	console.log('server create,listen on 4000');
});


var con = mysql.createConnection({
	host: "localhost",
	user: "root",
	password: "qwe986532147",
	database: "wen"
});


con.connect(function(err) {
  if (err) throw err;
});

app.post('/form',function(req,res){
		//console.log(req.body);
		var obj = { usrname:req.body.usrname , passwd:req.body.passwd };
		console.log(obj);
		if ( obj.usrname === '' || obj.passwd === ''){
				res.render('login',{msg:'Login Fail'});
		}
		else{
			var query = 'SELECT * FROM contact WHERE usrname="' + obj.usrname + '"' + 'AND password=SHA("' + obj.passwd +'")';
		//var query = "SELECT * FROM contact ";
			con.query(query,function(err,result,fields){
					if ( err ) throw err;
					var usrdata = JSON.parse(JSON.stringify(result));
					console.log(usrdata);
					//console.log(usrdata);
					if ( usrdata.length == 0){
							//usrdata = [];
							res.render('login',{msg:'Login Fail'});
						}
						else{
							res.render('home',{msg:usrdata});
						}
					});
			}
});


app.post('/register',function(req,res){
   var obj = { usrname:req.body.usrname, passwd:req.body.passwd};
	 console.log(obj);
});
app.get('/',function(req,res){
	res.render('login',{msg:''});
});

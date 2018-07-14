var express = require('express');
var bodyParser = require('body-parser');//parse post message use
var path = require('path');
var http = require('http');
var https = require('https'),fs = require('fs');
var app = express();
var mysql = require('mysql');
var nodemailer = require('nodemailer');
var async = require('async'); //use for waterfall

var ccap = require('ccap');//Instantiated ccap class

var transporter = nodemailer.createTransport({
	service: 'gmail',
	auth:{
			user:'vonghouwai@gmail.com',
			pass:'vtgnnmduqcfrwxxg'
	}
});
/*
var options = {
	key:fs.readFileSync('./privatekey.pem'),
	cert:fs.readFileSync('./certificate.pem')
};
var httpsServer = https.createServer(options,app);
httpsServer.listen(4001,function(){
		console.log('https server create,listen on 4001');
});

*/

//var exec = require('child_process').exec;
app.set('view engine','ejs');  //tell express use ejs template engine


app.use(express.static(__dirname+'/css'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
//app.set('port',4000);

var httpServer = http.createServer(app);
httpServer.listen(4000,function(req,res){
		console.log('server create,listen on 4000');
});

//app.listen(app.get('port'),function(){
	//console.log('server create,listen on 4000');
//});


var con = mysql.createConnection({
	host: "localhost",
	user: "root",
	password: "aa568893",
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
		/*
		else{
			var query = 'SELECT * FROM contact WHERE usrname="' + obj.usrname + '"' + 'AND password=SHA("' + obj.passwd +'")';
		//var query = "SELECT * FROM contact ";
			con.query(query,function(err,result,fields){
					if ( err ) throw err;
					var usrdata = JSON.parse(JSON.stringify(result));
					console.log(usrdata);
					console.log(usrdata[0].isvalid);
					//console.log(usrdata);
					if ( usrdata.length == 0){
							//usrdata = [];
							res.render('login',{msg:'Login Fail'});
						}
						else{
							//login success
							res.render('home',{msg:usrdata});
						}
					});
			}
			*/
			async.waterfall([
				function (callback,err){
					  //query the result
						try{
							var query = 'SELECT * FROM contact WHERE usrname="' + obj.usrname + '"' + 'AND password=SHA("' + obj.passwd +'")';
							con.query(query,function(err,result,fields){
							 	if (err) throw err;
								var usrdata = JSON.parse(JSON.stringify(result));
								callback(err,usrdata);
							});
						}catch(e){
							callback(err,"function 1 error ");
						}
				},
				function (arg1,callback,err){
						var usrdata = arg1;
						if ( usrdata.length == 0){
								//usrdata = [];
								res.render('login',{msg:'Login Fail'});
							}
						else{
							//login success
							callback(err,usrdata);
							//res.render('home',{msg:usrdata});
						}
				},
				function (arg1,callback,err){
					var usrdata = arg1;
					console.log(usrdata[0].id);
					var query =　'SELECT usrname FROM contact WHERE id IN (SELECT fdid FROM CC WHERE myid =' + usrdata[0].id +')';
					try {
							con.query(query,function(err,result,fields){
									if (err) throw err;
									var usrdata = JSON.parse(JSON.stringify(result));
									console.log(usrdata);
									res.render('home',{msg:usrdata});
							})
					//login success... this function is go to database to take his firend data
					} catch(e){
					 		callback(err,'function 3 error');
					}
				}
			],
			function(err,result){
				console.log("errrrror");
			}
		);
});

app.post('/register',function(req,res){
	/*receive the register request
	  then send a mail to him,
		active the link*/
   var obj = { usrname:req.body.usrname, passwd:req.body.passwd,email:req.body.email};
	 const mailOptions = {
	   //from: 'vonghouwai@gmail.com', // sender address
		 from : 'green bird tutorial',
	   to: obj.email, // list of receivers
	   subject: 'VONG WAI', // Subject line
	   html: '<p>Please active your account by this link '
		 +  'http://localhost:4000/vertify/' + obj.usrname +'</p>'// plain text body
	 };
	 var query = 'INSERT INTO contact (usrname,password,email,isvalid)' +
	             ' VALUES(' +
							 '"' + obj.usrname + '"' + ',' +
							 'SHA(' + '"' + obj.passwd + '")' +  ',' +
							 '"' + obj.email  + '"' +  ',' +
							 0 + ')';

	 con.query(query,function(err,result,fields){
				 	if ( err ) throw err;
	 });
	 transporter.sendMail(mailOptions, function (err, info) {
	    if(err)
	      console.log(err)
	    else
	      console.log(info);
	 });

	 console.log(obj);
});

/*
var captcha = ccap();
*/
app.get('/',function(req,res){
	 res.render('login',{msg:''});
});
app.get('/vertify/:name',function(req,res){
	console.log(req.params.name);
	console.log(req.params);
	var query =  'SELECT DATEDIFF(CURTIME(),register_date) AS diff_date FROM contact WHERE usrname=' + '"wai123999"';
	con.query(query,function(err,result,fields){
			if ( err ) throw err;
			var usrdata = JSON.parse(JSON.stringify(result));
			if (usrdata[0].diffdate >= 1){
				 //your active is expire , please reregiter again!
			}
			else{
				//no expire
				query = 'SELECT isvalid FROM contact WHERE usrname="' + req.params.name +'"';
			//var query = "SELECT * FROM contact ";
				con.query(query,function(err,result,fields){
						if ( err ) throw err;
						var usrdata = JSON.parse(JSON.stringify(result));
						if ( usrdata[0].isvalid == 1){
								//redirect to a page
						}
						else if ( usrdata[0].isvalid == 0){
							 query = 'UPDATE contact SET isvalid = 1 WHERE usrname="' + req.params.name + '"';
							 con.query(query,function(err,result,fields){
									if ( err ) throw err;});
						}
				});
			}
	});

});

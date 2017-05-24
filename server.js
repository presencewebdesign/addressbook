//File to load express
var express = require('express');
var cors = require('cors')
var bodyParser = require("body-parser");
var fs = require('fs');

var app = express();

app.use(cors());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.get("/getJsonData",function (request, response) {
	console.log("\n\nSending data");
	response.sendFile(__dirname+ '/data.json');
});
app.post("/changeContacts",function(req,res){		
	var hero = req.body; 
	heros = hero;
	console.log(req.body);

	res.send("recieved");
});	
app.post("/saveList",function(req,res){
	console.log("\n\nRecieving data");
	console.log(req.body);	
	var wstream = fs.createWriteStream('data.json');
// OR add the encoding to each write
wstream.write(JSON.stringify(req.body));
wstream.end();

	//res.end("yes");
});

const PORT = process.env.PORT || 3000;

app.use(function (req, res, next){
	if(req.header['x-forwarded-proto'] === 'https'){
		res.redirect('https://' + req.hostname + req.url);
	}else{
		next();
	}
});

app.use(express.static('./'));

app.listen(PORT, function() {
    console.log('Express server is up on port '+ PORT);
});


console.log("Server is running");
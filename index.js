const express = require("express");
const bodyParser = require("body-parser");

var app = express();
var port = process.env.PORT || 80;
app.use(bodyParser.json()); //Par cuando llegan datos transformarlos automรกticamente
app.use("/",express.static("./public"));

var contacts = [
	{	name : "peter",
		phone:  123456	},
	{
		name: "pablo",
		phone: 7896
	},
];

const BASE_API_URL = "/api/v1";

app.get(BASE_API_URL+"/contacts",(req,res)  =>{
		res.send(JSON.stringify(contacts,null,2));
});
app.post(BASE_API_URL+"/contacts",(req,res) =>{
		contacts.push(req.body);
		res.sendStatus(201,"CREATED");

});

app.get("/cool",(request,response) => {
	response.send("<html>"+cool()+"</html>");
});
//API Alejandro
var offworks = [
	{	community : "Andalucia",
		year:  2007,
		accident: 6878,
		sick: 29.1,
		numberzone: 804},
	{
		community : "Aragon",
		year:  2007,
		accident: 5251,
		sick: 323.4,
		numberzone: 1750
	},
];

// GET OFFWORKS

app.get(BASE_API_URL+"/offworks", (req,res) =>{
	res.send(JSON.stringify(offworks,null,2));
	console.log("Data sent:"+JSON.stringify(offworks,null,2));
});


// POST OFFWORKS

app.post(BASE_API_URL+"/offworks",(req,res) =>{
	
	var newOffworks = req.body;
	
	if((newOffworks == "") || (newOffworks.community == null)){
		res.sendStatus(400,"BAD REQUEST");
	} else {
		contacts.push(newOffworks); 	
		res.sendStatus(201,"CREATED");
	}
});

// DELETE OFFWORKS

// GET OFFWORKS/XXX

app.get(BASE_API_URL+"/offworks/community", (req,res)=>{
	
	var community = req.params.community;
	
	var filteredOffworks = offworks.filter((c) => {
		return (c.community == community);
	});
	
	
	if(filteredOffworks.length >= 1){
		res.send(filteredOffworks[0]);
	}else{
		res.sendStatus(404,"CONTACT NOT FOUND");
	}
});

// PUT OFFWORKS/XXX

// DELETE OFFWORKS/XXX

app.delete(BASE_API_URL+"/contacts/community", (req,res)=>{
	
	var community = req.params.community;
	
	var filteredOffworks = offworks.filter((c) => {
		return (c.community != community);
	});
	
	
	if(filteredOffworks.length < offworks.length){
		offworks = filteredOffworks;
		res.sendStatus(200);
	}else{
		res.sendStatus(404,"CONTACT NOT FOUND");
	}
	
	
});
//API Joserra

//API Antonio

app.listen(port, () =>{
	console.log("server ready");
});

console.log("Starting server...");
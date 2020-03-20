const cool = require("cool-ascii-faces");
const express = require("express");
const bodyParser = require("body-parser");

var app = express();
var port = process.env.PORT || 80;
app.use(bodyParser.json()); //Par cuando llegan datos transformarlos automáticamente
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

app.listen(port, () =>{
	console.log("server ready");
});

console.log("Starting server...");
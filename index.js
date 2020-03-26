
const express = require("express");
const bodyParser = require("body-parser");

var app = express();
var port = process.env.PORT || 80;
app.use(bodyParser.json());
app.use("/",express.static("./public"));

//API JOSERRA
var cigarretes = [
	{
		community: "andalucia",
		year: 2007,
		cigarrete_sale: 812,
		first_variation: -41.7,
		second_variation: -49.6
		
	},
	{
		community: "aragon",
		year: 2007,
		cigarrete_sale: 132,
		first_variation: -32.1,
		second_variation: -38.5
		
	}
	
	
];

//GET LOADINITIALDATA
const BASE_API_URL = "/api/v2/joserra";


app.get(BASE_API_URL+"/cigarretes-sales/loadInitialData",(req,res)  =>{
	 cigarretes = [
	{
		community: "andalucia",
		year: 2007,
		cigarrete_sale: 812,
		first_variation: -41.7,
		second_variation: -49.6
		
	},
	{
		community: "aragon",
		year: 2007,
		cigarrete_sale: 132,
		first_variation: -32.1,
		second_variation: -38.5
		
	}
	
	
];
	if(cigarretes.length >= 1){
		res.status(200).send("There is already created");
	}else{
		cigarretes = initial_sales;
		res.send(JSON.stringify(cigarretes,null,2));
	}


});
//GET CIGARRETES

app.get(BASE_API_URL+"/cigarretes-sales",(req,res)  =>{
	
		res.send(JSON.stringify(cigarretes,null,2));
	console.log("Data send:"+JSON.stringify(cigarretes,null,2));
});

// POST CIGARRETES
app.post(BASE_API_URL+"/cigarretes-sales",(req,res) =>{
	var newCigarrete = req.body;
		if((newCigarrete == "") || newCigarrete.community == null){
		res.sendStatus(400,"BAD REQUEST");
	
}else{
		cigarretes.push(newCigarrete);
		res.sendStatus(201,"CREATED");
}

});

//DELETE CIGARRETES
app.delete(BASE_API_URL+"/cigarretes-sales",(req,res) =>{	
	cigarretes = [];
	res.sendStatus(200, "OK");
});

//GET CIGARRETES/XXX

app.get(BASE_API_URL+"/cigarretes-sales/:community",(req,res)=>{
	var community = req.params.community;
	var filteredCigarretes = cigarretes.filter((c) => {
		return (c.community == community);
	});
	
	if (filteredCigarretes.length >=1){
		res.send(filteredCigarretes[0]);
	}else{
		res.sendStatus(404,"Contact Not Found");
	}
										  
});
//PUT CIGARRETES
app.put(BASE_API_URL+"/cigarretes-sales", (req,res)=>{
    res.status(405).send("NOT ALLOWED");
	});
	
//PUT CIGARRETES/XXX
app.put(BASE_API_URL +"/cigarretes-sales/:community",(req,res)=>{
    var community=req.params.community;
    var body = req.body;
	var filteredCigarretes = cigarretes.filter(c => {
		return c.community == community;
	});

	if (filteredCigarretes.length == 1) {
		var updateData = cigarretes.map(f => {
			var upData = f;
			if (f.community == community) {
				for (var p in body) {
					upData[p] = body[p];
				}
			}
			return updateData;
		});

		cigarretes.push = updateData;
		res.sendStatus(200);
	} else {
		res.sendStatus(404); 
	}
   
});	

//DELETE CIGARRETES/XXX
app.delete(BASE_API_URL+"/cigarretes-sales/:community",(req,res)=>{
	var community = req.params.community;

	var filteredCigarretes = cigarretes.filter((c) => {
		return (c.community != community);
	});
	
	if (filteredCigarretes.length < cigarretes.length){
		cigarretes = filteredCigarretes;
		res.sendStatus(200);
	
	}else{
		res.sendStatus(404,"Community Not Found");
	}
										  
	
});

//POST CIGARRETES/XXX
app.post(BASE_API_URL + "/cigarretes-sales/:community", (req,res)=>{
    res.status(405).send("NOT ALLOWED");
});




app.get("/cool",(request,response) => {
	response.send("<html>"+cool()+"</html>");
});

app.listen(port, () =>{
	console.log("server ready");
});

console.log("Starting server...");
	
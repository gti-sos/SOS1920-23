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
var offworks_stats=[];
// GET LOADINITIALDATA
app.get(BASE_API_URL+"/offworks-stats/loadInitialData", (req,res) => {
    
    
    offworks_stats = [
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
    
    if(offworks_stats.length >=1){
        res.status(400).send("There is already created");
    }else{
        //offworks_stats = offworks_stats;
        res.send(JSON.stringify(offworks_stats, null, 2));
    }
});


// GET OFFWORKS
app.get(BASE_API_URL + "/offworks-stats", (req,res) =>{
	if(offworks_stats.length == 0){
		res.status(400).send("There is no data stored");
	}else{
		res.send(JSON.stringify(offworks_stats,null,2));
	}

// POST OFFWORKS
app.post(BASE_API_URL + "/offworks-stats",(req,res) =>{
    
	//Objeto a crear
    var newOffworks = req.body;
	
	//Array de las keys del objeto que se quiere crear. Ex: ["community","year","accident","sick","numberzone"]
	var keysOffwork = Object.keys(newOffworks);
	
	//Array de las keys que debe tener el objeto.
	var keysObject = ["community","year","accident","sick","numberzone"];
	
	//True: Las claves son correctas || False:Las claves son incorrectas
	var keysTrue = false;
	
	//Comprobamos que las keys son correctas
	if(JSON.stringify(keysOffwork)==JSON.stringify(keysObject)){
		keysTrue = true;
	}
	
	//filteredSales almacenara si hay algun dato ya con la provincia y el año que queremos añadir
    var filteredSales = offworks_stats.filter((c)=>{
        return (c.community == newOffworks.community && c.year == newOffworks.year);
    });
	
    if(keysOffwork.length==0){ // Si el body está vacio
        res.status(400).send("NOT CREATED"); 
    }else if(keysTrue==false){ // Si los campos no son correctos
		res.status(400).send("THIS FIELD DONT EXIST");
	}else if(newOffworks.community==null || newOffworks.year==null || newOffworks.accident==null ||
			newOffworks.sick==null || newOffworks.numberzone==null){ // Algun valor null
		res.status(400).send("DONT BE NULL");
	}else if(filteredSales.length>=1){ // Ya existe un dato para esa provincia y ese año
        res.status(400).send("THE OFFWORK ALREADY EXIST");
    }
    else { // Crea el dato
        offworks_stats.push(newOffworks);     
        res.status(201).send("CREATED OFFWORK");
    }
});
// PUT OFFWORK
app.put(BASE_API_URL+"/offworks-stats", (req,res)=>{
    res.status(405).send("NOT ALLOWED");
});
// DELETE OFFWORKS

// GET OFFWORKS/XXX

app.get(BASE_API_URL+"/offworks-stats/:community/:year", (req,res)=>{
	
	var community = req.params.community;
	var year = req.params.year;
	
	var filteredOffworks = offworks_stats.filter((c) => {
		return (c.community == community && c.year == year);
	});
	
	
	if(filteredOffworks.length >= 1){
		res.send(filteredOffworks[0]);
	}else{
		res.sendStatus(404,"OFFWORK NOT FOUND");
	}
});

// PUT OFFWORKS/XXX
app.put(BASE_API_URL +"/offworks-stats/:community/:year",(req,res)=>{
    var community=req.params.community;
    var year=req.params.year;
    
    var data=req.body;
    
    if(community!=data.community||year!=data.year){
        res.status(400).send("NOT MATCH");
    }else{
        var filteredOffworks = sales.filter((c) => {
        return (c.province != province || c.year != year);
        });      
        //filteredOffworks = filteredOffworks;
        filteredOffworks.push(data);
        res.status(200).send("UPDATED");
    }
});
app.put(BASE_API_URL + "/offworks-stats/:community", (req,res)=>{
	res.status(400).send("INVALID URL");
});
	
//POST OFFWORKS/XXX
app.post(BASE_API_URL + "/offworks-stats/:community", (req,res)=>{
    res.status(405).send("NOT ALLOWED");
});
app.post(BASE_API_URL + "/offworks-stats/:community/:year", (req,res)=>{
    res.status(405).send("NOT ALLOWED");
});
app.post(BASE_API_URL + "/offworks-stats/:community/:year/:accident", (req,res)=>{
    res.status(405).send("NOT ALLOWED");
});
app.post(BASE_API_URL + "/offworks-stats/:community/:year/:accident/:sick", (req,res)=>{
    res.status(405).send("NOT ALLOWED");
});
app.post(BASE_API_URL + "/offworks-stats/:community/:year/:accident/:sick/:numberzone", (req,res)=>{
    res.status(405).send("NOT ALLOWED");
});
// DELETE OFFWORKS/XXX

app.delete(BASE_API_URL+"/offworks-stats/community", (req,res)=>{
	
	var community = req.params.community;
	
	var filteredOffworks = offworks_stats.filter((c) => {
		return (c.community != community);
	});
	
	
	if(filteredOffworks.length < offworks_stats.length){
		offworks_stats = filteredOffworks;
		res.sendStatus(200);
	}else{
		res.sendStatus(404,"CONTACT NOT FOUND");
	}	
});
// DELETE OFFWORKS/XXX/--
app.delete(BASE_API_URL+"/offworks-stats/:community/:year", (req,res)=>{
    
    var community = req.params.community;
    var year = req.params.year;
    
    var filteredOffworks = offworks_stats.filter((c) => {
        return (c.community != community || c.year != year);
    });
    
    if(filteredOffworks.length < offworks_stats.length){
        //filteredOffworks = filteredOffworks;
        res.status(200).send("DELETED OFFWORK");
    }else{
        res.status(404).send("NOT FOUND");
    }
});
//GET OFFWORK COMMUNITY or YEAR
app.get(BASE_API_URL + "/offworks-stats/:param", (req,res)=>{
	var param = req.params.param;
	
	var filteredOffworks = offworks_stats.filter((c)=>{
		return (c.community==param || c.year == param);
	});
	
	if(filteredOffworks.length >= 1){
		res.send(JSON.stringify(filteredOffworks,null,2));
	}else{
		res.status(404).send("NO DATA IN THIS COMMUNITY OR YEAR");
	}	
});
//API Joserra

//API Antonio

app.listen(port, () =>{
	console.log("server ready");
});

console.log("Starting server...");
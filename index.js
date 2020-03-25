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


//API Alejandro
// GET LOADINITIALDATA
app.get(BASE_API_URL+"/offworks/loadInitialData", (req,res) => {
    
    
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
    
    if(offworks.length >=1){
        res.status(400).send("There is already created");
    }else{
        offworks = initial_sales;
        res.send(JSON.stringify(offworks, null, 2));
    }
});


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
//GET LOADINITIALDATA
app.get(BASE_API_URL+"/fires-stats/loadInitialData", (req,res) => {
	
	var fires = [
	{
		community:"andalucia",
		year:2007,
		total_fire:819,
		forest_area:6296.75,
		non_forest_area:3282.53},
	{
		community:"aragon",
		year:2007,
		total_fire:415,
		forest_area:1860.38,
		non_forest_area:611.51
	}
		
];
	    if(fires.length >=1){
        res.status(400).send("There is already created");
    }
		else{
        //fires = initial_sales;
        res.send(JSON.stringify(fires, null, 2));
    }

//GET fires-stats
app.get(BASE_API_URL+"/fires-stats",(req,res)  =>{
		res.send(JSON.stringify(fires, null, 2));
		console.log("Data sent:"+JSON.stringify(fires, null, 2));
});


//POST fires-stats

app.post(BASE_API_URL+"/fires-stats",(req,res) => {
	
	var newFire = req.body;
	
	if((newFire == "") || (newFire.community == null)){
		res.sendStatus(400,"BAD REQUEST");
	} else {
		fires.push(newFire); 	
		res.sendStatus(201,"CREATED");
	}
});
	
//GET fires-stats/XXXX
app.get(BASE_API_URL+"/fires-stats/:community", (req, res) =>{
	
	var community = req.params.community;
	
	var filteredfires = fires.filter((f) => { //Filter va iterando y devolviendo todos los elementos del array, y comprueba que cumplen una determinada condicion
		return (f.community == community);
	
});
	if(filteredfires.length >= 1){
		res.send(filteredfires[0]); //Devuelve el primer elemento del array
	}
	else{
		res.sendStatus(404, "FIRE NOT FOUND");
	}
									 
});
	
//DELETE fires-stats/XXXX
app.delete(BASE_API_URL+"/fires-stats/:community", (req, res) => {
	var community = req.params.community;
	
	var filteredfires = fires.filter((f) => { //Filter va iterando y devolviendo todos los elementos del array, y comprueba que los nombres de las comunidades son distintos
		return (f.community != community);

});
	if(filteredfires.length < fires.length){
		fires = filteredfires;
		res.sendStatus(200);
		
	}
	else{
		res.sendStatus(404, "FIRE NOT FOUND");
	}
});

	
//PUT fires-stats/XXXX

app.put(BASE_API_URL+"/fires-stats/:community", (req, res) =>{
	
	const community = req.params.community; //Guardo el identificador para el recurso que queremos modificar
    const { year, total_fire, forest_area, non_forest_area } = req.body;
    if (community && year && total_fire && forest_area && non_forest_area) {
        for(const community in fires) { //Recorro el arreglo de incendios y obtengo un solo incendio y una comunidad
            if (fires.community == community) { //Si la comunidad que estoy recorriendo es igual a la que le paso por parámetro
				//Modifica los siguientes datos
                fires.year == year;
                fires.total_fire == total_fire;
                fires.forest_area == forest_area;
                fires.non_forest_area == non_forest_area;
            }
        };
        res.json(fires);
    } else {
		res.sendStatus(404, "Resource not found")
    }


});
	
//POST FIRES/XXXX (Esto debe de dar un error de método no permitido)
 app.post(BASE_API_URL+"/fires-stats/:community",(req,res) =>{
    	res.sendStatus(405,"Method Not Allowed");
    });

//PUT FIRES (Esto debe de dar un error de método no permitido)

app.put(BASE_API_URL+"/fires-stats", (req, res)=>{
		res.sendStatus(405,"Method Not Allowed");
	});
	
//DELETE FIRES

app.delete(BASE_API_URL+"/fires-stats", (req, res) =>{
		   fires = [];	//Creo un array vacio
		   res.sendStatus(200, "OK"); //Envio el codigo de respuesta 200 si se ha hecho correctamente el borrado del array.
	});

});

//----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
app.listen(port, () =>{
	console.log("server ready");
});

console.log("Starting server...");
	
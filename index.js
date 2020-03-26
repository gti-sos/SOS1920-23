const express = require('express');
const bodyParser = require('body-parser');

var app = express();
var port = process.env.PORT || 80;
app.use(bodyParser.json()); //Par cuando llegan datos transformarlos automรกticamente
app.use('/', express.static('./public'));

var contacts = [
	{
		name: 'peter',
		phone: 123456
	},
	{
		name: 'pablo',
		phone: 7896
	}
];

const BASE_API_URL = '/api/v1';

app.get(BASE_API_URL + '/contacts', (req, res) => {
	res.send(JSON.stringify(contacts, null, 2));
});
app.post(BASE_API_URL + '/contacts', (req, res) => {
	contacts.push(req.body);
	res.sendStatus(201, 'CREATED');
});

app.get('/cool', (request, response) => {
	response.send('<html>' + cool() + '</html>');
});
//API Alejandro
var offworks_stats = [
	{
		community: 'Andalucia',
		year: 2007,
		accident: 6878,
		sick: 29.1,
		numberzone: 804
	},
	{
		community: 'Aragon',
		year: 2007,
		accident: 5251,
		sick: 323.4,
		numberzone: 1750
	}
];
// GET LOADINITIALDATA
app.get(BASE_API_URL + '/offworks-stats/loadInitialData', (req, res) => {
	offworks_stats = [
		{
			community: 'Andalucia',
			year: 2007,
			accident: 6878,
			sick: 29.1,
			numberzone: 804
		},
		{
			community: 'Aragon',
			year: 2007,
			accident: 5251,
			sick: 323.4,
			numberzone: 1750
		}
	];

	if (offworks_stats.length >= 1) {
		res.status(200).send('There is already created');
	} else {
		res.send(JSON.stringify(offworks_stats, null, 2));
	}
});

// GET OFFWORKS
app.get(BASE_API_URL + '/offworks-stats', (req, res) => {
	if (offworks_stats.length == 0) {
		res.status(400).send('There is no data stored');
	} else {
		res.send(JSON.stringify(offworks_stats, null, 2));
	}
});
// POST OFFWORKS
app.post(BASE_API_URL + '/offworks-stats', (req, res) => {
	var data = req.body;

	if (data == '' || data.community == null) {
		res.sendStatus(400);
	} else {
		offworks_stats.push(data);
		res.sendStatus(201);
	}
});
// PUT OFFWORK
app.put(BASE_API_URL + '/offworks-stats', (req, res) => {
	res.status(405).send('NOT ALLOWED');
});
// DELETE OFFWORKS
app.delete(BASE_API_URL + '/offworks-stats', (req, res) => {
	offworks_stats = [];
	res.sendStatus(200, 'OK');
});
// GET OFFWORKS/XXX/--
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
app.put(BASE_API_URL + '/offworks-stats/:community/:year', (req, res) => {
	var community=req.params.community;
    var year=req.params.year;
    
    var data=req.body;
    
    var filteredOffworks = offworks_stats.filter((c)=>{
                return (c.community == community && c.year == year);
            })
            
            if(filteredOffworks.length == 0){
                res.sendStatus(404,"NOT FOUND");
            }else{
                   var filteredOffworks2 = offworks_stats.filter(c => {
					return c.community != community|| c.year != year;
					});
                    
                    if((data == "") || (data.community == null) || (data.year == null)){
                		res.sendStatus(400,"BAD REQUEST");
                	} else {
						offworks_stats = filteredOffworks2;
                		filteredOffworks2.push(data); 	
                		res.sendStatus(200,"OK");
                	}
            }
});

//POST OFFWORKS/XXX
app.post(BASE_API_URL + '/offworks-stats/:community', (req, res) => {
	res.status(405).send('NOT ALLOWED');
});
app.post(BASE_API_URL + '/offworks-stats/:community/:year', (req,res)=>{
    res.status(405).send("NOT ALLOWED");
});
// DELETE OFFWORKS/XXX

app.delete(BASE_API_URL + '/offworks-stats/:community', (req, res) => {
	var community = req.params.community;

	var filteredOffworks = offworks_stats.filter(c => {
		return c.community != community;
	});

	if (filteredOffworks.length < offworks_stats.length) {
		offworks_stats = filteredOffworks;
		res.status(200).send('DELETED OFFWORK');
	} else {
		res.sendStatus(404, 'OFFWORK NOT FOUND');
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
        offworks_stats = filteredOffworks;
        res.status(200).send("DELETED OFFWORK");
    }else{
        res.status(404).send("NOT FOUND");
    }
});
//GET OFFWORK COMMUNITY or YEAR
app.get(BASE_API_URL + '/offworks-stats/:param', (req, res) => {
	var param = req.params.param;

	var filteredOffworks = offworks_stats.filter(c => {
		return c.community == param || c.year == param;
	});

	if (filteredOffworks.length >= 1) {
		res.send(JSON.stringify(filteredOffworks, null, 2));
	} else {
		res.status(404).send('NO DATA IN THIS COMMUNITY OR YEAR');
	}
});
//API Joserra

//API Antonio

var fires = [
	{
		community: 'andalucia',
		year: 2007,
		total_fire: 819,
		forest_area: 6296.75,
		non_forest_area: 3282.53
	},
	{
		community: 'aragon',
		year: 2007,
		total_fire: 415,
		forest_area: 1860.38,
		non_forest_area: 611.51
	}
];
//GET LOADINITIALDATA
app.get(BASE_API_URL + '/fires-stats/loadInitialData', (req, res) => {
	fires = [
		{
			community: 'andalucia',
			year: 2007,
			total_fire: 819,
			forest_area: 6296.75,
			non_forest_area: 3282.53
		},
		{
			community: 'aragon',
			year: 2007,
			total_fire: 415,
			forest_area: 1860.38,
			non_forest_area: 611.51
		}
	];
	if (fires.length >= 1) {
		res.status(200).send('THERE IS ALREADY CREATED');
	} else {
		res.send(JSON.stringify(fires, null, 2));
	}
});

//GET fires-stats
app.get(BASE_API_URL + '/fires-stats', (req, res) => {
	if (fires.length == 0) {
		res.status(400).send('THERE IS NO DATA');
	} else {
		res.send(JSON.stringify(fires, null, 2));
	}
});

//POST fires-stats

app.post(BASE_API_URL + '/fires-stats', (req, res) => {
	var newFire = req.body;

	if (newFire == '' || newFire.community == null) {
		res.sendStatus(400); //Codigo 400(BAD REQUEST)
	} else {
		fires.push(newFire);
		res.sendStatus(201); //Codigo 201(CREATED)
	}
});

//GET fires-stats/XXXX
app.get(BASE_API_URL + '/fires-stats/:community', (req, res) => {
	var community = req.params.community;

	var filteredfires = fires.filter(f => {
		//Filter va iterando y devolviendo todos los elementos del array, y comprueba que cumplen una determinada condicion
		return f.community == community;
	});
	if (filteredfires.length >= 1) {
		res.send(filteredfires[0]); //Devuelve el primer elemento del array
	} else {
		res.sendStatus(404); //FIRE-DATA NOT FOUND
	}
});

//DELETE fires-stats/XXXX
app.delete(BASE_API_URL + '/fires-stats/:community', (req, res) => {
	var community = req.params.community;

	var filteredfires = fires.filter(f => {
		//Filter va iterando y devolviendo todos los elementos del array, y comprueba que los nombres de las comunidades son distintos
		return f.community != community;
	});
	if (filteredfires.length < fires.length) {
		fires = filteredfires;
		res.sendStatus(200); //Codigo 200(OK), recurso eliminado correctamente
	} else {
		res.sendStatus(404); //FIRE DATA NOT FOUND
	}
});

//PUT fires-stats/XXXX

app.put(BASE_API_URL + '/fires-stats/:community', (req, res) => {
	var community = req.params.community;
	var body = req.body;
	var filteredfires = fires.filter(c => {
		return c.community == community;
	});

	if (filteredfires.length == 1) {
		var updateData = fires.map(f => {
			var upData = f;
			if (f.community == community) {
				for (var p in body) {
					upData[p] = body[p];
				}
			}
			return updateData;
		});

		fires.push = updateData;
		res.sendStatus(200); //Recurso encontrado y modificado
	} else {
		res.sendStatus(404); //Recurso no encontrado
	}
});

//POST FIRES/XXXX (Esto debe de dar un error de método no permitido)
app.post(BASE_API_URL + '/fires-stats/:community', (req, res) => {
	res.sendStatus(405); //Method not allowed
});

//PUT FIRES (Esto debe de dar un error de método no permitido)

app.put(BASE_API_URL + '/fires-stats', (req, res) => {
	res.sendStatus(405); //Method Not Allowed
});

//DELETE FIRES

app.delete(BASE_API_URL + '/fires-stats', (req, res) => {
	fires = []; //Creo un array vacio
	res.sendStatus(200); //Envio el codigo de respuesta 200(OK) si se ha hecho correctamente el borrado del array.
});

//----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
app.listen(port, () => {
	console.log('server ready');
});

console.log('Starting server...');
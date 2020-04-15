const express = require('express');
const bodyParser = require('body-parser');
const path = require("path");
var app = express();
var port = process.env.PORT || 80;

app.use(bodyParser.json()); //Par cuando llegan datos transformarlos automรกticamente
app.use('/', express.static('./public'));


const BASE_API_URL = '/api/v1';


//API Alejandro
const offworks_stats_API = require(path.join(__dirname,"offworks_stats_API"));
offworks_stats_API(app);


//-------------------------------------------------------------------------------------------------------------------------------------------------------------------------------


//API JOSERRA
var cigarretes = [
	{
		community: 'andalucia',
		year: 2007,
		cigarrete_sale: 812,
		first_variation: -41.7,
		second_variation: -49.6
	},
	{
		community: 'aragon',
		year: 2007,
		cigarrete_sale: 132,
		first_variation: -32.1,
		second_variation: -38.5
	}
];

//GET LOADINITIALDATA

app.get(BASE_API_URL + '/cigarretes-sales/loadInitialData', (req, res) => {
	cigarretes = [
		{
			community: 'andalucia',
			year: 2007,
			cigarrete_sale: 812,
			first_variation: -41.7,
			second_variation: -49.6
		},
		{
			community: 'aragon',
			year: 2007,
			cigarrete_sale: 132,
			first_variation: -32.1,
			second_variation: -38.5
		}
	];
	if (cigarretes.length >= 1) {
		res.status(200).send('There is already created');
	} else {
		cigarretes = initial_sales;
		res.send(JSON.stringify(cigarretes, null, 2));
	}
});
//GET CIGARRETES

app.get(BASE_API_URL + '/cigarretes-sales', (req, res) => {
	res.send(JSON.stringify(cigarretes, null, 2));
	console.log('Data send:' + JSON.stringify(cigarretes, null, 2));
});

// POST CIGARRETES
app.post(BASE_API_URL + '/cigarretes-sales', (req, res) => {
	var newCigarrete = req.body;
	if (newCigarrete == '' || newCigarrete.community == null) {
		res.sendStatus(400, 'BAD REQUEST');
	} else {
		cigarretes.push(newCigarrete);
		res.sendStatus(201, 'CREATED');
	}
});

//DELETE CIGARRETES
app.delete(BASE_API_URL + '/cigarretes-sales', (req, res) => {
	cigarretes = [];
	res.sendStatus(200, 'OK');
});

//GET CIGARRETES/XXX

app.get(BASE_API_URL + '/cigarretes-sales/:community', (req, res) => {
	var community = req.params.community;
	var filteredCigarretes = cigarretes.filter(c => {
		return c.community == community;
	});

	if (filteredCigarretes.length >= 1) {
		res.send(filteredCigarretes[0]);
	} else {
		res.sendStatus(404, 'Contact Not Found');
	}
});
//PUT CIGARRETES
app.put(BASE_API_URL + '/cigarretes-sales', (req, res) => {
	res.status(405).send('NOT ALLOWED');
});

//PUT CIGARRETES/XXX
app.put(BASE_API_URL + '/cigarretes-sales/:community', (req, res) => {
	var community = req.params.community;
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
app.delete(BASE_API_URL + '/cigarretes-sales/:community', (req, res) => {
	var community = req.params.community;

	var filteredCigarretes = cigarretes.filter(c => {
		return c.community != community;
	});

	if (filteredCigarretes.length < cigarretes.length) {
		cigarretes = filteredCigarretes;
		res.sendStatus(200);
	} else {
		res.sendStatus(404, 'Community Not Found');
	}
});

//POST CIGARRETES/XXX
app.post(BASE_API_URL + '/cigarretes-sales/:community', (req, res) => {
	res.status(405).send('NOT ALLOWED');
});


//-------------------------------------------------------------------------------------------------------------------------------------------------------------------------------


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
//-----------------------------------------------------------------------------------------------

//GET fires-stats
app.get(BASE_API_URL + '/fires-stats', (req, res) => {
	if (fires.length == 0) {
		res.status(400).send('THERE IS NO DATA');
	} else {
		res.send(JSON.stringify(fires, null, 2));
	}
});
//-----------------------------------------------------------------------------------------------

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
//-----------------------------------------------------------------------------------------------

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
//-----------------------------------------------------------------------------------------------

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
//-----------------------------------------------------------------------------------------------

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
//-----------------------------------------------------------------------------------------------
/*
// PUT fires-stats/XXX/XXX
app.put(BASE_API_URL + '/fires-stats/:community/:year', (req, res) => {
	var community = req.params.community;
	var year = req.params.year;

	var data = req.body;

	var filteredFires = fires_stats.filter(c => {
		return c.community == community && c.year == year;
	});

	if (filteredFires.length == 0) {
		res.sendStatus(404, 'NOT FOUND');
	} else {
		var filteredFires2 = fires_stats.filter(c => {
			return c.community != community || c.year != year;
		});

		if (data == '' || data.community == null || data.year == null) {
			res.sendStatus(400, 'BAD REQUEST');
		} else {
			Fires_stats = filteredFires2;
			filteredFires2.push(data);
			res.sendStatus(200, 'OK');
		}
	}
});
//-----------------------------------------------------------------------------------------------
*/
//POST FIRES/XXXX (Esto debe de dar un error de método no permitido)
app.post(BASE_API_URL + '/fires-stats/:community', (req, res) => {
	res.sendStatus(405); //Method not allowed
});
//-----------------------------------------------------------------------------------------------

//PUT FIRES (Esto debe de dar un error de método no permitido)

app.put(BASE_API_URL + '/fires-stats', (req, res) => {
	res.sendStatus(405); //Method Not Allowed
});
//-----------------------------------------------------------------------------------------------

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
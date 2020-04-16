
const express = require('express');	//Importacion modulo express
const bodyParser = require('body-parser');	//Importacion modulo body-parser
//const dataStore = require('nedb');	//Importacion base de datos nedb
const path = require('path');	//Importacion mnodulo path

const app = express();	//constante app para la utilizacion de express
const port = process.env.PORT || 80;	//constante port para la utilizacion del puerto 80 u otro.
//const dbFileNameFires = path.join(__dirname , "fires-stats.db");	//constante ruta de archivos de base de datos

//Llamada constantes de APIs
const apiAntonio = require(path.join(__dirname , "fires_stats_API"));	//Importación modulo API de Antonio
apiAntonio(app);
//API Alejandro
const offworks_stats_API = require(path.join(__dirname,"offworks_stats_API"));
offworks_stats_API(app);


//--------------------------------------------------------------------------------



app.use(bodyParser.json()); //Par cuando llegan datos transformarlos automรกticamente
app.use('/', express.static('./public'));


app.get('/cool', (request, response) => {
	response.send('<html>' + cool() + '</html>');
});

//Api Ejemplo contactos ------------------------------------------------------------
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


//------------------------------------------------------------------------------------



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


//---------------------------------------------------------------------------------------------------------------------------------------------------------------------------
app.listen(port, () => {
	console.log('server ready');
});

console.log('Starting server...');
module.exports = function (app){	//Funcion creada para la exportacion al archivo de ejecucion princpal del servidor
	console.log("Registering Fires-Stats API...");

const dataStore = require('nedb');	//Importacion base de datos nedb
const path = require('path');	//Importacion mnodulo path
const dbFileNameFires = path.join(__dirname , "fires-stats.db");	//constante ruta de archivos de base de datos
	
const BASE_API_URL = '/api/v1';	//Definimos la url por defecto

const dbFires = new dataStore({
					filename: dbFileNameFires,
					autoload: true
});	
	
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
/*app.get(BASE_API_URL + '/fires-stats/loadInitialData', (req, res) => {
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
*/
//------------Pruebas L08-----------------------------------------------------------------


app.get(BASE_API_URL + '/fires-stats/loadInitialData', (req, res) => { //(Cargo los datos iniciales en la base dedatos)
	
	console.log("NEW GET .../loadInitialData");
	
	dbFires.insert(fires);	//Con el insert meto datos en la base de datos
	res.sendStatus(200);
	
	console.log("Initial fires loaded:" + JSON.stringify(fires, null, 2));
});

//GET fires-stats (Obtengo los datos cargados en la base de datos)
app.get(BASE_API_URL + '/fires-stats', (req, res) => {
	
	console.log("NEW GET .../fires");
	
	dbFires.find({}, (err, fires) => {	//con las llaves vacias indico que me devuelva todo el conjunto
		
		fires.forEach( (c) =>{ //Codigo para eliminar la propiedad ID (Punto 12 del backlog)
			delete c._id;
		});
		
		res.send(JSON.stringify(fires, null, 2));
		console.log("Data Sent:" + JSON.stringify(fires, null, 2));
	});
	
});


//-----------------------------------------------------------------------------------------------
/*
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
*/
	
	
	
	
	
	
	console.log("OK!");
}


//------------------------------------------------------------------------


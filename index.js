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
const CigarretesAPI = require(path.join(__dirname,"CigarretesAPI"));
CigarretesAPI(app);

//--------------------------------------------------------------------------------

//probandooooooooooooooooooooo



app.use(bodyParser.json()); //Par cuando llegan datos transformarlos automรกticamente
app.use('/', express.static('./public1')); //Para que salga el public principal de html


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







//---------------------------------------------------------------------------------------------------------------------------------------------------------------------------
app.listen(port, () => {
	console.log('server ready');
});

console.log('Starting server...');

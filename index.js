const express = require('express');	//Importacion modulo express
const bodyParser = require('body-parser');	//Importacion modulo body-parser
//const dataStore = require('nedb');	//Importacion base de datos nedb
const path = require('path');	//Importacion modulo path
const cors = require('cors');

const back = require("./src/back/CigarretesAPI/v2");
const app = express();
app.use(bodyParser.json());
back(app);	//constante app para la utilizacion de express

app.use(cors()); //Para importar la cabeceras de CORS y que puedan acceder a las APIs

const port = process.env.PORT || 12345;	//constante port para la utilizacion del puerto 80 u otro.
//const dbFileNameFires = path.join(__dirname , "fires-stats.db");	//constante ruta de archivos de base de datos

//Llamada constantes de APIs 
//const apiAntonio = require(path.join(__dirname , "fires_stats_API"));	//Importación modulo API de Antonio
//apiAntonio(app);

//API Alejandro
const backAle = require("./src/back/offworks_stats_API/v2");
backAle(app);
//const offworks_stats_API = require(path.join(__dirname,"offworks_stats_API"));
//offworks_stats_API(app);
//API Joserra
const CigarretesAPI = require(path.join(__dirname,"CigarretesAPI"));
CigarretesAPI(app);

//--------------------------------------------------------------------------------

//Backend Antonio
const backAnt = require("./src/back/Fires_Stats_API/v2");

backAnt(app);


app.use(bodyParser.json()); //Par cuando llegan datos transformarlos automรกticamente
app.use('/', express.static('./public')); //Para que salga el public principal de html


app.listen(port, () => {
	console.log('server ready on port ' + port);
});

console.log('Starting server...');

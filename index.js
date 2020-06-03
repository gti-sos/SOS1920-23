const express = require('express');	//Importacion modulo express
const bodyParser = require('body-parser');	//Importacion modulo body-parser
//const dataStore = require('nedb');	//Importacion base de datos nedb
const path = require('path');	//Importacion modulo path
const cors = require('cors');	//Importacion para el modulo de las cabeceras CORS


const app = express();//constante app para la utilizacion de express
app.use(bodyParser.json());
	

app.use(cors()); //Para importar la cabeceras de CORS y que puedan acceder a las APIs

const port = process.env.PORT || 12345;	//constante port para la utilizacion del puerto 80 u otro.


//API Alejandro
const backAle = require("./src/back/offworks_stats_API/v2");
backAle(app);
//API Joserra
const back = require("./src/back/CigarretesAPI/v2");
back(app);
const CigarretesAPI = require(path.join(__dirname,"CigarretesAPI"));
CigarretesAPI(app);
//Backend Antonio
const backAnt = require("./src/back/Fires_Stats_API/v2");
backAnt(app);

//--------------------------------------------------------------------------------

app.use(bodyParser.json()); //Par cuando llegan datos transformarlos automรกticamente
app.use('/', express.static('./public')); //Para que salga el public principal de html


app.listen(port, () => {
	console.log('server ready on port ' + port);
});

console.log('Starting server...');

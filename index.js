const express = require('express');	//Importacion modulo express
const bodyParser = require('body-parser');	//Importacion modulo body-parser

const backAle = require("./src/back/offworks_stats_API/v2");
const backAnt = require("./src/back/Fires_Stats_API");
const back = require("./src/back/CigarretesAPI");

var app = express();
app.use(bodyParser.json());



backAle(app);
backAnt(app);
back(app);

var port = process.env.PORT || 12345;

app.use('/', express.static('./public')); //Para que salga el public principal de html


app.listen(port, () => {
	console.log('server ready on port ' + port);
});

console.log('Starting server...');

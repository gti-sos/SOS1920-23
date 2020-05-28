module.exports = function(app){
	const BASE_API_URL = '/api/v2';
	const dataStore = require("nedb");
	const path = require("path");
const dbFileName =path.join(__dirname,"/cigarretes_sales.db") ;
const db = new dataStore({
filename: dbFileName,
autoload: true
});
db.find({}, (err, cigarretes) =>{
	if(cigarretes.length == 0){
		db.insert([
			{
				community: 'Andalucia',
				year: 2007,
				cigarrete_sale: 812,
				first_variation: -4.9,
				second_variation: -47
			},
			{
				community: 'Aragon',
				year: 2007,
				cigarrete_sale: 132,
				first_variation: -2.9,
				second_variation: -36.3
			},
			{
				community: 'Asturias',
				year: 2007,
				cigarrete_sale: 98,
				first_variation: -9.2,
				second_variation: -32.6
			},
			{
				community: 'Islas Baleares',
				year: 2007,
				cigarrete_sale: 179,
				first_variation: -12.2,
				second_variation: -46.3
			},
			{
				community: 'Cantabria',
				year: 2007,
				cigarrete_sale: 56,
				first_variation: -6.6,
				second_variation: -33.9
			},
			{
				community: 'Castilla y Leon',
				year: 2007,
				cigarrete_sale: 221,
				first_variation: -7.5,
				second_variation: -34.8
			},
			{
				community: 'Castilla la Mancha',
				year: 2007,
				cigarrete_sale: 193,
				first_variation: 2.1,
				second_variation: -35.2
			},
			{
				community: 'Cataluña',
				year: 2007,
				cigarrete_sale: 844,
				first_variation: 4.1,
				second_variation: -41.7
			},
			{
				community: 'Comunidad Valenciana',
				year: 2007,
				cigarrete_sale: 569,
				first_variation: -5.4,
				second_variation: -43.7
			},
			{
				community: 'Extremadura',
				year: 2007,
				cigarrete_sale: 107,
				first_variation: -5.3,
				second_variation: -33.6
			},
			{
				community: 'Galicia',
				year: 2007,
				cigarrete_sale: 220,
				first_variation: -5.9,
				second_variation: -34
			},
			{
				community: 'Madrid',
				year: 2007,
				cigarrete_sale: 530,
				first_variation: -9.8,
				second_variation: -33.5
			},
			{
				community: 'Murcia',
				year: 2007,
				cigarrete_sale: 152,
				first_variation: 1.3,
				second_variation: -38.8
			},
			{
				community: 'Navarra',
				year: 2007,
				cigarrete_sale: 89,
				first_variation: 11.25,
				second_variation: -35.9
			},
			{
				community: 'Pais Vasco',
				year: 2007,
				cigarrete_sale: 228,
				first_variation: 3.6,
				second_variation: -38.5
			},
			{
				community: 'La Rioja',
				year: 2007,
				cigarrete_sale: 26,
				first_variation: -7.1,
				second_variation: -34.6
			},
			{
				community: 'Andalucia',
				year: 2009,
				cigarrete_sale: 738,
				first_variation: -13.5,
				second_variation: -41.7
			},
			{
				community: 'Aragon',
				year: 2009,
				cigarrete_sale: 124,
				first_variation: -8.8,
				second_variation: -32.5
			},
		
			{
				community: 'Asturias',
				year: 2009,
				cigarrete_sale: 95,
				first_variation: -12.0,
				second_variation: -30.5
			},
			{
				community: 'Islas Baleares',
				year: 2009,
				cigarrete_sale: 143,
				first_variation: -29.9,
				second_variation: -32.8
			},
			{
				community: 'Cantabria',
				year: 2009,
				cigarrete_sale: 54,
				first_variation: -6.6,
				second_variation: -31.4
			},
			{
				community: 'Castilla y Leon',
				year: 2009,
				cigarrete_sale: 213,
				first_variation: -7.5,
				second_variation: -32.3
			}
		
	
		]) 
	}

	else{
		console.log("Loaded DB with " + cigarretes.length + " cigarretes");
	}
});

	console.log("Registering cigarretes api");
		console.log("OK");
var initialCigarretes = [
	{
		community: 'Andalucia',
		year: 2007,
		cigarrete_sale: 812,
		first_variation: -4.9,
		second_variation: -47
	},
	{
		community: 'Aragon',
		year: 2007,
		cigarrete_sale: 132,
		first_variation: -2.9,
		second_variation: -36.3
	},
	{
		community: 'Asturias',
		year: 2007,
		cigarrete_sale: 98,
		first_variation: -9.2,
		second_variation: -32.6
	},
	{
		community: 'Islas Baleares',
		year: 2007,
		cigarrete_sale: 179,
		first_variation: -12.2,
		second_variation: -46.3
	},
	{
		community: 'Cantabria',
		year: 2007,
		cigarrete_sale: 56,
		first_variation: -6.6,
		second_variation: -33.9
	},
	{
		community: 'Castilla y Leon',
		year: 2007,
		cigarrete_sale: 221,
		first_variation: -7.5,
		second_variation: -34.8
	},
	{
		community: 'Castilla la Mancha',
		year: 2007,
		cigarrete_sale: 193,
		first_variation: 2.1,
		second_variation: -35.2
	},
	{
		community: 'Cataluña',
		year: 2007,
		cigarrete_sale: 844,
		first_variation: 4.1,
		second_variation: -41.7
	},
	{
		community: 'Comunidad Valenciana',
		year: 2007,
		cigarrete_sale: 569,
		first_variation: -5.4,
		second_variation: -43.7
	},
	{
		community: 'Extremadura',
		year: 2007,
		cigarrete_sale: 107,
		first_variation: -5.3,
		second_variation: -33.6
	},
	{
		community: 'Galicia',
		year: 2007,
		cigarrete_sale: 220,
		first_variation: -5.9,
		second_variation: -34
	},
	{
		community: 'Madrid',
		year: 2007,
		cigarrete_sale: 530,
		first_variation: -9.8,
		second_variation: -33.5
	},
	{
		community: 'Murcia',
		year: 2007,
		cigarrete_sale: 152,
		first_variation: 1.3,
		second_variation: -38.8
	},
	{
		community: 'Navarra',
		year: 2007,
		cigarrete_sale: 89,
		first_variation: 11.25,
		second_variation: -35.9
	},
	{
		community: 'Pais Vasco',
		year: 2007,
		cigarrete_sale: 228,
		first_variation: 3.6,
		second_variation: -38.5
	},
	{
		community: 'La Rioja',
		year: 2007,
		cigarrete_sale: 26,
		first_variation: -7.1,
		second_variation: -34.6
	},
	{
		community: 'Andalucia',
		year: 2009,
		cigarrete_sale: 738,
		first_variation: -13.5,
		second_variation: -41.7
	},
	{
		community: 'Aragon',
		year: 2009,
		cigarrete_sale: 124,
		first_variation: -8.8,
		second_variation: -32.5
	},

	{
		community: 'Asturias',
		year: 2009,
		cigarrete_sale: 95,
		first_variation: -12.0,
		second_variation: -30.5
	},
	{
		community: 'Islas Baleares',
		year: 2009,
		cigarrete_sale: 143,
		first_variation: -29.9,
		second_variation: -32.8
	},
	{
		community: 'Cantabria',
		year: 2009,
		cigarrete_sale: 54,
		first_variation: -6.6,
		second_variation: -31.4
	},
	{
		community: 'Castilla y Leon',
		year: 2009,
		cigarrete_sale: 213,
		first_variation: -7.5,
		second_variation: -32.3
	}


	
];
app.get(BASE_API_URL + '/loadInitialData', (req, res) => {
	db.insert(initialCigarretes);
		console.log("New GET.../loadInitialData");

	res.sendStatus(200);
	console.log('Initial cigarretes_sales loaded:' + JSON.stringify(cigarretes, null, 2));
});


//GET CIGARRETES

app.get(BASE_API_URL + '/cigarretes-sales', (req, res) => {
	console.log("New GET.../cigarretes");
	var query = req.query  //Declarar variable de consulta
	var limit = req.query.limit;   //A partir de que elemento devuelvo
	var offset = req.query.offset;  // Numero de elementos que devuelvo
	
	delete req.query.offset;
	delete req.query.limit;
	
	community = req.query.community;
	year = req.query.year;
	cigarrete_sale = req.query.cigarrete_sale;
	first_variation = req.query.first_variation;
	second_variation = req.query.second_variation;
	
	if(query.hasOwnProperty("community")){
			query.community = query.community;
	}
	if(query.hasOwnProperty("year")){
			query.year = parseInt(query.year);
	}
	if(query.hasOwnProperty("cigarrete_sale")){
			query.cigarrete_sale = parseInt(query.cigarrete_sale);
	}
	if(query.hasOwnProperty("first_variation")){
			query.first_variation = parseFloat(query.first_variation);
	}
	if(query.hasOwnProperty("second_variation")){
			query.second_variation = parseFloat(query.second_variation);
	}
	db.find(query).skip(offset).limit(limit).exec((err, cigarretes) =>{
			
			cigarretes.forEach( (c) =>{ 
			delete c._id;
			});
			
			
			if(cigarretes.length < 1){	
				res.status(404).send("Data not found");
				console.log("Failure to make the request");
			}
			else {	
					
				res.send(JSON.stringify(cigarretes, null, 2));
				console.log("Data Sent: "+JSON.stringify(cigarretes, null, 2));
			}
		});
	
	
});

// POST CIGARRETES
app.post(BASE_API_URL + '/cigarretes-sales', (req, res) => {
	var newCigarrete = req.body;
	db.find({community: newCigarrete.community , year:newCigarrete.year},(err,cigarretes) =>{
	if(cigarretes.length>0){
		res.status(409).send("The resource already exists");
	}
	else if ((newCigarrete == '' || newCigarrete.community == null || newCigarrete.community == ""|| newCigarrete.year == null ||newCigarrete.year==""|| newCigarrete.cigarrete_sale == null || newCigarrete.cigarrete_sale==""|| newCigarrete.first_variation == null||newCigarrete.first_variation=="" || newCigarrete.second_variation==""||newCigarrete.second_variation == null)) {
		res.sendStatus(400, 'BAD REQUEST');
	} else {
		db.insert(newCigarrete);
		res.sendStatus(201, 'CREATED');
	}
});
});


//DELETE CIGARRETES
app.delete(BASE_API_URL + '/cigarretes-sales', (req, res) => {
	db.remove({},{multi:true},function(err,numRemoved){});
	res.sendStatus(200, 'OK');
});

//GET CIGARRETES/XXX/YYYY

app.get(BASE_API_URL + '/cigarretes-sales/:community/:year', (req, res) => {
	var searchCommunity = req.params.community;
	var searchYear= parseInt(req.params.year);
	db.find({community:searchCommunity,year:searchYear},(err,cigarretes)=>{
		cigarretes.forEach((c) =>{
			delete c._id;
		});
		if(cigarretes.length == 1){
			res.send(JSON.stringify(cigarretes[0],null,2));
			console.log("Data sent:"+JSON.stringify(cigarretes[0],null,2));
		}else{
			res.sendStatus(404,"NOT FOUND");
			console.log("NOT FOUND");
		}
	})
});
//PUT CIGARRETES
app.put(BASE_API_URL + '/cigarretes-sales', (req, res) => {
	res.status(405).send('NOT ALLOWED');
});

//PUT CIGARRETES/XXX/YYYY
app.put(BASE_API_URL + '/cigarretes-sales/:community/:year', (req, res) => {
	var searchCommunity = req.params.community;
	var searchYear= parseInt(req.params.year);
	var newCigarrete = req.body;
	if (newCigarrete == '' ||newCigarrete.community==""||newCigarrete.year==""|| newCigarrete.community != searchCommunity || newCigarrete.year != searchYear || newCigarrete.community == null || newCigarrete.year == null || newCigarrete.cigarrete_sale == null || newCigarrete.first_variation == null || newCigarrete.second_variation == null) {
		res.sendStatus(400,"Bad Request");
	}else{
		db.update({community:searchCommunity,year:searchYear},newCigarrete);
		
		res.sendStatus(200);
	}
	
});

//DELETE CIGARRETES/XXX/YYYY
app.delete(BASE_API_URL + '/cigarretes-sales/:community/:year', (req, res) => {
	var searchCommunity = req.params.community;
	var searchYear= parseInt(req.params.year);
	db.remove({community: searchCommunity , year:searchYear},{},function(err,numRemoved){
			  if(numRemoved == 1){
		res.sendStatus(200);
		console.log("Removed");
	}else{
		res.sendStatus(404);
		console.log("Not found");
	}
			  })
});

	


//POST CIGARRETES/XXX/YYYY
app.post(BASE_API_URL + '/cigarretes-sales/:community/:year', (req, res) => {
	res.status(405).send('NOT ALLOWED');
});
}


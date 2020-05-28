module.exports = function(app) {
	console.log('Entrando en API offworks_stats...');

	const dataStore = require('nedb');
	const path = require('path');
	const dbFileName = path.join(__dirname, 'offworks_stats.db');
	const BASE_API_URL = '/api/v2';
	const request = require('request');
	
	var api1 = 'https://sos1920-21.herokuapp.com'; 
	var paths1='/api/v2/driving-licenses';
	
	app.use(paths1, function(req, res) {
        var url = api1 + req.baseUrl + req.url;
        console.log('piped: ' + req.baseUrl + req.url);
        req.pipe(request(url)).pipe(res);
	});

	var api2 = 'https://sos1920-28.herokuapp.com'; 
	var paths2='/api/v1/ppas';
	
	app.use(paths2, function(req, res) {
        var url = api2 + req.baseUrl + req.url;
        console.log('piped: ' + req.baseUrl + req.url);
        req.pipe(request(url)).pipe(res);
	});

	var api3 = 'https://sos1920-26.herokuapp.com'; 
	var paths3='/api/v3/goalscorers';
	
	app.use(paths3, function(req, res) {
        var url = api3 + req.baseUrl + req.url;
        console.log('piped: ' + req.baseUrl + req.url);
        req.pipe(request(url)).pipe(res);
	});

	const db = new dataStore({
		filename: dbFileName,
		autoload: true
	});

	var offworks_stats = [
		{community: 'Andalucia',year: 2007,accident: 6878,sick: 29.1,numberzone: 804},
		{community: 'Aragon',year: 2007,accident: 5251,sick: 323.4,numberzone: 1750},
		{community: 'Asturias',year: 2007,accident: 6322,sick: 159.5,numberzone: 600},
		{community: 'Canarias',year: 2007,accident: 6469,sick: 14.7,numberzone: 116},
		{community: 'Cantabria',year: 2007,accident: 5392,sick: 29.1,numberzone: 303},
		{community: 'Castilla-la-Mancha',year: 2007,accident: 7575,sick: 107,numberzone: 1005},
		{community: 'Castilla-y-Leon',year: 2007,accident: 5683,sick: 59.1,numberzone: 431},
		{community: 'Cataluña',year: 2007,accident: 5693,sick: 112.7,numberzone: 3470},
		{community: 'Andalucia',year: 2008,accident: 5835,sick: 32.9,numberzone: 866},
		{community: 'Aragon',year: 2008,accident: 4766,sick: 325.8,numberzone: 1677},
		{community: 'Canarias',year: 2008,accident: 5659,sick: 22.3,numberzone: 165},
		{community: 'Cantabria',year: 2008,accident: 4981,sick: 176,numberzone: 397},
		{community: 'Castilla-la-Mancha',year: 2008,accident: 6487,sick: 105.9,numberzone: 974},
		{community: 'Castilla-y-Leon',year: 2008,accident: 5274,sick: 61.4,numberzone: 437}
	];
	// GET LOADINITIALDATA
	app.get(BASE_API_URL + '/offworks-stats/loadInitialData', (req, res) => {
		db.remove({}, {multi:true});
		db.insert(offworks_stats);
		res.sendStatus(200, 'CREATED DATA');
	});

	// GET OFFWORKS
	app.get(BASE_API_URL + '/offworks-stats', (req, res) => {
		var request = {};
		if (req.query.community) request['community'] = req.query.community;
		if (req.query.year) request['year'] = parseInt(req.query.year);
		if (req.query.accident) request['accident'] = parseInt(req.query.accident);
		if (req.query.sick) request['sick'] = parseFloat(req.query.sick);
		if (req.query.numberzone) request['numberzone'] = parseInt(req.query.numberzone);

		var offset = parseInt(req.query.offset) || 0;
		var limit = parseInt(req.query.limit) || Number.MAX_SAFE_INTEGER;

		db
			.find(request, {})
			.skip(offset)
			.limit(limit)
			.exec((err, offworks_stats) => {
				offworks_stats.forEach(c => {
					delete c._id;
				});
				if (offworks_stats.length >= 1) {
					console.log('Recurso encontrado');
					res.send(JSON.stringify(offworks_stats, null, 2));
					console.log('Data sent: ' + JSON.stringify(offworks_stats, null, 2));
				} else {
					console.log('ERROR. No se encuentra el recurso.');
					res.sendStatus(404, 'NOT FOUND');
				}
			});
	});
	// POST OFFWORKS
	app.post(BASE_API_URL + '/offworks-stats', (req, res) => {
		var newData = req.body;
		var control_error = false;

		if (
			newData.community == null ||
			newData.community == '' ||
			newData.year == null ||
			newData.year == '' ||
			newData.accident == null ||
			newData.accident == '' ||
			newData.sick == null ||
			newData.sick == '' ||
			newData.numberzone == null ||
			newData.numberzone == ''
		) {
			res.sendStatus(400, 'BAD REQUEST');
		} else {
			if (Object.keys(newData).length == 5) {
				for (key in newData) {
					if (
						key != 'community' &&
						key != 'year' &&
						key != 'accident' &&
						key != 'sick' &&
						key != 'numberzone'
					) {
						control_error = true;
					}
				}
			} else {
				control_error = true;
			}

			if (control_error) {
				res.sendStatus(400, 'BAD REQUEST');
			} else {
				db.find(
					{ community: newData.community, year: newData.year },
					(err, offworks_stats) => {
						if (offworks_stats.length > 0) {
							res.sendStatus(409, 'ALREADY EXISTS');
						} else {
							db.insert(newData);
							res.sendStatus(201, 'CREATED');
						}
					}
				);
			}
		}
	});
	// PUT OFFWORK
	app.put(BASE_API_URL + '/offworks-stats', (req, res) => {
		res.status(405).send('NOT ALLOWED');
	});
	// DELETE OFFWORKS
	app.delete(BASE_API_URL + '/offworks-stats', (req, res) => {
		console.log('New DELETE .../offworks-stats');

		db.remove({}, { multi: true }, function(err, numRem) {
			console.log('Removed ' + numRem + ' elements.');
		});
		res.sendStatus(200, 'OK');
	});
	// GET OFFWORKS/XXX/--
	app.get(BASE_API_URL + '/offworks-stats/:community/:year', (req, res) => {
		var communityP = req.params.community;
		var yearP = req.params.year;

		db.find({ community: communityP, year: parseInt(yearP) }, (err, offworks_stats) => {
			if (offworks_stats.length >= 1) {
				offworks_stats.forEach(c => {
					delete c._id;
				});
				res.send(JSON.stringify(offworks_stats[0], null, 2));
			} else {
				res.sendStatus(404, 'NOT FOUND');
			}
		});
	});
	// PUT OFFWORKS/XXX
	app.put(BASE_API_URL + '/offworks-stats/:community/:year', (req, res) => {
		var community = req.params.community;
		var year = req.params.year;

		var newData = req.body;

		db.find({ community: community, year: parseInt(year) }, (err, offworks_stats) => {
			if (offworks_stats.length == 0) {
				res.sendStatus(404, 'NOT FOUND');
			} else {
				if (newData == '' || newData.community == null || newData.year == null) {
					res.sendStatus(400, 'BAD REQUEST');
				} else {
					db.update({ community: community, year: parseInt(year) }, newData);
					res.sendStatus(200, 'OK');
				}
			}
		});
	});

	//POST OFFWORKS/XXX
	app.post(BASE_API_URL + '/offworks-stats/:community', (req, res) => {
		res.status(405).send('NOT ALLOWED');
	});
	app.post(BASE_API_URL + '/offworks-stats/:community/:year', (req, res) => {
		res.status(405).send('NOT ALLOWED');
	});
	// DELETE OFFWORKS/XXX

	app.delete(BASE_API_URL + '/offworks-stats/:community', (req, res) => {
		var community = req.params.community;

		db.find({ community: community }, (err, offworks_stats) => {
			if (err) {
			} else if (!offworks_stats.length == 0) {
				db.remove({ community: community });
				res.sendStatus(200, 'OK');
			} else if (offworks_stats.length == 0) {
				res.sendStatus(404, 'NOT FOUND');
			}
		});
	});
	// DELETE OFFWORKS/XXX/--
	app.delete(BASE_API_URL + '/offworks-stats/:community/:year', (req, res) => {
		var community = req.params.community;
		var year = parseInt(req.params.year);

		db.find({ community: community, year: year }, (err, offworks_stats) => {
			if (err) {
			} else if (!offworks_stats.length == 0) {
				db.remove({ community: community, year: year });
				res.sendStatus(200, 'OK');
			} else if (offworks_stats.length == 0) {
				res.sendStatus(404, 'NOT FOUND');
			}
		});
	});
	//GET OFFWORK COMMUNITY or YEAR
	app.get(BASE_API_URL + '/offworks-stats/:param', (req, res) => {
		var resource = parseInt(req.params.param);

		if (Number.isNaN(resource)) {
			var community = req.params.param;
			db.find({ community: community }, (err, offworks_stats) => {
				if (err) {
					console.log('database error: ' + err);
				} else if (!offworks_stats.length == 0) {
					offworks_stats.forEach(c => {
						delete c._id;
					});
					res.send(JSON.stringify(offworks_stats, null, 2));
				} else if (offworks_stats.length == 0) {
					res.sendStatus(404, 'NOT FOUND');
				}
			});
		} else {
			var year = resource;
			db.find({ year: year }, (err, offworks_stats) => {
				if (err) {
					console.log('database error: ' + err);
				} else if (!offworks_stats.length == 0) {
					offworks_stats.forEach(c => {
						delete c._id;
					});
					res.send(JSON.stringify(offworks_stats, null, 2));
				} else if (offworks_stats.length == 0) {
					res.sendStatus(404, 'NOT FOUND');
				}
			});
		}
	});
};

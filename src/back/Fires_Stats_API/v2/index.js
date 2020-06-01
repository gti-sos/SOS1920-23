module.exports = function (app){	//Funcion creada para la exportacion al archivo de ejecucion princpal del servidor
	
    const request = require('request');
    const dataStore = require('nedb');	//Importacion base de datos nedb
    const path = require('path');	//Importacion mnodulo path
    const dbFileNameFires = path.join(__dirname , "fires-stats.db");	//constante ruta de archivos de base de datos	
    const BASE_API_URL = '/api/v2';	//Definimos la url por defecto, cambiamos a v2, modificaciones en el tamaño de datos por defecto
    const bodyParser = require('body-parser');	//Importacion modulo body-parser
    const dbFires = new dataStore({	//Declaro la constante para usar mi base de datos
                        filename: dbFileNameFires,
                        autoload: true
    });	

    //Implementacion de Proxy para acceder a la API Emigrants Stats
    var api1 = 'https://sos1920-07.herokuapp.com'; 
	var paths1='/api/v2/imports';
	
	app.use(paths1, function(req, res) {
        var url = api1 + req.baseUrl + req.url;
        console.log('Proxy with: ' + req.baseUrl + req.url);
        req.pipe(request(url)).pipe(res);
    });
    
    //Implementacion de Proxy para acceder a la API Not hospitalized Stats
    var api2 = 'https://sos1920-06.herokuapp.com'; 
	var paths2='/api/v2/not-hospitalized-stats';
	
	app.use(paths2, function(req, res) {
        var url = api2 + req.baseUrl + req.url;
        console.log('Proxy with: ' + req.baseUrl + req.url);
        req.pipe(request(url)).pipe(res);
    });

    //Llamada API Externa
    var api3 = 'https://deezerdevs-deezer.p.rapidapi.com';
    var path3 = '/search';

    app.use(path3, function(req, res){
        var url = api3 + req.baseUrl + req.url;
        console.log("Proxy with: "+ req.baseUrl + req.url);
        req.pipe(request(url)).pipe(res);
    });


    var unirest = require("unirest");

    var req = unirest("GET", "https://deezerdevs-deezer.p.rapidapi.com/search");

    req.query({
        "q": "eminem"
    });

    req.headers({
        "x-rapidapi-host": "deezerdevs-deezer.p.rapidapi.com",
        "x-rapidapi-key": "1ffb76c03dmsh3fb87e4dcd08115p1d9482jsn63e6275c09b1",
        "useQueryString": true
    });


    req.end(function (res) {
        if (res.error) throw new Error(res.error);
        console.log("Hola, mostrando api externa");
        console.log(res.body);
    });

        
    app.use(bodyParser.json()); //Par cuando llegan datos transformarlos automรกticamente
        //API Antonio
        
    //------------------------------------------------------------------------------------------------------------------------
    console.log("Registering Fires-Stats API.......");
    
    dbFires.find({}, (err, fires) =>{
        if(fires.length == 0){
            dbFires.insert([
        {//En el 2007 falta asturias que se usa para las pruebas del postman
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
        },
        {
            community: 'comunidad-valenciana',
            year: 2007,
            total_fire: 375,
            forest_area: 8224.69,
            non_forest_area: 1847.42
        },
            {
            community: 'canarias',
            year: 2007,
            total_fire: 139,
            forest_area: 35758.62,
            non_forest_area: 1815.86
        },
        {
            community: 'cantabria',
            year: 2007,
            total_fire: 296,
            forest_area: 3452.83,
            non_forest_area: 0
        },
        {
            community: 'castilla-leon',
            year: 2007,
            total_fire: 1511,
            forest_area: 9760.29,
            non_forest_area: 2221.99
        },
        {
            community: 'castilla-la-mancha',
            year: 2007,
            total_fire: 694,
            forest_area: 2026.46,
            non_forest_area: 1068.96
        },
        {
            community: 'cataluna',
            year: 2007,
            total_fire: 579,
            forest_area: 1612.25,
            non_forest_area: 436.37
        },
        {
            community: 'ceuta',
            year: 2007,
            total_fire: 0,
            forest_area: 0,
            non_forest_area: 0
        },
        {
            community: 'extremadura',
            year: 2007,
            total_fire: 748,
            forest_area: 6032.60,
            non_forest_area: 818.07
        },
        {
            community: 'galicia',
            year: 2007,
            total_fire: 3157,
            forest_area: 7051.06,
            non_forest_area: 9.93
        },
        {
            community: 'islas-baleares',
            year: 2007,
            total_fire: 113,
            forest_area: 123.90,
            non_forest_area: 3.50
        },
        {
            community: 'la-rioja',
            year: 2007,
            total_fire: 93,
            forest_area: 69.49,
            non_forest_area: 44.49
        },
        {
            community: 'madrid',
            year: 2007,
            total_fire: 230,
            forest_area: 449.75,
            non_forest_area: 143.37
        },
        {
            community: 'murcia',
            year: 2007,
            total_fire: 113,
            forest_area: 160.18,
            non_forest_area: 23.80
        },
        {
            community: 'navarra',
            year: 2007,
            total_fire: 504,
            forest_area: 473.86,
            non_forest_area: 260.10
        },
        {
            community: 'pais-vasco',
            year: 2007,
            total_fire: 67,
            forest_area: 105.61,
            non_forest_area: 4.70
        },
        
        
        
        //Datos del 2008 (no estan todas las comunidades, 
        //es solo para la prueba)
        {
            community: 'andalucia',
            year: 2008,
            total_fire: 776,
            forest_area: 2895.02,
            non_forest_area: 675.85
        },
        {
            community:"asturias",
            year:2008,
            total_fire:1083,
            forest_area:2690.31,
            non_forest_area:0
        },
        {
            community: 'aragon',
            year: 2008,
            total_fire: 415,
            forest_area: 2601.04,
            non_forest_area: 611.51
        },
        {
            community: 'comunidad-valenciana',
            year: 2008,
            total_fire: 375,
            forest_area: 9861.30,
            non_forest_area: 1847.42
        },
            {
            community: 'canarias',
            year: 2008,
            total_fire: 133,
            forest_area: 426.05,
            non_forest_area: 1815.86
        }
            ]) 
        }
    
        else{
            console.log("Loaded DB with " + fires.length + " fires_stats");
        }
    });
    
    
    var initialFires = [	//Datos iniciales para cargar
        {//En el 2007 falta asturias que se usa para las pruebas del postman
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
        },
        {
            community: 'comunidad-valenciana',
            year: 2007,
            total_fire: 375,
            forest_area: 8224.69,
            non_forest_area: 1847.42
        },
            {
            community: 'canarias',
            year: 2007,
            total_fire: 139,
            forest_area: 35758.62,
            non_forest_area: 1815.86
        },
        {
            community: 'cantabria',
            year: 2007,
            total_fire: 296,
            forest_area: 3452.83,
            non_forest_area: 0
        },
        {
            community: 'castilla-leon',
            year: 2007,
            total_fire: 1511,
            forest_area: 9760.29,
            non_forest_area: 2221.99
        },
        {
            community: 'castilla-la-mancha',
            year: 2007,
            total_fire: 694,
            forest_area: 2026.46,
            non_forest_area: 1068.96
        },
        {
            community: 'cataluna',
            year: 2007,
            total_fire: 579,
            forest_area: 1612.25,
            non_forest_area: 436.37
        },
        {
            community: 'ceuta',
            year: 2007,
            total_fire: 0,
            forest_area: 0,
            non_forest_area: 0
        },
        {
            community: 'extremadura',
            year: 2007,
            total_fire: 748,
            forest_area: 6032.60,
            non_forest_area: 818.07
        },
        {
            community: 'galicia',
            year: 2007,
            total_fire: 3157,
            forest_area: 7051.06,
            non_forest_area: 9.93
        },
        {
            community: 'islas-baleares',
            year: 2007,
            total_fire: 113,
            forest_area: 123.90,
            non_forest_area: 3.50
        },
        {
            community: 'la-rioja',
            year: 2007,
            total_fire: 93,
            forest_area: 69.49,
            non_forest_area: 44.49
        },
        {
            community: 'madrid',
            year: 2007,
            total_fire: 230,
            forest_area: 449.75,
            non_forest_area: 143.37
        },
        {
            community: 'murcia',
            year: 2007,
            total_fire: 113,
            forest_area: 160.18,
            non_forest_area: 23.80
        },
        {
            community: 'navarra',
            year: 2007,
            total_fire: 504,
            forest_area: 473.86,
            non_forest_area: 260.10
        },
        {
            community: 'pais-vasco',
            year: 2007,
            total_fire: 67,
            forest_area: 105.61,
            non_forest_area: 4.70
        },
        
        
        
        //Datos del 2008 (no estan todas las comunidades, 
        //es solo para la prueba)
        {
            community: 'andalucia',
            year: 2008,
            total_fire: 776,
            forest_area: 2895.02,
            non_forest_area: 675.85
        },
        {
            community:"asturias",
            year:2008,
            total_fire:1083,
            forest_area:2690.31,
            non_forest_area:0
        },
        {
            community: 'aragon',
            year: 2008,
            total_fire: 415,
            forest_area: 2601.04,
            non_forest_area: 611.51
        },
        {
            community: 'comunidad-valenciana',
            year: 2008,
            total_fire: 375,
            forest_area: 9861.30,
            non_forest_area: 1847.42
        },
            {
            community: 'canarias',
            year: 2008,
            total_fire: 133,
            forest_area: 426.05,
            non_forest_area: 1815.86
        }
        
    ];
    
    //------------Pruebas L08-----------------------------------------------------------------
    
    //GET LOADINITIALDATA
        //(Cargo los datos iniciales en la base de datos)
    app.get(BASE_API_URL + '/fires-stats/loadInitialData', (req, res) => { 
        
        console.log("NEW GET .../loadInitialData");
        
        dbFires.insert(initialFires);	//Con el insert meto datos en la base de datos
        
            if(initialFires.length >=1){
                //Si el tamaño del conjunto de recursos es mayor o igual que uno,
                //muestra código 200, ok.
                res.status(200).send('There´s already created!');
    
            }
            else{
                //Sino, muestra el conjunto de recursos.
                res.send(JSON.stringify(initialFires, null, 2));
            }
        
        console.log("Initial fires loaded:" + JSON.stringify(initialFires, null, 2));
    });
    
    //-----------------------------------------------------------------------------------------------
    //GET A UNA COMUNIDAD AUTONOMA
        //Obtiene todos recursos dada una comunidad autónoma (de todos los años)
    app.get(BASE_API_URL + '/fires-stats/:community', (req, res) => {
    console.log("NEW GET OF SPECIFIC RESOURCE: ")
    
        var community = req.params.community;
        
        dbFires.find({$and: [{"community": community}]},(err,fires)=>{
               
            fires.forEach( (c) =>{ //Codigo para eliminar la propiedad ID (Punto 12 del backlog)
            delete c._id;
            });
            
            if (fires.length != 0) {
                //Si el tamaño del conjunto de recursos es distinto a 0, muestralo
                res.send(JSON.stringify(fires,null,2));
                console.log("Data sent: " + JSON.stringify(fires,null,2));
            } 
            else{
                //Sino, manda mensaje de error de recurso no encontrado.
                res.status(404).send("Resource not found.");
            }
        });
    }); 
    
    //-----------------------------------------------------------------------------------------------
    //POST fires-stats (Almacena recursos en la base de datos)
    
    app.post(BASE_API_URL + '/fires-stats', (req, res) => {
        
        var newFire = req.body; 	//Nueva variable para el cuerpo de mi recurso
        
        dbFires.find({community : newFire.community, year : newFire.year}, (err, fires) =>{
            //Aquí busco en la base de datos si tengo algun recurso identico, si es asi
            //me dara error 409 conflicto.
            if(fires.length > 0){
                res.status(409).send("The resource already exists");
            }
            
            else if((newFire == "") || (newFire.community == null) || (newFire.community == "") 
            || (newFire.year == "") || (newFire.total_fire == "") || (newFire.forest_area == "") || (newFire.non_forest_area == "")){
                //Si el nuevo recurso a enviar esta vacio, o la comunidad es nula o el campo está vacio
                //sale un mensaje de error de solicitud incorrecta
                
                res.status(400).send("Bad Request! Review the entered data");
                
                console.log("Failed to make request");
            }
            
            else{	//Sino añadido del recurso exitoso
                dbFires.insert(newFire);
                res.status(201).send("Resource created!");
            }
        });
        
    });
        
    //-------------------------------------------------------------------------------------------
        
    //GET fires-stats/XXXX/XXXX (Acceso a un recurso concreto para diferenciar entre los diferentes años)
    app.get(BASE_API_URL + '/fires-stats/:community/:year', (req, res) => {
        console.log("NEW GET OF SPECIFIC RESOURCE: ")
    
        var community = req.params.community;
        var year = req.params.year;
        
        dbFires.find({$and: [{"community": community}]},{$and: [{"year": year}]},(err,fires)=>{
                
                fires.forEach( (c) =>{ //Codigo para eliminar la propiedad ID (Punto 12 del backlog)
                delete c._id;
                });
            
                var filteredfires = fires.filter(f => {
                    //Filter va iterando y devolviendo todos los elementos del array, y comprueba que el nombre de la
                    //comunidad y el año, coinciden con los que se les pasa como parametro
                return f.community == community && f.year == year;
                });
                    if (filteredfires.length >= 1) {
                        res.send(filteredfires[0])	//muestra el primer elemento del get que ha encontrado
                    } else {
                        res.status(404).send("Resource not found."); 
                        //Si no lo encuentra dará un error de recurso no encontrado
                    }
            
            });
       }); 
    
    //----------------------------------------------------------------------------------------------	
    
    //GET PAGINACION Y BÚSQUEDA
        //Si hago paginacion usaré las variables limit y offset para decidir cuantos elementos devuelvo(limit)
        //y a partir de qué elemento(offset), y si hago búsquedas estas variables no las usaré sino
        //que comprobare si las consultas a la base de datos contienen todos o alguno de los campos
        //de mi colección.	
    app.get(BASE_API_URL + '/fires-stats', (req, res) =>{
        console.log("NEW GET OF SPECIFIC RESOURCE WITH SPECIFIC FIELDS: ")
        
        var query = req.query;	//Declaramos variable peticion (consulta)
        
        var offset = req.query.offset;	//Variable offset (a partir de qué elemento devuelvo)
        var limit = req.query.limit;	//Variable limit (cuántos elementos devuelvo)
        
        //Si están vacios, es por que están en desuso y se eliminan (sería el caso de una búsqueda)
        delete req.query.offset;
        delete req.query.limit;
        
        //Declaro las variables del os campos de mi coleccion
        var community = req.query.community;
        var year = req.query.year;
        var total_fire = req.query.total_fire;
        var forest_area = req.query.forest_area;
        var non_forest_area = req.query.non_forest_area;
        
        
        //Compruebo que la consulta contiene alguno de los campos de mi recurso
        //usando hasOwnProperty(comprueba si el objeto al que consulta tiene la 
        //propiedad con el nombre del argumento que se le pasa a la funcion).
        if(query.hasOwnProperty("community")){
            query.community = query.community;
        }
        if(query.hasOwnProperty("year")){
            query.year = parseInt(query.year);
        }
        if(query.hasOwnProperty("total_fire")){
            query.total_fire = parseInt(query.total_fire);
        }
        if(query.hasOwnProperty("forest_area")){
            query.forest_area = parseFloat(query.forest_area);
        }
        if(query.hasOwnProperty("non_forest_area")){
            query.non_forest_area = parseFloat(query.non_forest_area);
        }
        
        //Busco esos elementos en la base de datos para hacer el GET correctamente,
        //ya sea búsqueda o paginación.
            dbFires.find(query).skip(offset).limit(limit).exec((err, fires) =>{
                
                fires.forEach( (c) =>{ //Codigo para eliminar la propiedad ID (Punto 12 del backlog)
                delete c._id;
                });
                
                
                if(fires.length < 1){	//Si el tamaño de la coleccion es menor que 1
                                        //eso significa que los datos no han sido encontrados,
                                        //con lo cual mandará codigo error 404 (Not found)
                    res.status(404).send("Data not found");
                    console.log("Failed to make request");
                }
                else {	//Sino, muestra los datos encontrados
                        
                    res.send(JSON.stringify(fires, null, 2));
                    console.log("Data Sent: "+JSON.stringify(fires, null, 2));
                }
            });
    });
        
    //----------------------------------------------------------------------------------------------
        
    //DELETE fires-stats/XXXX/XXXX 
        //Elimina el recurso concreto por comunidad y año, si no estuviera el año
        //me eliminaria todas las comunidades que coincidan con el nombre del prametro de todos los años
    app.delete(BASE_API_URL + '/fires-stats/:community/:year', (req, res) => {
        var community = req.params.community;
        var year = req.params.year;
    
        dbFires.find({$and: [{"community": community}]}, {$and: [{"year": year}]}, (err, fires) =>{	
            //Usare esto para busca en la base de datos el recurso que deseo eliminar
                
                var filteredfires = fires.filter((f) => {//filtro en mis recursos por comunidad y año
                    return (((f.community == community) && (f.year == year)));
                });		
            
                if (filteredfires.length > 0) {
                    //Si en los incendios filtrados hay mas de uno, manda mensaje de recurso eliminado
                    res.status(200).send("Resource removed!"); //Codigo 200(OK), recurso eliminado
                } 
                else {
                    //Sino, manda codigo de 404 not found.
                    res.status(404).send("Resource not found."); //FIRE DATA NOT FOUND
                }
                
            dbFires.remove({$and: [{"community": community}]},{$and: [{"year": year}]}, (err, fires) =>{
                //elimina el recurso encontrado
            });
        });
    });
        
    //-----------------------------------------------------------------------------------------------
        
    //PUT fires-stats/XXXX/XXXX (Modifica un recurso en un año concreto)
        //De esa manera, si actualizo no cambia datos en otros años de la misma comunidad autónoma
    app.put(BASE_API_URL + '/fires-stats/:community/:year', (req, res) => {
        console.log("UPDATING SPECIFIC RESOURCE: .../:FIELD/:FIELD")
        
        var community = req.params.community;	//Declaramos variable parametro community
        var year = parseInt(req.params.year);	//Declaramos variable parametro year
        
        var update = req.body;	//Declaramos el cuerpo del recurso que será actualizado
        
        
            if((update.community=="") || (update.community!=community) || (update.year=="") || (update.year!=year) || update.length == 0
            || update.total_fire == null || update.forest_area == null || update.non_forest_area == null) {
                //Si los campos community y year estan vacios o no coinciden con los que le paso por parámetro
                //mensaje 400 bad request.
                res.status(400).send("Bad Request! Review the entered data");
                
                console.log("Failed to make request");
            }
        
            else{	//Sino actualiza recurso en la base de datos encontrado por comunidad y año
    
                dbFires.update({"community": community , "year": year}, update, (err, replacedObjects)=>{
                    if(replacedObjects == 0){
                        res.status(404).send("Data not found to modify");
    
                        console.log("No data found to modify");
                       }
                    else{
                        res.status(200).send("Data correctly modified");
                        console.log("Data updated!");
                    }
                });
            }
            
        
    });
    
    //-----------------------------------------------------------------------------------------------
        
    //POST FIRES/XXXX (Esto debe de dar un error de método no permitido)
        //No es posible hacer un post a un recurso determinado
    app.post(BASE_API_URL + '/fires-stats/:community', (req, res) => {
        dbFires.insert([], (err, fires) =>{
            res.sendStatus(405); //Method not allowed
            console.log("Method not allowed");
        });
    });
        
    //-----------------------------------------------------------------------------------------------
    
    //PUT FIRES (Esto debe de dar un error de método no permitido)
        //No es posible hacer un put a una coleccion
    app.put(BASE_API_URL + '/fires-stats', (req, res) => {
        dbFires.update([],{multi:true}, (err,fires)=>{
            res.sendStatus(405); //Method Not Allowed
            console.log("Method not allowed");
        });
    });
    
    //-----------------------------------------------------------------------------------------------
        
    //DELETE FIRES (Borra los recursos de la base de datos)
    app.delete(BASE_API_URL + '/fires-stats', (req, res) => {
        dbFires.find({}, {multi:true}, (err,fires)=>{	
            //Uso el parametro multi para indicar que se aplique a todos los recursos
            if(fires.length==0){
                res.status(404).send("Data not found");
            }
            
        else{
            dbFires.remove({}, {multi:true}, (err, fires) =>{	//Elimino todos los datos
            fires = []; //Creo un array vacio
            //Envio el codigo de respuesta 200(OK) si se ha hecho correctamente el borrado del array.
            res.status(200).send("All resources removed"); 
            
            console.log("All data successfully deleted");
            });
            }
        });
        
    });
        
    //----------------------------------------------------------------------------------------------
        console.log("OK!");
    }
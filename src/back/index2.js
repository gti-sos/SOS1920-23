module.exports = function(app){
    
    app.get('/cool', (request, response) => {
        response.send('<html>' + cool() + '</html>');
    });
}

//Aquí hay que incluir las 3 APIS.
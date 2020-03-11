const express = require("express");

var app = express();		//Servidor web
var fecha = new Date();
var hora_actual = fecha.getHours();
var minu = fecha.getMinutes();

var port = process.env.PORT || 80;

app.get("/time",(request,response)=>{
	response.send("<html>"+hora_actual+":"+minu+"</html>");
});



app.listen(port, () => {
	console.log("server ready");

});
	


console.log("Starting Server......");
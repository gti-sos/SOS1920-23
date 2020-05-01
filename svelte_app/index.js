const cool = require("cool-ascii-faces");
const express = require("express");

var app = express();

var port = process.env.PORT || 12345; //puerto

app.use("/", express.static("./public"));

app.get("/cool", (request, response) => {
    response.send("<html>" + cool() + "</html>");
});

app.listen(port, () => {
    console.log("Server ready on port " + port);
});

console.log("Starting server...");
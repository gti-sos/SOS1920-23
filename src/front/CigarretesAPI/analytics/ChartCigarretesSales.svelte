

<script>
   async function loadGraph(){

        const res = await fetch("api/v2/cigarretes-sales");
        let datos = await res.json();
        let comunidad = datos.filter((datos)=> datos.year===2007).map((datos) => datos.community);
        let venta_de_cigarros = datos.filter((datos) => datos.year===2007).map((datos) => datos.cigarrete_sale);
        let primera_variacion = datos.filter((datos) => datos.year===2007).map((datos) => datos.first_variation);
        let segunda_variacion = datos.filter((datos) => datos.year===2007).map((datos) => datos.second_variation);
            window.onload = function () {

            var chart = new CanvasJS.Chart("chartContainer", {
                animationEnabled: true,
                title:{
                    text: "Crude Oil Reserves vs Production, 2016"
                },	
                axisY: {
                    title: "Billions of Barrels",
                    titleFontColor: "#4F81BC",
                    lineColor: "#4F81BC",
                    labelFontColor: "#4F81BC",
                    tickColor: "#4F81BC"
                },
                axisY2: {
                    title: "Millions of Barrels/day",
                    titleFontColor: "#C0504E",
                    lineColor: "#C0504E",
                    labelFontColor: "#C0504E",
                    tickColor: "#C0504E"
                },	
                toolTip: {
                    shared: true
                },
                legend: {
                    cursor:"pointer",
                    itemclick: toggleDataSeries
                },
                data: [{
                    type: "column",
                    name: "Proven Oil Reserves (bn)",
                    legendText: "Proven Oil Reserves",
                    showInLegend: true, 
                    dataPoints:[
                        { label: comunidad, y:venta_de_cigarros }
                        
                    ]
                },
                {
                    type: "column",	
                    name: "Oil Production (million/day)",
                    legendText: "Oil Production",
                    axisYType: "secondary",
                    showInLegend: true,
                    dataPoints:[
                        { label: comunidad, y:venta_de_cigarros }
                    ]
	}]
            });
chart.render();
}
}

function toggleDataSeries(e) {
	if (typeof(e.dataSeries.visible) === "undefined" || e.dataSeries.visible) {
		e.dataSeries.visible = false;
	}
	else {
		e.dataSeries.visible = true;
	}
	chart.render();
}


    
    </script>
    
    <div id="chartContainer" style="height: 370px; width: 100%;"></div>
    <svelte:head>
    <script src="https://canvasjs.com/assets/script/canvasjs.min.js" on:load="{loadGraph}"></script>
    </svelte:head>
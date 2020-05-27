<script>
async function loadGraph(){


const res = await fetch("api/v2/cigarretes-sales");
let datos = await res.json();
let comunidad = datos.filter((datos)=> datos.year===2007).map((datos) => datos.community);
let venta_de_cigarros = datos.filter((datos) => datos.year===2007).map((datos) => datos.cigarrete_sale);
let primera_variacion = datos.filter((datos) => datos.year===2007).map((datos) => datos.first_variation);
let segunda_variacion = datos.filter((datos) => datos.year===2007).map((datos) => datos.second_variation);
console.log("Graph_NONO");
Highcharts.chart('container', {
    title: {
        text: 'Venta de paquetes de tabaco en 2007'
    },
    xAxis: {
        categories: comunidad
    },
    
    series: [{
        type: 'column',
        name: 'Ventas de paquetes de tabaco',
        data: venta_de_cigarros
    }, {
        type: 'column',
        name: 'Primera variacion',
        data: primera_variacion
    }, {
        type: 'column',
        name: 'Segunda variacion',
        data: segunda_variacion
    }]
});

}
</script>

<svelte:head>
    <script src="https://code.highcharts.com/highcharts.js" on:load={loadGraph} defer></script>
    <script src="https://code.highcharts.com/modules/series-label.js" on:load={loadGraph} defer></script>
    <script src="https://code.highcharts.com/modules/exporting.js" on:load={loadGraph} defer></script>
    <script src="https://code.highcharts.com/modules/export-data.js" on:load={loadGraph} defer></script>
    <script src="https://code.highcharts.com/modules/accessibility.js" on:load="{loadGraph}" defer></script>
</svelte:head>

<main>
    
   
    <figure class="highcharts-figure">
        <div id="container"></div>
        <p class="highcharts-description">
            El gráfico de barras muestra un estudio de millones de paquetes de tabaco comprados en el año 2007 , comparando este año con 2003 (primera variacion) 
            y con 2012 (segunda variacion).
        </p>
    </figure>
</main>

<style>
.highcharts-figure, .highcharts-data-table table {
    min-width: 310px; 
    max-width: 800px;
    margin: 1em auto;
}

#container {
    height: 400px;
}

.highcharts-data-table table {
	font-family: Verdana, sans-serif;
	border-collapse: collapse;
	border: 1px solid #EBEBEB;
	margin: 10px auto;
	text-align: center;
	width: 100%;
	max-width: 500px;
}
.highcharts-data-table caption {
    padding: 1em 0;
    font-size: 1.2em;
    color: #555;
}
.highcharts-data-table th {
	font-weight: 600;
    padding: 0.5em;
}
.highcharts-data-table td, .highcharts-data-table th, .highcharts-data-table caption {
    padding: 0.5em;
}
.highcharts-data-table thead tr, .highcharts-data-table tr:nth-child(even) {
    background: #f8f8f8;
}
.highcharts-data-table tr:hover {
    background: #f1f7ff;
}

</style>
<script>
    import Button from  "sveltestrap/src/Button.svelte";
    import { pop } from "svelte-spa-router";


async function loadGraph(){

 let Datos = [];

        const res = await fetch("api/v2/fires-stats");
        Datos = await res.json();

    
        let comunidad = Datos.map((Datos) => Datos.community + " " + Datos.year);
        let forest = Datos.map((Datos) => Datos.forest_area);
        let noForest = Datos.map((Datos) => Datos.non_forest_area);
        let incendio = Datos.map((Datos) => Datos.total_fire);

    Highcharts.chart('container', {
            chart: {
                type: 'column'
            },
            title: {
                text: 'Área forestal y no forestal por ccaa'
            },
            subtitle: {
                text: 'Fuente: <a href="https://www.mapa.gob.es/es/desarrollo-rural/estadisticas/incendios-decenio-2006-2015_tcm30-511095.pdf">gob.es</a>'
            },
            xAxis: {
            categories: comunidad,
                crosshair: true
            },
            yAxis: {
                min: 0,
                title: {
                    text: 'Área forestal y no forestal por ccaa'
                }
            },
            plotOptions: {
                column: {
                    pointPadding: 0.2,
                    borderWidth: 0
                }
            },
            series: [
            {
                name: 'Nº Incendios',
                type: 'column',
                data: incendio

            },    
            {
                name: 'Área forestal(hctras)',
                type: 'column',
                data: forest

            }, {
                name: 'Área no forestal(hctras)',
                type: 'column',
                data: noForest

            }
            ]
});
    } 


</script>

<svelte:head>
    <script src="https://code.highcharts.com/highcharts.js"></script>
    <script src="https://code.highcharts.com/modules/series-label.js"></script>
    <script src="https://code.highcharts.com/modules/exporting.js"></script>
    <script src="https://code.highcharts.com/modules/export-data.js"></script>
    <script src="https://code.highcharts.com/modules/accessibility.js" on:load="{loadGraph}"></script>
</svelte:head>

<main>
    <figure class="highcharts-figure">
    <div id="container"></div>
    <p class="highcharts-description" style="text-align:center;">
        Gráfica que muestra el número de incendios forestales en el territorio español, áreas forestales y no forestales
        por comunidad autónoma
    </p>


    <h8 class="highcharts-description" >
        <Button outline color="secondary" on:click="{pop}">Atrás &#x21a9;</Button>
    </h8>
    </figure>
</main>
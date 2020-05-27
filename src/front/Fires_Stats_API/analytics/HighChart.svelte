<script>
    import Button from  "sveltestrap/src/Button.svelte";
    import { pop } from "svelte-spa-router";


    async function loadGraph(){
        
        let Datos = [];

        const res = await fetch("api/v2/fires-stats");
        Datos = await res.json();

        let comunidad = Datos.filter((Datos)=> Datos.year===2007).map((Datos) => Datos.community);
        let incendio = Datos.filter((Datos) => Datos.year===2007).map((Datos) => Datos.total_fire);
        


        Highcharts.chart('container', {
    chart: {
        type: 'column'
    },
    title: {
        text: 'Incendios forestales en España 2007'
    },
    subtitle: {
        text: 'Fuente: <a href="https://www.mapa.gob.es/es/desarrollo-rural/estadisticas/incendios-decenio-2006-2015_tcm30-511095.pdf">gob.es</a>'
    },
    xAxis: {
        categories: comunidad,
        crosshair: true,
        
        type: 'category',
        labels: {
            rotation: -45,
            style: {
                fontSize: '13px',
                fontFamily: 'Verdana, sans-serif'
            }
        }
        
    },
    yAxis: {
        min: 0,
        title: {
            text: 'Número de incendios'
        }
    },
    legend: {
        enabled: false
    },
    tooltip: {
        shared: true
    },
    series: [{
        name: 'Nº Incendios',
        type: 'column',
        data: incendio
        
    }]
});
    }

async function forest_areas(){

 let Datos = [];

        const res = await fetch("api/v2/fires-stats");
        Datos = await res.json();

    
        let comunidad = Datos.filter((Datos)=> Datos.year===2007).map((Datos) => Datos.community);
        let forest = Datos.filter((Datos) => Datos.year===2007).map((Datos) => Datos.forest_area);
        let noForest = Datos.filter((Datos) => Datos.year===2007).map((Datos) => Datos.non_forest_area);

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
            tooltip: {
                headerFormat: '<span style="font-size:10px">{point.key}</span><table>',
                pointFormat: '<tr><td style="color:{series.color};padding:0">{series.name}: </td>' +
                    '<td style="padding:0"><b>{point.y:.1f} hectáreas</b></td></tr>',
                footerFormat: '</table>',
                shared: true,
                useHTML: true
            },
            plotOptions: {
                column: {
                    pointPadding: 0.2,
                    borderWidth: 0
                }
            },
            series: [{
                name: 'Área forestal',
                type: 'column',
                data: forest

            }, {
                name: 'Área no forestal',
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
    <p class="highcharts-description">
        Gráfica que muestra el número de incendios forestales en el territorio español durante el año 2007
        por comunidad autónoma
    </p>
    <h5 class="highcharts-description">Comprueba las zonas forestales y no forestales por comunidad autónoma en ese año: 
        <Button  on:click={forest_areas}>Ver Área Forestal</Button>
    </h5>

    <h5 class="highcharts-description">Ver número de incendios totales
        <Button on:click={loadGraph}>Ver incendios</Button>
    </h5>

    <h8 class="highcharts-description" >
        <Button outline color="secondary" on:click="{pop}">Atrás &#x21a9;</Button>
    </h8>
    </figure>
</main>
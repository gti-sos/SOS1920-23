<script>
	import { pop } from "svelte-spa-router";
    import Button from "sveltestrap/src/Button.svelte";

    
async function loadGraph(){
    

    let Datos = [];

        const res = await fetch("api/v2/fires-stats");
        Datos = await res.json();

        let items = ["Incendios Totales", "Área Forestal", "Área no Forestal", "Casos", "Muertes", "Recuperados"];
        let valores = [];
        let valor ={};
        
        //Extraigo de mi api los datos de cada comunidad autónoma en 2007
        Datos.forEach((data) =>{
            if(data.year==2007){
                valor = {
                    name: data.community + " (" + data.year + ")",
                    data: [data.total_fire, data.forest_area, data.non_forest_area, 0,0]
                }
                valores.push(valor);
            }
        });
       
        //Extraigo los datos de la API externa, en este caso una api acerca del coronavirus 
        //realizada por alguien y pública en su repositorio GitHub.
        const resData = await fetch("https://coronavirus-19-api.herokuapp.com/countries");
       
        let DataCanciones = await resData.json();
                

        var cont = 0;
        DataCanciones.forEach((data2)=>{
            if(cont<=10){//Muestro los 10 primeros, el de la posición 0 es un cúmulo de datos en el mundo
            valor = {
                name: data2.country,
                data: [0,0,0,data2.cases, data2.deaths, data2.recovered]
            }
            valores.push(valor);
            cont++;
            }
        });

            console.log("Loading Chart...");

        
    
    Highcharts.chart('container', {
        chart: {
            type: 'column'
        },
        title: {
            text: 'Integración API Externa coronavirus con Firesstats'
        },
        subtitle: {
            text: '<a href="https://github.com/javieraviles/covidAPI">Fuente</a> '
        },
        xAxis: {
            categories: items,
            crosshair: true,
            tickmarkPlacement: 'on',
            type: 'category',
            
        },
        yAxis: {
            min: 0,
            title: {
                text: 'Cantidades Incendios, Áreas forestales y Cantidad Contagios, Muertes y Recuperaciones'
            },
            labels: {
                formatter: function(){
                    return this.value;
                }
            }
        },
        tooltip: {
        headerFormat: '<span style="font-size:10px">{point.key}</span><table>',
        pointFormat: '<tr><td style="color:{series.color};padding:0">{series.name}: </td>' +
            '<td style="padding:0"><b>{point.y:.1f} </b></td></tr>',
        footerFormat: '</table>',
        shared: true,
        useHTML: true
        },
        plotOptions: {
            column:{
                pointPadding: 0.2,
                borderWidth: 0
            }
        },
        legend: {
            enabled: true
        },

        series: valores
    });
    
    

    
}
    


</script>

<svelte:head>
    <script src="https://code.highcharts.com/highcharts.js" on:load="{loadGraph}" defer></script>
    <script src="https://code.highcharts.com/modules/series-label.js" on:load="{loadGraph}" defer></script>
    <script src="https://code.highcharts.com/modules/exporting.js" on:load="{loadGraph}" defer></script>
    <script src="https://code.highcharts.com/modules/export-data.js" on:load="{loadGraph}" defer></script>
    <script src="https://code.highcharts.com/modules/accessibility.js" on:load="{loadGraph}" defer></script>
</svelte:head>
<main>
<Button outline color="secondary" on:click="{pop}">Atrás &#x21a9;</Button>
		<figure class="highcharts-figure">
            <div id="container"></div>
                <p class="highcharts-description">
                        Esta gráfica muestra informacion acerca de la cantidad de incendios forestales por ccaa en el territorio español, junto con sus áreas forestales en 2007 e información acerca de los casos de coronavirus, recuperaciones y muertes en algunos países del mundo(limitado a 10)
                </p>	
        </figure>
</main>
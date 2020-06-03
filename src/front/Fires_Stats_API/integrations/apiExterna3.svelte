<script>
	import { pop } from "svelte-spa-router";
    import Button from "sveltestrap/src/Button.svelte";
    import Table from "sveltestrap/src/Table.svelte";
    import  { onMount } from "svelte";
    

    onMount(getPopulation);

    let populations = [];

    async function getPopulation(){
        console.log("Fetching population...");
        const resData = await fetch("https://restcountries-v1.p.rapidapi.com/all", {
        "method" : "GET",
        "headers":{
        "x-rapidapi-host": "restcountries-v1.p.rapidapi.com",
	    "x-rapidapi-key": "1ffb76c03dmsh3fb87e4dcd08115p1d9482jsn63e6275c09b1",
        }
        });
        if(resData.ok){
            console.log("OK");
            const json = await resData.json();
            populations = json;
            console.log("Received " + populations.length + " population data");
        } 

        else{
            console.log("Error");
        }
    }
async function loadGraph(){
    

    let Datos = [];

        const res = await fetch("api/v2/fires-stats");
        Datos = await res.json();

        let ejeX = ["Incendios_Totales", "Área Forestal", "Área no Forestal", "Población", "Área"];
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
       
        //Hago el fetch a la API externa, en este caso de RapidAPI
        const resData = await fetch("https://restcountries-v1.p.rapidapi.com/all", {
        "method" : "GET",
        "headers":{
        "x-rapidapi-host": "restcountries-v1.p.rapidapi.com",
	"x-rapidapi-key": "1ffb76c03dmsh3fb87e4dcd08115p1d9482jsn63e6275c09b1",
        }
        });
        let DataCiudades = await resData.json();
          

        var cont = 0;
        DataCiudades.forEach((data2)=>{
            if(cont<=10){//Muestro sólo 10 ciudades para que quepa en la gráfica
            valor = {
                name: data2.name,
                data: [0,0,0,data2.population, data2.area]
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
            text: 'Integración API Externa Población Países con Fires Stats'
        },
        subtitle: {
            text: '<a href="https://rapidapi.com/apilayernet/api/rest-countries-v1?endpoint=53aa5a08e4b0a705fcc323a6">Fuente</a>'
        },
        xAxis: {
            categories: ejeX,
            crosshair: true,
            tickmarkPlacement: 'on',
            type: 'category',
            
        },
        yAxis: {
            min: 0,
            title: {
                text: 'Cantidades Incendios, Áreas forestales y Población'
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
		{#await getPopulation}
            Loading population of countries ...
        {:then getPopulation}
        <figure class="highcharts-figure">
            <div id="container"></div>
                <p class="highcharts-description">
                        Esta gráfica muestra informacion acerca de la cantidad de incendios forestales por ccaa en el territorio español, junto con sus áreas forestales en 2007 y la población y área en algunos países.
                </p>	
        </figure>
        <p>La gráfica sólo muestra 10 de esos países, a continuación puede consultar estos datos en la tabla</p>
        <Table bordered>
			<thead>
				<tr>
					<th>País</th>
					<th>Población</th>
					<th>Área</th>

				</tr>
			</thead>
			<tbody>
				{#each populations as population}
				<tr>
                    <td>{population.name}</td>
                    <td>{population.population}</td>
                    <td>{population.area}</td>
                    

				</tr>
				{/each}
			</tbody>
		</Table>
	{/await}

</main>
<Button outline color="secondary" on:click="{pop}">Atrás &#x21a9;</Button>
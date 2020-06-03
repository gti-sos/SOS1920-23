<script>
    import  { onMount } from "svelte";
	import { pop } from "svelte-spa-router";
	import Table from "sveltestrap/src/Table.svelte";
    import Button from "sveltestrap/src/Button.svelte";


    const url = "https://sos1920-09.herokuapp.com/api/v3/plugin-vehicles-stats/";

    onMount(getPluginVehicles);

    let plugins=[];

async function getPluginVehicles(){
        console.log("Fetching plugin vehicles..");
        const res = await fetch(url);
        if(res.ok){
            console.log("ok");
            const json = await res.json();
            plugins = json;
            console.log("Received "+ plugins.length + " plugin vehicles");
        }

        else{
            console.log("Error");
        }
    }
    

async function loadGraph(){
        
        let Datos = [];

        const res = await fetch("api/v2/fires-stats");
        Datos = await res.json();

        let ejeX = ["Incendios Totales", "Área Forestal", "Área no Forestal", "Cúmulo de Ventas", "Ventas Anuales"];
        let valores = [];
        let valor ={};
        
        Datos.forEach((data) =>{
            if(data.year==2007){
                valor = {
                    name: data.community + " (" + data.year + ")",
                    data: [data.total_fire, data.forest_area, data.non_forest_area, 0,0]
                }
                valores.push(valor);
            }
        });
        //Extraigo los datos en json de la API Plugin Stats Vehicles
        let Datos2=[];
        const res2 = await fetch(url);
        Datos2 = await res2.json();

    Datos2.forEach((data2)=>{
        valor = {
            name: data2.country + " (" + data2.year + ")",
            data: [0,0,0,data2['pev-stock'], data2['annual-sale']]
        }
        valores.push(valor);
    });

        console.log("Loading Chart...");

        
    
    Highcharts.chart('container', {
        chart: {
            type: 'column'
        },
        title: {
            text: 'Integración API PluginStatsVehicles(Grupo 9) con FiresStats'
        },
        subtitle: {
            text: '<a href="https://sos1920-09.herokuapp.com/api/v3/plugin-vehicles-stats/">Fuente</a>'
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
                text: 'Cantidades Incendios, Áreas forestales y Número de Ventas(Acumulación y Anuales)'
            },
            labels: {
                formatter: function(){
                    return this.value;
                }
            }
        },
        
        tooltip: {
        headerFormat: '<span style="font-size:10px">{point.key}</span><table>',
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
	{#await getPluginVehicles}
		Loading plugin-vehicles-stats ...
	{:then getPluginVehicles}
		<figure class="highcharts-figure">
            <div id="container"></div>
                <p class="highcharts-description" style="text-align:center;">
                        Esta gráfica muestra informacion acerca de la cantidad de incendios forestales por ccaa en el territorio español, junto con sus áreas forestales en 2007 y sobre las ventas acumuladas por países y ventas anuales de coches eléctricos
                </p>	
        </figure>
        
		<Table bordered>
			<thead>
				<tr>
					<th>Pais</th>
					<th>Año</th>
					<th>Ventas Acumuladas</th>
					<th>Ventas anuales</th>
                    <th>Ventas cada 1000 personas</th>

				</tr>
			</thead>
			<tbody>
				{#each plugins as plugin}
				<tr>
                    <td>{plugin.country}</td>
                    <td>{plugin.year}</td>
                    <td>{plugin['pev-stock']}</td>
                    <td>{plugin['annual-sale']}</td>
                    <td>{plugin['cars-per-1000']}</td>

				</tr>
				{/each}
			</tbody>
		</Table>
	{/await}


	
</main>

 <Button outline color="secondary" on:click="{pop}">Atrás &#x21a9;</Button>


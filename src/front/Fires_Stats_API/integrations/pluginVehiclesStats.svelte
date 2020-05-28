<script>
    import  { onMount } from "svelte";
	import { pop } from "svelte-spa-router";
	import Table from "sveltestrap/src/Table.svelte";
    import Button from "sveltestrap/src/Button.svelte";


    const url = "https://sos1920-09.herokuapp.com/api/v3/plugin-vehicles-stats/";

    onMount(getPluginVehicles);

    let plugins=[];
    let countries = [];
    let pevStock = [];
    let annualSale = [];
    let comunidades = [];

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

        let items = ["Incendios_Totales", "Área Forestal", "Área no Forestal", "Cumulo_Ventas", "Ventas_Anuales"];
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
            text: 'Integración API PluginStatsVehicles con FiresStats'
        },
        subtitle: {
            text: ''
        },
        xAxis: {
            categories: items,
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
                text: ''
            },
            labels: {
                formatter: function(){
                    return this.value;
                }
            }
        },
        legend: {
            enabled: false
        },
        tooltip: {
            shared: true
        },
        series: valores
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

	{#await getPluginVehicles}
		Loading plugin-vehicles-stats ...
	{:then getPluginVehicles}
		<figure class="highcharts-figure">
            <div id="container"></div>
                <p class="highcharts-description">
                        Esta API muestra información acerca de las ventas acumuladas por países y ventas anuales de coches eléctricos a nivel internacional
                </p>	
        </figure>
        
		<Table bordered>
			<thead>
				<tr>
					<th>Pais</th>
					<th>Año</th>
					<th>Ventas Acumuladas</th>
					<th>Ventas anuales</th>

				</tr>
			</thead>
			<tbody>
				{#each plugins as plugin}
				<tr>
                    <td>{plugin.country}</td>
                    <td>{plugin.year}</td>
                    <td>{plugin['pev-stock']}</td>
                    <td>{plugin['annual-sale']}</td>

				</tr>
				{/each}
			</tbody>
		</Table>
	{/await}
	
</main>

 <Button outline color="secondary" on:click="{pop}">Atrás &#x21a9;</Button>
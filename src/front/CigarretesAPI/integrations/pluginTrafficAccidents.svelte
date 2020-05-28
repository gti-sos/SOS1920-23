<script>

import  { onMount } from "svelte";
import { pop } from "svelte-spa-router";
import Table from "sveltestrap/src/Table.svelte";
import Button from "sveltestrap/src/Button.svelte";


    const url = "https://sos1920-04.herokuapp.com/api/v1/traffic_accidents";

    onMount(getPluginAccidents);
    let plugins = [];
    let province = [];
    let year = [];
    let AccidentWithVictims = [];
    let MortalAccident = [];
    

    async function getPluginAccidents(){

        console.log("Fetching plugin traffic_accidents..");
        const res = await fetch(url);
        if(res.ok){
            console.log("ok");
            const json = await res.json();
            plugins = json;
            console.log("Received "+ plugins.length + " plugin accidents");
        }

        else{
            console.log("Error");
        }
    }
    
    async function loadGraph(){


   

    const res1 = await fetch("api/v2/cigarretes-sales");
    let datos2 = await res1.json();
    let comunidad = datos2.filter((datos2)=> datos2.year===2007).map((datos2) => datos2.community);
    let venta_de_cigarros = datos2.filter((datos2) => datos2.year===2007).map((datos2) => datos2.cigarrete_sale);
    let primera_variacion = datos2.filter((datos2) => datos2.year===2007).map((datos2) => datos2.first_variation);
    let segunda_variacion = datos2.filter((datos2) => datos2.year===2007).map((datos2) => datos2.second_variation);
    const res = await fetch(url);
    let datos = await res.json();
    let provincias = datos.filter((datos) => datos.community === datos.province).map((datos) => datos.province);
    let accidentesV = datos.filter((datos) => datos.community === datos.province).map((datos) => datos.accidentWithVictims);
    let accidentesM = datos.filter((datos) => datos.community === datos.province).map((datos) => datos.mortalAccident);
    
    console.log("Graph_NONO");
    Highcharts.chart('container', {
        title: {
            text: 'Accidentes de tráfico'
        },
        xAxis: {
            categories: comunidad
        },
        
        
        series: [{
            type: 'column',
            name: 'Accidentes con víctimas',
            data: accidentesV
        }, {
            type: 'column',
            name: 'Accidentes mortales',
            data: accidentesM
        },{
            type: 'column',
            name: 'Venta de cigarros',
            data: venta_de_cigarros
        },
        {
            type: 'column',
            name: 'Primera variacion ',
            data: primera_variacion
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

	{#await getPluginAccidents}
		Loading plugin-accidents-stats ...
	{:then getPluginAccidents}
		<figure class="highcharts-figure">
            <div id="container"></div>
                <p class="highcharts-description">
                        Esta API muestra información sobre los diversos accidentes en provincias españolas.
                </p>	
        </figure>
       
        
		<Table bordered>
			<thead>
				<tr>
					<th>Provincia</th>
					<th>Año</th>
					<th>Accidentes con víctimas</th>
                    <th>Accidentes mortales</th>
                    

				</tr>
			</thead>
			<tbody>
				{#each plugins as plugin}
				<tr>
                    <td>{plugin.province}</td>
                    <td>{plugin.year}</td>
                    <td>{plugin['accidentWithVictims']}</td>
                    <td>{plugin['mortalAccident']}</td>
                    


				</tr>
				{/each}
			</tbody>
		</Table>
	{/await}
	
</main>

 <Button outline color="secondary" on:click="{pop}">Atrás &#x21a9;</Button>
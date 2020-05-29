<script>

import  { onMount } from "svelte";
import { pop } from "svelte-spa-router";
import Table from "sveltestrap/src/Table.svelte";
import Button from "sveltestrap/src/Button.svelte";


    const url = "https://sos1920-04.herokuapp.com/api/v1/traffic_accidents";

    onMount(getPluginAccidents);
    let plugins = [];
    

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
        const res = await fetch(url);
        let datos = await res.json();
        let ejeX = ["Accidentes con víctimas","Accidentes mortales","Venta de paquetes de tabaco","Primera variacion"];
        let valores = [];
        let valor = {};
        datos.forEach((d) => {
            valor={
                name: d.province,
                data: [d.accidentWithVictims,d.mortalAccident,0,0]
            }
            valores.push(valor);
        });
        datos2.forEach((d2) => {
            if(d2.year==2007){
            valor={
                name: d2.community,
                data:[0,0,d2.cigarrete_sale,d2.first_variation]
            }
            valores.push(valor);
        }
        });
    
        
        
        console.log("Graph_NONO");
        Highcharts.chart('container', {
    chart: {
        type: 'column'
    },
    title: {
        text: 'Integración grupo 4'
    },
    
    xAxis: {
        categories:ejeX,
        crosshair: true
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
        column: {
            pointPadding: 0.2,
            borderWidth: 0
        }
    },
    series:valores
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
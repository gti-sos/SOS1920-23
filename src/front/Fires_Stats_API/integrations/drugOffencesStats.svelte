<script>
    import  { onMount } from "svelte";
	import { pop } from "svelte-spa-router";
	import Table from "sveltestrap/src/Table.svelte";
    import Button from "sveltestrap/src/Button.svelte";

    const url = "https://sos1920-12.herokuapp.com/api/v1/drug_offences";

    onMount(getDrugOffences);

    let offences = [];

async function getDrugOffences(){
    console.log("Fetching drugs offences...");
    const res = await fetch(url);
    if(res.ok){
        console.log("ok");
        const json = await res.json();
        offences = json;
        console.log("Received " + offences.length + " drgus offences stats");
    }

    else{
        console.log("Error");
    }
}

async function loadGraph(){
        
        let Datos = [];
        //Extraigo los datos en json de mi API
        const res = await fetch("api/v2/fires-stats");
        Datos = await res.json();

        let ejeX = ["Incendios_Totales", "Área Forestal", "Área no Forestal", "Delitos relacionados con Cannabis", "Delitos relacionados con el uso", "Delitos relacionados con el tráfico"];
        let valores = [];
        let valor ={};
        
        Datos.forEach((data) =>{
            if(data.year==2007){
                valor = {
                    name: data.community + " (" + data.year + ")",
                    data: [data.total_fire, data.forest_area, data.non_forest_area, 0,0,0]
                }
                valores.push(valor);
            }
        });
        //Extraigo los datos en json de la API Drug Offences
        let Datos2=[];
        const res2 = await fetch(url);
        Datos2 = await res2.json();

    Datos2.forEach((data2)=>{
        valor = {
            name: data2.country + " (" + data2.year + ")",
            data: [0,0,0,data2.cannabis_offences, data2.offences_use, data2.offences_supply]
        }
        valores.push(valor);
    });

        console.log("Loading Chart...");

        
    
    Highcharts.chart('container', {
        chart: {
            type: 'column'
        },
        title: {
            text: 'Integración API Drug Offences(Grupo 12) con FiresStats'
        },
        subtitle: {
            text: '<a href="https://sos1920-12.herokuapp.com/api/v1/drug_offences">Fuente</a>'
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
                text: 'Cantidades Incendios, Áreas forestales y Cantidad delitos por Grogas'
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

	{#await getDrugOffences}
		Loading drug offences stats ...
	{:then getDrugOffences}
		<figure class="highcharts-figure">
            <div id="container"></div>
                <p class="highcharts-description" style="text-align:center;">
                        Esta gráfica muestra informacion acerca de la cantidad de incendios forestales por ccaa en el territorio español, junto con sus áreas forestales en 2007 y los delitos relacionados con drogas(cannbis) y el tráfico de drogas en diferentes países
                </p>	
        </figure>
        
		<Table bordered>
			<thead>
				<tr>
					<th>Pais</th>
					<th>Año</th>
					<th>Delitos relacionados con Cannabis</th>
					<th>Delitos relacionados con el uso</th>
                    <th>Delitos relacionados con el tráfico</th>

				</tr>
			</thead>
			<tbody>
				{#each offences as offence}
				<tr>
                    <td>{offence.country}</td>
                    <td>{offence.year}</td>
                    <td>{offence.cannabis_offences}</td>
                    <td>{offence.offences_use}</td>
                    <td>{offence.offences_supply}</td>

				</tr>
				{/each}
			</tbody>
		</Table>
	{/await}
	
</main>

 <Button outline color="secondary" on:click="{pop}">Atrás &#x21a9;</Button>
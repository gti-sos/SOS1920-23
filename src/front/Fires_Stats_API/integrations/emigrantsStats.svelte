<script>
    import  { onMount } from "svelte";
	import { pop } from "svelte-spa-router";
	import Table from "sveltestrap/src/Table.svelte";
    import Button from "sveltestrap/src/Button.svelte";

    const url = "https://sos1920-01.herokuapp.com/api/v2/emigrants-stats";

    onMount(getEmigrantsStats);

    let emigrants = [];

    async function getEmigrantsStats(){
        console.log("Fetching emigrants stats...");
        const res = await fetch(url);
        if(res.ok){
            console.log("ok");
            const json = await res.json();
            emigrants = json;
            console.log("Received " + emigrants.length + " emigrants stats");
        }

        else{
            console.log("error");
        }
    }

    async function loadGraph(){
        
        let Datos = [];

        const res = await fetch("api/v2/fires-stats");
        Datos = await res.json();

        let ejeX = ["Incendios_Totales", "Área Forestal", "Área no Forestal", "Emigraciones Hombres", "Emigraciones Mujeres", "Emigraciones Totales"];
        let valores = [];
        let valor ={};
        //Extraigo de mi api los datos de cada comunidad autónoma en 2007
        Datos.forEach((data) =>{
            if(data.year==2007){
                valor = {
                    name: data.community + " (" + data.year + ")",
                    data: [data.total_fire, data.forest_area, data.non_forest_area, 0,0,0]
                }
                valores.push(valor);
            }
        });
        //Extraigo los datos de la API Emigrants-Stats
        let Datos2=[];
        const res2 = await fetch(url);
        Datos2 = await res2.json();

    Datos2.forEach((data2)=>{
        valor = {
            name: data2.country + " (" + data2.year + ")",
            data: [0,0,0,data2.em_man, data2.em_woman, data2.em_woman]
        }
        valores.push(valor);
    });

        console.log("Loading Chart...");

        
    
    Highcharts.chart('container', {
        chart: {
            type: 'column'
        },
        title: {
            text: 'Integración API Emigrants Stats(Grupo 1) con FiresStats'
        },
        subtitle: {
            text: '<a href="https://sos1920-01.herokuapp.com/api/v2/emigrants-stats">Fuente</a>'
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
                text: 'Cantidades Incendios, Áreas forestales y Número de emigrantes'
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
        {#await getEmigrantsStats}
            Loading plugin emigrants stats...
	{:then getEmigrantsStats}
		<figure class="highcharts-figure">
            <div id="container"></div>
                <p class="highcharts-description" style="text-align:center;">
                        Esta gráfica muestra informacion acerca de la cantidad de incendios forestales por ccaa en el territorio español, junto con sus áreas forestales en 2007 y sobre las migraciones en cada país de hombres y mujeres en diferentes años
                </p>	
        </figure>
        
		<Table bordered>
			<thead>
				<tr>
					<th>Pais</th>
					<th>Año</th>
					<th>Hombres</th>
					<th>Mujeres</th>
                    <th>Total</th>

				</tr>
			</thead>
			<tbody>
				{#each emigrants as emigrant}
				<tr>
                    <td>{emigrant.country}</td>
                    <td>{emigrant.year}</td>
                    <td>{emigrant.em_man}</td>
                    <td>{emigrant.em_woman}</td>
                    <td>{emigrant.em_totals}</td>

				</tr>
				{/each}
			</tbody>
		</Table>
	{/await}
	
</main>

 <Button outline color="secondary" on:click="{pop}">Atrás &#x21a9;</Button>

<script>
    import  { onMount } from "svelte";
	import { pop } from "svelte-spa-router";
	import Table from "sveltestrap/src/Table.svelte";
    import Button from "sveltestrap/src/Button.svelte";

    

    onMount(getNotHospitalized);

    let hospitalizeds = [];

async function getNotHospitalized(){
    console.log("Fetching not hospitalized stats...");
    const res = await fetch("/api/v2/not-hospitalized-stats");
    if(res.ok){
        console.log("ok");
        const json = await res.json();
        hospitalizeds = json;
        console.log("Received " + hospitalizeds.length + " not hospitalized stats");
    }

    else{
        console.log("Error");
    }
}
//Api mostrada obteniendo los datos mediante proxy
async function loadGraph(){
        
        let Datos = [];

        const res = await fetch("api/v2/fires-stats");
        Datos = await res.json();

        let items = ["Incendios_Totales", "Área Forestal", "Área no Forestal", "Total", "Interurbanos", "Urbanos"];
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
       
        let Datos2=[];
        const res2 = await fetch("/api/v2/not-hospitalized-stats");
        Datos2 = await res2.json();

    Datos2.forEach((data2)=>{
        valor = {
            name: data2.province + " (" + data2.year + ")",
            data: [0,0,0,data2.total, data2.interurban, data2.urban]
        }
        valores.push(valor);
    });

        console.log("Loading Chart...");

        
    
    Highcharts.chart('container', {
        chart: {
            type: 'column'
        },
        title: {
            text: 'Integración API Not Hospitalized Stats con FiresStats'
        },
        subtitle: {
            text: ''
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
<Button outline color="secondary" on:click="{pop}">Atrás &#x21a9;</Button>
	{#await getNotHospitalized}
		Loading not hospitalized stats ...
	{:then getNotHospitalized}
		<figure class="highcharts-figure">
            <div id="container"></div>
                <p class="highcharts-description">
                        Esta API muestra información acerca de victimas de accidentes no hospitalizadas en las provincias de España.
                </p>	
        </figure>
        
		<Table bordered>
			<thead>
				<tr>
					<th>Provincia</th>
					<th>Año</th>
					<th>Total</th>
					<th>Interurbano</th>
                    <th>Urbano</th>

				</tr>
			</thead>
			<tbody>
				{#each hospitalizeds as hospitalized}
				<tr>
                    <td>{hospitalized.province}</td>
                    <td>{hospitalized.year}</td>
                    <td>{hospitalized.total}</td>
                    <td>{hospitalized.interurban}</td>
                    <td>{hospitalized.urban}</td>

				</tr>
				{/each}
			</tbody>
		</Table>
	{/await}
	
</main>

 <Button outline color="secondary" on:click="{pop}">Atrás &#x21a9;</Button>
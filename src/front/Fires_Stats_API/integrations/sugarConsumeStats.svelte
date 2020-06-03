<script>
    import  { onMount } from "svelte";
	import { pop } from "svelte-spa-router";
	import Table from "sveltestrap/src/Table.svelte";
    import Button from "sveltestrap/src/Button.svelte";

    const url = "https://sos1920-30.herokuapp.com/api/v3/sugarconsume";

    onMount(getSugarConsume);

    let consumes = [];

async function getSugarConsume(){
    console.log("Fetching sugar consume...");
    const res = await fetch(url);
    if(res.ok){
        console.log("ok");
        const json = await res.json();
        consumes = json;
        console.log("Received " + consumes.length + " sugar consumes");
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

        let ejeX = ["Incendios_Totales", "Área Forestal", "Área no Forestal", "Consumo de Azúcar", "Población"];
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
        //Extraigo los datos json de la API Sugar Consume 
        let Datos2=[];
        const res2 = await fetch(url);
        Datos2 = await res2.json();

    Datos2.forEach((data2)=>{
        valor = {
            name: data2.place + " (" + data2.year + ")",
            data: [0,0,0,data2.sugarconsume, data2.poblacion]
        }
        valores.push(valor);
    });

        console.log("Loading Chart...");

        
    
    Highcharts.chart('container', {
        chart: {
            type: 'column'
        },
        title: {
            text: 'Integración API Sugar Consume(Grupo 30) con FiresStats'
        },
        subtitle: {
            text: '<a href="https://sos1920-30.herokuapp.com/api/v3/sugarconsume">Fuente</a>'
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
                text: 'Cantidades Incendios, Áreas forestales y Cantidad de Azúcar Consumida y población'
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
	{#await getSugarConsume}
		Loading sugar consume stats...
	{:then getSugarConsume}
		<figure class="highcharts-figure">
            <div id="container"></div>
                <p class="highcharts-description" style="text-align:center;">
                        Esta gráfica muestra informacion acerca de la cantidad de incendios forestales por ccaa en el territorio español, junto con sus áreas forestales en 2007 y el consumo de azúcar en varios países así como la población en ellos 
                </p>	
        </figure>
        
		<Table bordered>
			<thead>
				<tr>
					<th>Pais</th>
					<th>Año</th>
					<th>Consumo azúcar</th>
					<th>Porcentaje diabetes</th>
                    <th>Poblacion</th>

				</tr>
			</thead>
			<tbody>
				{#each consumes as consume}
				<tr>
                    <td>{consume.place}</td>
                    <td>{consume.year}</td>
                    <td>{consume.sugarconsume}</td>
                    <td>{consume.pg_diabetes}</td>
                    <td>{consume.poblacion}</td>

				</tr>
				{/each}
			</tbody>
		</Table>
	{/await}
	
</main>

 <Button outline color="secondary" on:click="{pop}">Atrás &#x21a9;</Button>
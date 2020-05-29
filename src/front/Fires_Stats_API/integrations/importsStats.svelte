<script>
    import  { onMount } from "svelte";
	import { pop } from "svelte-spa-router";
	import Table from "sveltestrap/src/Table.svelte";
    import Button from "sveltestrap/src/Button.svelte";

    

    onMount(getImports);

    let imports = [];

    async function getImports(){
        console.log("Fetching imports...");
        const res = await fetch("api/v2/imports");
        if(res.ok){
            console.log("ok");
            const json = await res.json();
            imports = json;
            console.log("Received " + imports.length + " imports stats");
        }

        else{
            console.log("Error");
        }
    }
//Gráfico de api Imports, hecho con proxy
async function loadGraph(){
        
        let Datos = [];

        const res = await fetch("api/v2/fires-stats");
        Datos = await res.json();

        let items = ["Incendios_Totales", "Área Forestal", "Área No forestal", "Malta", "Cebada","Avena", "Residuos", "Alcohol"];
        let valores = [];
        let valor ={};
        
        Datos.forEach((data) =>{
            if(data.year==2007){
                valor = {
                    name: data.community + " (" + data.year + ")",
                    data: [data.total_fire, data.forest_area, data.non_forest_area, 0,0,0,0,0]
                }
                valores.push(valor);
            }
        });
       
        let DatosExt=[];
        const res2 = await fetch("api/v2/imports");
        DatosExt = await res2.json();

    DatosExt.forEach((data2)=>{
        if(data2.year==2007){ //Lo limito a 2007 por la cantidad de datos que hay
            valor = {
                name: data2.country + " (" + data2.year + ")",
                data: [0,0,0, data2.gdamalt,data2.gdabarley, data2.gdaoat, data2.gdawaste, data2.gdaethylalcohol]
            }
        valores.push(valor);
        }
    });

        console.log("Loading Chart...");

        
    
    Highcharts.chart('container', {
        chart: {
            type: 'column'
        },
        title: {
            text: 'Integración API Imports EEUU con FiresStats'
        },
        subtitle: {
            text: ''
        },
        xAxis: {
            categories: items,
            crosshair: true,
            
            type: 'category',
            labels: {
                
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
        headerFormat: '<span style="font-size:10px">{point.key}</span><table>',
        pointFormat: '<tr><td style="color:{series.color};padding:0">{series.name}: </td>' +
            '<td style="padding:0"><b>{point.y:.1f} </b></td></tr>',
        footerFormat: '</table>',
        shared: true,
        useHTML: true
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
	{#await getImports}
		Loading imports stats ...
	{:then getImports}
		<figure class="highcharts-figure">
            <div id="container"></div>
                <p class="highcharts-description">
                        Esta gráfica muestra información acerca de los incendios forestales en el territorio español, junto con sus áreas forestales y no forestales y con las importaciones a EEUU de diferentes productos en 2007.
                </p>	
        </figure>
        
		<Table bordered>
			<thead>
				<tr>
					<th>Pais</th>
					<th>Año</th>
					<th>Malta</th>
					<th>Cebada</th>
                    <th>Avena</th>
                    <th>Residuos</th>
                    <th>Alcohol</th>
                    

				</tr>
			</thead>
			<tbody>
				{#each imports as import1}
				<tr>
                    <td>{import1.country}</td>
                    <td>{import1.year}</td>
                    <td>{import1.gdamalt}</td>
                    <td>{import1.gdabarley}</td>
                    <td>{import1.gdaoat}</td>
                    <td>{import1.gdawaste}</td>
                    <td>{import1.gdaethylalcohol}</td>

				</tr>
				{/each}
			</tbody>
		</Table>
	{/await}
	
</main>

<Button outline color="secondary" on:click="{pop}">Atrás &#x21a9;</Button>
<script>
    import  { onMount } from "svelte";
	import { pop } from "svelte-spa-router";
	import Table from "sveltestrap/src/Table.svelte";
    import Button from "sveltestrap/src/Button.svelte";

    const url = "https://sos1920-05.herokuapp.com/api/v1/books-exports";

    onMount(getBookExports);

    let book_exports =[];

async function getBookExports(){
    console.log("Fetching books exports...");
    const res = await fetch(url);
    if(res.ok){
        console.log("ok");
        const json = await res.json();
        book_exports = json;
        console.log("Received " + book_exports.length + " books exports");
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

        let ejeX = ["Incendios_Totales", "Área Forestal", "Área no Forestal", "Exportación Libros", "Exportación Editorial", "Exportación Sector Gráfico"];
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
        //Extraigo los datos en Json de la API Book Sports
        let Datos2=[];
        const res2 = await fetch(url);
        Datos2 = await res2.json();

        Datos2.forEach((data2)=>{
            valor = {
                name: data2.country + " (" + data2.year + ")",
                data: [0,0,0,data2.exp_book,data2.exp_editorial, data2.exp_graphic_sector]
            }
            valores.push(valor);
        });

        console.log("Loading Chart...");

        
    
    Highcharts.chart('container', {
        chart: {
            type: 'column'
        },
        title: {
            text: 'Integración API Book Exports(Grupo 5) con FiresStats'
        },
        subtitle: {
            text: '<a href="https://sos1920-05.herokuapp.com/api/v1/books-exports">Fuente</a>'
        },
        xAxis: {
            categories: ejeX,
            crosshair: true,
            tickmarkPlacement: 'on',
            type: 'category',
            
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
            },
          
        },
        yAxis: {
            min: 0,
            title: {
                text: 'Cantidad Incendios, Áreas Forestales y Cantidad Libros, Editoriales y Sector Gráfico Exportados'
            },
            labels: {
                formatter: function(){
                    return this.value;
                }
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
    <script src="https://code.highcharts.com/modules/accessibility.js" on:load="{loadGraph}"></script>
</svelte:head>

<main>
<Button outline color="secondary" on:click="{pop}">Atrás &#x21a9;</Button>

	{#await getBookExports}
		Loading books exports stats ...
	{:then getBookExports}
		<figure class="highcharts-figure" style="text-align:center;">
            <div id="container"></div>
                <p class="highcharts-description">
                        Esta gráfica muestra informacion acerca de la cantidad de incendios forestales por ccaa en el territorio español, junto con sus áreas forestales en 2007 y sobre exportaciones de libros de diferentes paises, exportaciones de libros, de editoriales y del sector gráfico.
                </p>	
        </figure>
        
		<Table bordered>
			<thead>
				<tr>
					<th>Pais</th>
					<th>Año</th>
					<th>Exportaciones de libros</th>
					<th>Exportaciones de editoriales</th>
                    <th>Exportaciones del sector gráfico</th>

				</tr>
			</thead>
			<tbody>
				{#each book_exports as exp}
				<tr>
                    <td>{exp.country}</td>
                    <td>{exp.year}</td>
                    <td>{exp.exp_book}</td>
                    <td>{exp.exp_editorial}</td>
                    <td>{exp.exp_graphic_sector}</td>

				</tr>
				{/each}
			</tbody>
		</Table>
	{/await}
	
</main>

 <Button outline color="secondary" on:click="{pop}">Atrás &#x21a9;</Button>
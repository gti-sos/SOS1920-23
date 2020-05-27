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


        let Datos=[];
        const res = await fetch(url);
        Datos = await res.json();
        console.log("Loading Chart...");
        
        
        
        Datos.forEach((data) => {
            let country = data.country;
            let p = data["pev-stock"];
            let a = data["annual-sale"];
            
            
            if (data.year == 2018) {
                countries.push(country);
                pevStock.push(p);
                annualSale.push(a);
                
            }
        });
        
        
        
        let country = Datos.map((Datos)=> Datos.country);
        let pev_stock = Datos.map((Datos) =>Datos.stock);
        let annual_sale = Datos.map((Datos) =>Datos.sale);

        Highcharts.chart('container', {
            chart: {
                type: 'column'
            },
            title: {
                text: 'Ventas anuales y cumulo de ventas de coches eléctricos'
            },
            xAxis: {
            categories: countries,
                crosshair: true
            },
            yAxis: {
                min: 0,
                title: {
                    text: 'Unidades vendidas'
                }
            },
            tooltip: {
                headerFormat: '<span style="font-size:10px">{point.key}</span><table>',
                pointFormat: '<tr><td style="color:{series.color};padding:0">{series.name}: </td>' +
                    '<td style="padding:0"><b>{point.y:.1f} unidades</b></td></tr>',
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
            series: [{
                name: 'Ventas Acumuladas',
                type: 'column',
                data: pevStock

            }, {
                name: 'Ventas Anuales',
                type: 'column',
                data: annualSale

            }
            ]
});
        
    }

    async function fires_stats(){

 let Datos = [];

        const res = await fetch("api/v2/fires-stats");
        Datos = await res.json();

    
        let comunidad = Datos.filter((Datos)=> Datos.year===2007).map((Datos) => Datos.community);
        let fires = Datos.filter((Datos)=> Datos.year===2007).map((Datos)=> Datos.total_fire);
        let forest = Datos.filter((Datos) => Datos.year===2007).map((Datos) => Datos.forest_area);
        let noForest = Datos.filter((Datos) => Datos.year===2007).map((Datos) => Datos.non_forest_area);

    Highcharts.chart('container', {
            chart: {
                type: 'column'
            },
            title: {
                text: 'Área forestal y no forestal por ccaa'
            },
            subtitle: {
                text: 'Fuente: <a href="https://www.mapa.gob.es/es/desarrollo-rural/estadisticas/incendios-decenio-2006-2015_tcm30-511095.pdf">gob.es</a>'
            },
            xAxis: {
            categories: comunidad,
                crosshair: true
            },
            yAxis: {
                min: 0,
                title: {
                    text: 'Número de incendios, área forestal y no forestal en hctreas'
                }
            },
            tooltip: {
                headerFormat: '<span style="font-size:10px">{point.key}</span><table>',
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
            series: [
                {
                name: 'Incendios Totales',
                type: 'column',
                data: fires

            }, 
            {
                name: 'Área forestal(Hectáreas)',
                type: 'column',
                data: forest

            }, {
                name: 'Área no forestal(Hectáreas)',
                type: 'column',
                data: noForest

            }
            ]
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
        <p><Button  on:click={fires_stats}>Ver Datos API Fires-Stats</Button></p>
        <Button  onClick="location.reload()">Ver Datos API Plugin-Vehicles-Stats</Button>
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
<script>
	import { pop } from "svelte-spa-router";
    import Button from "sveltestrap/src/Button.svelte";
    import Table from "sveltestrap/src/Table.svelte";
    import  { onMount } from "svelte";

    onMount(getPokemons);
    let pokemons = [];

async function getPokemons(){
    console.log("Fetching pokemoms data...");
    const resData = await fetch("https://pokemon-go1.p.rapidapi.com/pokemon_stats.json", {
        "method" : "GET",
        "headers":{
        "x-rapidapi-host": "pokemon-go1.p.rapidapi.com",
	    "x-rapidapi-key": "1ffb76c03dmsh3fb87e4dcd08115p1d9482jsn63e6275c09b1",
        }
    });
    if(resData.ok){
        console.log("OK");
        const json = await resData.json();
        pokemons = json;
        console.log("Received "+ pokemoms.length + " pokemons data")
    }
    else{
        console.log("Error");
    }
}


async function loadGraph(){
    

    let Datos = [];

        const res = await fetch("api/v2/fires-stats");
        Datos = await res.json();

        let ejeX = ["Incendios_Totales", "Área Forestal", "Área no Forestal", "Ataque", "Defensa", "Estamina"];
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
       
        //Hago el fetch a la API externa, en este caso de RapidAPI
        const resData = await fetch("https://pokemon-go1.p.rapidapi.com/pokemon_stats.json", {
        "method" : "GET",
        "headers":{
        "x-rapidapi-host": "pokemon-go1.p.rapidapi.com",
	    "x-rapidapi-key": "1ffb76c03dmsh3fb87e4dcd08115p1d9482jsn63e6275c09b1",
        }
        });
        let DataPokemons = await resData.json();
                

        var cont = 0;
        DataPokemons.forEach((data2)=>{
            if(data2.form=="Normal" & cont<=10){//Mostrando solo los pokemons con la forma normal y a un número limitado de 10
            valor = {
                name: data2.pokemon_name,
                data: [0,0,0,data2.base_attack, data2.base_defense, data2.base_stamina]
            }
            valores.push(valor);
            cont++;
            }
            
        });

            console.log("Loading Chart...");

        
    
    Highcharts.chart('container', {
        chart: {
            type: 'column'
        },
        title: {
            text: 'Integración API Externa Pokémons con Fires Stats'
        },
        subtitle: {
            text: '<a href="https://rapidapi.com/brianiswu/api/pokemon-go1">Fuente</a>'
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
                text: 'Cantidades Incendios, Áreas forestales y Puntos de habilidades'
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
		{#await getPokemons}
            Loading pokemons data ...
        {:then getPokemons}
        <figure class="highcharts-figure">
            <div id="container"></div>
                <p class="highcharts-description" style="text-align:center;">
                        Esta gráfica muestra informacion acerca de la cantidad de incendios forestales por ccaa en el territorio español, junto con sus áreas forestales en 2007 y acerca de las características de los pokemons en su forma normal(limitado a 10)
                </p>
                <p style="text-align:center;">Consultar todos los pokemons en su forma normal con sus puntos de habilidades</p>	
        </figure>

        <Table bordered>
			<thead>
				<tr>
					<th>Pokemon</th>
					<th>Ataque</th>
					<th>Defensa</th>
					<th>Estamina</th>
                    

				</tr>
			</thead>
			<tbody>
				{#each pokemons as pokemon}
				{#if pokemon.form=="Normal"}
                <tr>
                    <td>{pokemon.pokemon_name}</td>
                    <td>{pokemon.base_attack}</td>
                    <td>{pokemon.base_defense}</td>
                    <td>{pokemon.base_stamina}</td>
                    
                
				</tr>
                {/if}
				{/each}
			</tbody>
		</Table>
	{/await}
</main>
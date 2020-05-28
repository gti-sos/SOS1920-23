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

    /*Falta gráfica*/

</script>

<main>
        {#await getEmigrantsStats}
            Loading plugin emigrants stats...
	{:then getEmigrantsStats}
		<figure class="highcharts-figure">
            <div id="container"></div>
                <p class="highcharts-description">
                        Esta API muestra informacion acerca de las migraciones en cada país de hombres y mujeres.
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

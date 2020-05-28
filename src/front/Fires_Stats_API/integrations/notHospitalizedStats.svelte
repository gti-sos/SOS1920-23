<script>
    import  { onMount } from "svelte";
	import { pop } from "svelte-spa-router";
	import Table from "sveltestrap/src/Table.svelte";
    import Button from "sveltestrap/src/Button.svelte";

    const url ="https://sos1920-06.herokuapp.com/api/v2/not-hospitalized-stats";

    onMount(getNotHospitalized);

    let hospitalizeds = [];

async function getNotHospitalized(){
    console.log("Fetching not hospitalized stats...");
    const res = await fetch(url);
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


</script>

<main>

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
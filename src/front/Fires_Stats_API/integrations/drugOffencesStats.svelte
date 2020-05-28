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

</script>

<main>

	{#await getDrugOffences}
		Loading drug offences stats ...
	{:then getDrugOffences}
		<figure class="highcharts-figure">
            <div id="container"></div>
                <p class="highcharts-description">
                        Esta API muestra información acerca de los delitos por drogas en diferentes paises, relacionados con el canabis, el uso y el tráfico de drogas.
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
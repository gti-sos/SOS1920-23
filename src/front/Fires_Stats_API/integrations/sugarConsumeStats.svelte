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

</script>

<main>

	{#await getSugarConsume}
		Loading sugar consume stats...
	{:then getSugarConsume}
		<figure class="highcharts-figure">
            <div id="container"></div>
                <p class="highcharts-description">
                        Esta API muestra la cantidad de consumo de azucar en distintos países y continentes, así como su porcentaje de diabetes y la poblacion. 
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
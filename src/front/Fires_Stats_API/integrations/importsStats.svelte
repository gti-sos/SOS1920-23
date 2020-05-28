<script>
    import  { onMount } from "svelte";
	import { pop } from "svelte-spa-router";
	import Table from "sveltestrap/src/Table.svelte";
    import Button from "sveltestrap/src/Button.svelte";

    const url = "https://sos1920-07.herokuapp.com/api/v2/imports";

    onMount(getImports);

    let imports = [];

    async function getImports(){
        console.log("Fetching imports...");
        const res = await fetch(url);
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


</script>

<main>

	{#await getImports}
		Loading imports stats ...
	{:then getImports}
		<figure class="highcharts-figure">
            <div id="container"></div>
                <p class="highcharts-description">
                        Esta API muestra información acerca de las importaciones de diferentes productos desde diferentes paises a los Estados Unidos.
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
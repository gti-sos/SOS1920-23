<script>
    import Table from "sveltestrap/src/Table.svelte";
    import Button from  "sveltestrap/src/Button.svelte";

    import { pop } from "svelte-spa-router"
    
    import { onMount } from "svelte";

    export let params = {}; //Para los parametro en la url de cada recurso

    let fire = {};
    

    let updatedCommunity = "";
    let updatedYear = 0;
    let updatedtotal_fire = 0.0;
    let updatedforest_area = 0.0;
    let updatednon_forest_area = 0.0;

    let errorMsg = "";

    onMount(getFire);

    async function getFire(){
		console.log("Fetching fire");
		const res = await fetch("/api/v1/fires-stats/"+params.community+"/"+params.year);
		
//Await bloquea la instruccion, hasta que res tenga un valor

		if(res.ok){
			console.log("OK");
			const json = await res.json();
            fire = json;
            updatedCommunity = fire.community;
            updatedYear = fire.year;
            updatedtotal_fire = fire.total_fire;
            updatedforest_area = fire.forest_area;
            updatednon_forest_area = fire.non_forest_area;
            
            
			console.log("Received fire.");
		}

		else{
            errorMsg = res.status + ": " + res.statusText;
			console.log("ERROR!" + errorMsg);
		}
	}


    async function updateFire() {

        console.log("Updating fire..." + JSON.stringify(params.community));

        const res = await fetch("/api/v1/fires-stats/"+params.community+"/"+params.year, {
            method: "PUT",
            body: JSON.stringify({
                community: params.community,
                year: parseInt(params.year),
                total_fire: updatedtotal_fire,
                forest_area: updatedforest_area,
                non_forest_area: updatednon_forest_area
            }),
            headers: {
                "Content-Type": "application/json"
            }
        }).then(function (res) {
            getFire();
        });
    }


</script>


<main> 
    <h3>Editando datos de la comunidad <strong>{params.community}</strong> en el año <strong>{params.year}</strong></h3>

{#await fire}	
		Loading fire ...
{:then fire}
		<Table bordered>
			<thead>
				<tr>

					<th>Community</th>
					<th>Year</th>
					<th>Total Fire</th>
					<th>Forest Area</th>
					<th>Non Forest Area</th>
					<th>Actions</th>
				</tr>
			</thead>

			<tbody>

				<tr>

					<td>{updatedCommunity}</td>
					<td>{updatedYear}</td>
					<td><input type="number" bind:value="{updatedtotal_fire}"></td>
					<td><input type="number" bind:value="{updatedforest_area}"></td>
					<td><input type="number" bind:value="{updatednon_forest_area}"></td>
					<td><Button color="primary" outline on:click={updateFire}>Actualizar</Button></td>
				</tr>


			</tbody>

		
        </Table>
    {/await}
    {#if errorMsg}
    <p style="color: red;">Error: {errorMsg}</p>
    {/if}
        <Button outline color="secondary" on:click="{pop}">Atrás</Button>
    <!--Pop hace la misma funcion que darle hacia atrás en el navegador-->
</main>  
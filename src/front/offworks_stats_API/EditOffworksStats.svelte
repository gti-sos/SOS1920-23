<script>
import {onMount} from "svelte";
	import {pop} from "svelte-spa-router";
	import Table from "sveltestrap/src/Table.svelte";
	import Button from "sveltestrap/src/Button.svelte";
	import Input from "sveltestrap/src/Input.svelte";
	
	export let params = {};
	let offwork = {};    
	let updatedCommunity = "";
	let updatedYear = 0;
	let updatedAccident = 0;
	let updatedSick = 0.0;
	let updatedNumberZone = 0;
	let msgOk = false;
	let msgBad = false;
	
	onMount(getOffwork);
	
		async function getOffwork() {
			console.log("Fetching offworks...");
			const res = await fetch("/api/v2/offworks-stats/"+ params.community + "/" + params.year);
			if (res.ok) {
				console.log("Ok:");
				const json = await res.json();
				offwork = json;
				updatedCommunity = offwork.community;
				updatedYear = offwork.year;
				updatedAccident = offwork.accident;
				updatedSick = offwork.sick;
				updatedNumberZone = offwork.numberzone;
				console.log("Data loaded");
			} else {
				console.log("ERROR!");
				 msgError = "Elemento no encontrado";
			}
		}
	
		async function updateOffwork(){
			console.log("Updating offworks...");
			const res = await fetch("/api/v2/offworks-stats/" + params.community + "/" + params.year, {
				method: "PUT",
				body: JSON.stringify({
					community: params.community,
					year: parseInt(params.year),
					"accident": updatedAccident,
					"sick": updatedSick,
					"numberzone": updatedNumberZone
				}),
				headers: {
					"Content-Type": "application/json"
				}
			}).then(function (res) {
				getOffwork();
				if(res.status == 200){
				msgOk = "Actualizado correctamente";
				msgBad = false;
				}else{
				msgOk = false;
				msgBad = "No puede haber campos vacios";
				}
			});
		}
	
	</script>
	<main>
		<h3 style="text-align: center;">Editar: <strong>{params.community.replace("-", " ")} - {params.year}</strong></h3>
	{#await offwork}
		Loading offworks...
	{:then offwork}
			<Table bordered>
				<thead>
					<tr>
						<th>Provincia</th>
						<th>Año</th>
						<th>Metropolitano</th>
						<th>Urbano</th>
						<th>Resto</th>
						<th>Acciones</th>
					</tr>
				</thead>
				<tbody>
					<tr>
						<td>{updatedCommunity.replace("-", " ")}</td>
						<td>{updatedYear}</td>                    
						<td><Input type="number" bind:value="{updatedAccident}"/></td>
						<td><Input type="number" bind:value="{updatedSick}"/></td>
						<td><Input type="number" bind:value="{updatedNumberZone}"/></td>
						<td> <Button outline color="primary" on:click={updateOffwork}>Actualizar</Button> </td>
					</tr>
				</tbody>
			</Table>
		{/await}
		
	{#if msgBad}
	<p style="color: red">ERROR: {msgBad}</p>
	{/if}
	{#if msgOk}
	<p style="color: green">EXITO: {msgOk}</p>
	{/if}
		<Button outline color="secondary" on:click="{pop}"> Atrás </Button>
	</main>

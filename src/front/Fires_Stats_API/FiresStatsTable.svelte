<script>
	import { onMount } from "svelte";

	import Table from "sveltestrap/src/Table.svelte";
	import Button from  "sveltestrap/src/Button.svelte";


	let fires = [];

	let newFire = {
		community:"",
		year: 0,
		total_fire:0.0,
		forest_area:0.0,
		non_forest_area:0.0
	};


	onMount(getFires);

	async function getFires(){
		console.log("Fetching fires...");
		const res = await fetch("/api/v1/fires-stats");
		
//Await bloquea la instruccion, hasta que res tenga un valor
		if(res.ok){
			console.log("OK");
			const json = await res.json();
			fires = json;
			console.log("Received " + fires.length + " fires.");
		}

		else{
			console.log("ERROR!");
		}
	}

	async function insertFire(){
		console.log("Inserting fires...");
		const res = await fetch("/api/v1/fires-stats", {
			method: "POST",
			body: JSON.stringify(newFire),
			headers:{
				"Content-Type":"application/json"
			}
		}).then(function (res){
			getFires();
		}); //cuando es res ok


	}

	async function deleteFire(community, year) {
        const res = await fetch("/api/v1/fires-stats/" + community + "/" + year, {
            method: "DELETE"
        }).then(function (res) {
            getFires();
        });
    }


</script>

<main>

		{#await fires}	
			Loading fires ...
		{:then fires}
		<Table>
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

					<td><input bind:value="{newFire.community}"></td>
					<td><input bind:value="{newFire.year}"></td>
					<td><input bind:value="{newFire.total_fire}"></td>
					<td><input bind:value="{newFire.forest_area}"></td>
					<td><input bind:value="{newFire.non_forest_area}"></td>
					<td><Button color="primary" outline on:click={insertFire}>Insertar</Button></td>
				</tr>

				{#each fires as fire}

				<tr>

					<td>
						<a href="#/fires-stats/{fire.community}/{fire.year}">{fire.community}
					</td>
					<td>{fire.year}</td>
					<td>{fire.total_fire}</td>
					<td>{fire.forest_area}</td>
					<td>{fire.non_forest_area}</td>
					<td><Button color="danger" outline on:click="{deleteFire(fire.community)}">Eliminar</Button></td>
				</tr>
				{/each}
			</tbody>

		
		</Table>

	{/await}
</main>



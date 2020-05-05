<script>
	import { onMount } from "svelte";
	import Table from "sveltestrap/src/Table.svelte";
    import Button from  "sveltestrap/src/Button.svelte";
	import Input from "sveltestrap/src/Input.svelte";
	let cigarretes = [];
	let newCigarrete = {
		community:"",
		year:"",
		cigarrete_sale:"",
		first_variation:"",
		second_variation:""
	};
	onMount(getCigarretes);
	async function getCigarretes(){
		console.log("Fetching cigarretes sales...");
		const res = await fetch("/api/v1/cigarretes-sales");
		
//Await bloquea la instruccion, hasta que res tenga un valor
		if(res.ok){
			console.log("OK:");
			const json = await res.json();
			cigarretes = json;
			console.log("Received " + cigarretes.length + " cigarretes-sales.");
		}
		else{
			console.log("ERROR!");
		}
	}
	async function insertCigarretes(){
		
		const res = await fetch("/api/v1/cigarretes-sales", {
			method: "POST",
			body: JSON.stringify(newCigarrete),
			headers:{
				"Content-Type":"application/json"
			}
		}).then(function (res){
			getCigarretes();
			
		}); //cuando es res ok
    }
	async function deleteCigarretes(community,year) {    //si no ponemos la función asíncrona no podemos hacer el await.

        const res = await fetch("/api/v1/cigarretes-sales/" + community +"/" + year ,{
			method: "DELETE"

        }).then(function (res) {
            getCigarretes();
        });
    }
</script>

<main>

		{#await cigarretes}	
			Loading cigarretes-sales ...
		{:then cigarretes}
		<Table 	border="3">
			<thead>
				<tr>

					<th>Community</th>
					<th>Year</th>
					<th>cigarrete sale</th>
					<th>First variation</th>
					<th>Second variation</th>
					
				</tr>
			</thead>

			<tbody>

				<tr>

					<td><input type="text" bind:value="{newCigarrete.community}"></td>
					<td><input type="number" bind:value="{newCigarrete.year}"></td>
					<td><input type="number" bind:value="{newCigarrete.cigarrete_sale}"></td>
					<td><input type="number" bind:value="{newCigarrete.first_variation}"></td>
					<td><input type="number" bind:value="{newCigarrete.second_variation}"></td>
					<td><Button outline color="primary"  on:click={insertCigarretes}>Insert</Button></td>
				</tr>

				{#each cigarretes as cigarrete}

				<tr>

					
					<td>
						<a href="#/cigarretes/{cigarrete.community}/{cigarrete.year}">{cigarrete.community}</a>
					</td>
					<td>{cigarrete.year}</td>
					<td>{cigarrete.cigarrete_sale}</td>
					<td>{cigarrete.first_variation}</td>
					<td>{cigarrete.second_variation}</td>
					<td><Button outline color="danger" on:click="{deleteCigarretes(cigarrete.community,cigarrete.year)}">Delete</Button></td>
				</tr>
				{/each}
			</tbody>

		
		</Table>

	{/await}
</main>

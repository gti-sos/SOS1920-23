<script>
    import Table from "sveltestrap/src/Table.svelte";
    import Button from  "sveltestrap/src/Button.svelte";

    import { pop } from "svelte-spa-router"
    
    import { onMount } from "svelte";

    export let params = {}; //Para los parametro en la url de cada recurso

    let cigarrete = {};
    

    let updatedCommunity = "";
    let updatedYear = 0;
    let updatedcigarrete_sale = 0;
    let updatedfirst_variation = 0.0;
    let updatedsecond_variation = 0.0;

    let errorMsg = "";
    let exitoMsg = "";

    onMount(getCigarretes);

    async function getCigarretes(){
		console.log("Fetching cigarrete sales");
		const res = await fetch("/api/v2/cigarretes-sales/"+params.community+"/"+params.year);
		
//Await bloquea la instruccion, hasta que res tenga un valor

		if(res.ok){
			console.log("OK");
			const json = await res.json();
            cigarrete = json;
            updatedCommunity = cigarrete.community;
            updatedYear = cigarrete.year;
            updatedcigarrete_sale = cigarrete.cigarrete_sale;
            updatedfirst_variation = cigarrete.first_variation;
            updatedsecond_variation = cigarrete.second_variation;
            
            
			console.log("Received cigarretes sales.");
		}

		else{
            errorMsg = res.status + ": " + res.statusText;
			console.log("ERROR!" + errorMsg);
		}
	}


    async function updateCigarretes() {

        console.log("Updating cigarrete..." + JSON.stringify(params.community));

        const res = await fetch("/api/v2/cigarretes-sales/"+params.community+"/"+params.year, {
            method: "PUT",
            body: JSON.stringify({
                community: params.community,
                year: parseInt(params.year),
                cigarrete_sale: updatedcigarrete_sale,
                first_variation: updatedfirst_variation,
                second_variation: updatedsecond_variation
            }),
            headers: {
                "Content-Type": "application/json"
            }
        }).then(function (res) {
            getCigarretes();

            if(res.status==400){
                errorMsg = "Error al introducir los datos";

            }else{
                exitoMsg = "Se ha actualizado correctamente";
            }
        });
    }
        

</script>


<main> 
    <h3>Editando datos de la comunidad <strong>{params.community}</strong> en el año <strong>{params.year}</strong></h3>

{#await cigarrete}	
		Loading cigarrete ...
{:then cigarrete}
		<Table bordered>
			<thead>
				<tr>

					<th>Comunidad</th>
					<th>Año</th>
					<th>Venta de paquetes</th>
					<th>Primera variacion</th>
					<th>Segunda variacion</th>
				</tr>
			</thead>

			<tbody>

				<tr>

					<td>{updatedCommunity}</td>
					<td>{updatedYear}</td>
					<td><input type="number" bind:value="{updatedcigarrete_sale}"></td>
					<td><input type="number" bind:value="{updatedfirst_variation}"></td>
					<td><input type="number" bind:value="{updatedsecond_variation}"></td>
					<td><Button color="primary" outline on:click={updateCigarretes}>Actualizar</Button></td>
				</tr>


			</tbody>

		
        </Table>
    {/await}  
    {#if errorMsg}
    <p style="color: red;">Error: {errorMsg}</p>
    {/if}
    {#if exitoMsg}
    <p style="color: blue;">Éxito: {exitoMsg}</p>
    {/if}
        <Button outline color="secondary" on:click="{pop}">Atrás</Button>    
        
</main>  
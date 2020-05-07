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

    let msgExito ="";
    let msgError = "";

    onMount(getFire);

    async function getFire(){
		console.log("Fetching fire");
		const res = await fetch("/api/v2/fires-stats/"+params.community+"/"+params.year);
		
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
       

		else if(res.status==404){
            msgError = "Elemento no encontrado";
			console.log("ERROR!" + msgError);
        }
        
        else if(res.status==400){
            msgError = "Revise los campos";
            console.log(msgError);
        }
	}


    async function updateFire() {

        console.log("Updating fire..." + JSON.stringify(params.community));

        const res = await fetch("/api/v2/fires-stats/"+params.community+"/"+params.year, {
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
            if(res.status==200){
                window.alert("Recurso actualizado");
            }
            
            else if(res.status==400){
                msgError = "Revise los campos";
                console.log(msgError);
            }
            
        }
        )};
           
    

    


</script>


<main> 
    <h3>Editando datos de la comunidad <strong>{params.community.replace("-", " ")}</strong> en el año <strong>{params.year}</strong></h3>

{#await fire}	
		Loading fire ...
{:then fire}

		<Table bordered>
			<thead>
				<tr>

					<th>Comunidad</th>
					<th>Año</th>
					<th>Incendios Totales</th>
					<th>Área Forestal</th>
					<th>Área no Forestal</th>
					<th>Acción</th>
				</tr>
			</thead>

			<tbody>

				<tr>

					<td>{updatedCommunity.replace("-", " ")}</td>
					<td>{updatedYear}</td>
                <td><input id="editaIncendio" type="number" bind:value="{updatedtotal_fire}" ></td>
					<td><input type="number" bind:value="{updatedforest_area}" ></td>
					<td><input type="number" bind:value="{updatednon_forest_area}" ></td>
					<td><Button color="primary" outline  on:click={updateFire}>Actualizar &#x2714;</Button></td>
				</tr>

                
                    <!--onclick="location.href='/#/fires-stats'"-->
                   
                

			</tbody>

		
        </Table>
        
    {/await}
    <div>{#if msgExito}<h5 style="color: green;  text-align: center;">Exito: {msgExito}</h5>{/if}  {#if msgError}<h5 style="color: red; text-align: center;">Error: {msgError}</h5>{/if}</div>
        <Button outline color="secondary" on:click="{pop}">Atrás &#x21a9;</Button>
    <!--Pop hace la misma funcion que darle hacia atrás en el navegador-->
</main>  
<script>
	import { onMount } from "svelte";

	import Table from "sveltestrap/src/Table.svelte";
	import Button from  "sveltestrap/src/Button.svelte";
	import Pagination from "sveltestrap/src/Pagination.svelte";
	import PaginationItem from "sveltestrap/src/PaginationItem.svelte";
	import PaginationLink from "sveltestrap/src/PaginationLink.svelte";
	import FormGroup from "sveltestrap/src/FormGroup.svelte";
	import Input from "sveltestrap/src/Input.svelte";


	let fires = [];

	let newFire = {
		community:"",
		year: "",
		total_fire:"",
		forest_area:"",
		non_forest_area:""
	};

	//Elementos para la paginación
	let limit = 10; //Por defecto que muestre 10
	let offset = 0;
	let pagActual = 1; //Que por defecto muestre la primera página 
	let masDatos = true;
	

	//elementos para búsqueda
	let anyo ="";
	let comunidad="";
	
	let msgError = "";
	let msgExito = "";

	onMount(paginationFires);

	async function paginationFires(){
		console.log("Getting Fires...");

		const res = await fetch("api/v2/fires-stats?offset="+ limit * offset + "&limit=" + limit );
		const siguiente = await fetch("/api/v2/fires-stats?offset=" + limit * offset + "&limit=" + limit);

		if(res.status == 200 && siguiente.status ==200){
			
			console.log("OK");
			const json = await res.json();
			const siguienteJson = await siguiente.json();
			fires = json;
				if(siguienteJson.length == 0){
					masDatos == false;	//no hay mas datos
				}
				else{
					masDatos == true;	//si hay mas datos
				}
				console.log("Received " + fires.length + " fires.");
		}
		
		else{
			console.log("Error al obtener la página");
			
		}
		
	}


	function incOffset(value){
		
		offset += value;
		pagActual += value;
		paginationFires();
	}

	
	async function busqueda(comunidad,anyo){
		
		console.log("Searching an specific Item...");

		if(typeof comunidad=='undefined'){
			comunidad="";
		}
		if(typeof anyo=='undefined'){
			anyo="";
		}

		if(comunidad != ""){	//si busca por comunidad
			const res = await fetch("/api/v2/fires-stats?community="+comunidad);

					if(res.ok){
						msgExito= "Búsqueda realizada";
						console.log("Mostrando la búsqueda...");
						const json = await res.json();
						fires=json;
						console.log("Found " + fires.length + " fires-stats");
					
					}

					else{
						msgError = "Error: No se ha podido encontrar el elemento "+ "'"+comunidad+ "'" + ", tal vez hayas olvidado el guión para los nombres compuestos";
						console.log("Error!")
					}
		}

		if(anyo != ""){//si busca por año
			const res = await fetch("/api/v2/fires-stats?year="+anyo);

					if(res.ok){
						msgExito= "Búsqueda realizada";
						console.log("Mostrando la búsqueda...");
						const json = await res.json();
						fires=json;
						console.log("Found " + fires.length + " fires-stats");
					}

					else{
						msgError = "Error: No se ha podido encontrar el elemento " +"'"+anyo +"'" ;
						console.log("Error!")
					}
		}

		if(comunidad != "" && anyo !=""){ //si busca por comunidad y por año
			const res = await fetch("/api/v2/fires-stats?community="+comunidad+"&year="+anyo);

					if(res.ok){
						msgExito= "Búsqueda realizada";
						console.log("Mostrando la búsqueda...");
						const json = await res.json();
						fires=json;
						console.log("Found " + fires.length + " fires-stats");
					}

					else{
						msgError = "Error: No se ha podido encontrar el elemento "+"'"+comunidad+ "'"+ " " + "'"+anyo +"'" + ", tal vez hayas olvidado el guión para los nombres compuestos";
						console.log("Error!")
					}
					}


	}

	
	//funcion para insertar un elemento
	async function insertFire(){
		console.log("Inserting fires...");
		const res = await fetch("/api/v2/fires-stats", {
			method: "POST",
			body: JSON.stringify(newFire),
			headers:{
				"Content-Type":"application/json"
			}
		}).then(function (res){
			paginationFires();
				if(res.ok){
					
					msgExito="Elemento añadido con éxito";
				}
				else if(res.status ==400){
					window.alert("Debe completar todos los campos");
				}

				else if(res.status == 409){
					window.alert( "El elemento que desea añadir ya existe");
				}
			
		}); 


	}
	//funcion para eliminar un elemento concreto
	async function deleteFire(community, year) {
		console.log("Deleting specific resource...");
        const res = await fetch("/api/v2/fires-stats/" + community + "/" + year, {
			method: "DELETE"
			
        }).then(function (res) {
			paginationFires();
			msgExito = "Eliminado con éxito";
        });
    }
	//funcion para eliminar todos los elementos existentes
	async function deleteAllResources(){
		console.log("Deleting all resources...");
		const res = await fetch("/api/v2/fires-stats" ,{
			method: "DELETE"
		}).then(function(res){
			if(res.ok){
				paginationFires();
				window.alert("Pulse aceptar para continuar")
			}
			else if(res.status ==404){
				window.alert("No hay elementos para elimiar");
			}


		});
    }
	//funcion para cargar elementos iniciales
	async function loadInitialData(){
		console.log("Loading initial fires...");
		const res = await fetch("/api/v2/fires-stats/loadInitialData",{
			method: "GET"
		}).then(function(res){
			paginationFires();
		});
	}

	

</script>

<main>

		{#await fires}	
			Loading fires ...
		{:then fires}
		<h3>API de estadísticas de incendios en España</h3>

		<p>
			Página {pagActual}
		</p>

		<Table>
			
			<thead>
				<tr>
					<td>Búsqueda de elementos</td>
					<td><Input placeholder="Introduce Comunidad" bind:value="{comunidad}"/></td>
					<td><Input type="number" placeholder="Introduce Año" bind:value="{anyo}"/></td>
					<td><Button color="secondary" outline on:click={busqueda(comunidad,anyo)}>Buscar &#x2315;</Button></td>
					<td>{#if msgError}<p style="color: red; border: solid; text-align: center;">{msgError}</p>{/if} 
						{#if msgExito}<p style="color: green;border: solid; text-align: center;">{msgExito}</p>{/if}</td>
				</tr>
				<tr>
					
					<th>Comunidad</th>
					<th>Año</th>
					<th>Incendios Totales</th>
					<th>Área Forestal</th>
					<th>Área no Forestal</th>
					<th>Acciones</th>
					
					
				</tr>
			</thead>

			<tbody>
				
				<tr>

					<td><input type= "text"  bind:value="{newFire.community}"></td>
					<td><input type="number" bind:value="{newFire.year}"></td>
					<td><input type="number" bind:value="{newFire.total_fire}"></td>
					<td><input type="number" bind:value="{newFire.forest_area}"></td>
					<td><input type="number" bind:value="{newFire.non_forest_area}"></td>
					<td><Button color="primary" outline on:click={insertFire}>Insertar &#x271a;</Button></td>
					
					
				</tr>
				

				{#each fires as fire}

				<tr>

					<td>
						<a href="#/fires-stats/{fire.community}/{fire.year}">{fire.community.replace("-", " ")}
					</td>
					<td>{fire.year}</td>
					<td>{fire.total_fire}</td>
					<td>{fire.forest_area}</td>
					<td>{fire.non_forest_area}</td>
					<td><Button color="danger" outline on:click="{deleteFire(fire.community)}">Borrar &#128465;</Button></td>
				</tr>
				{/each}
				<tr>
					<td><Button color="danger"  onClick="location.reload()" on:click={deleteAllResources}>Eliminar Todos</Button></td>
					<td><Button color="secondary" on:click={loadInitialData}>Cargar elementos</Button></td>
					<td></td>
					<td></td>
					<td></td>
					<td></td>
					
				</tr>
			</tbody>

		</Table>

		

	{/await}

	<Pagination float="center">
		<PaginationItem class="{pagActual == 1 ? 'disabled' : ''}">
			<PaginationLink previous href="#/fires-stats" on:click="{() => incOffset(-1)}" /><!--Botón página anterior-->
		</PaginationItem>

		{#if pagActual !=1} <!--Si al cargar la página actual no es la 1, que se vaya para la 1-->
		<PaginationItem>
			<PaginationLink href ="#/fires-stats" on:click="{() => incOffset(-1)}">{pagActual -1}</PaginationLink>
		</PaginationItem>
		{/if}

		<PaginationItem active> <!--Boton de pagina actual activo-->
			<PaginationLink href="#/fires-stats">{pagActual}</PaginationLink>
		</PaginationItem>

		{#if masDatos==true}
		<PaginationItem>
			<PaginationLink href="#/fires-stats" on:click="{() => incOffset(1)}">{pagActual + 1}</PaginationLink>
		</PaginationItem>
		{/if}

		{#if masDatos==false}
		<PaginationItem class="{masDatos ? '' : 'disabled'}">
			<PaginationLink href="#/fires-stats" on:click="{() => incOffset(0)}">{pagActual + 1}</PaginationLink>
		</PaginationItem>
		{/if}

		

		<PaginationItem class="{masDatos ? '' : 'disabled'}">
			<PaginationLink next href="#/fires-stats" on:click="{() => incOffset(1)}"/><!--Botón siguiente página-->
		</PaginationItem>

		
		
	</Pagination>
	
</main>
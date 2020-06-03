<script>
	import { onMount } from "svelte";
	import { pop } from "svelte-spa-router";
	import Table from "sveltestrap/src/Table.svelte";
	import Button from  "sveltestrap/src/Button.svelte";
	import Pagination from "sveltestrap/src/Pagination.svelte";
	import PaginationItem from "sveltestrap/src/PaginationItem.svelte";
	import PaginationLink from "sveltestrap/src/PaginationLink.svelte";
	import FormGroup from "sveltestrap/src/FormGroup.svelte";
	import Input from "sveltestrap/src/Input.svelte";
	
	/*Menu*/
import {
    Dropdown,
    DropdownItem,
    DropdownMenu,
    DropdownToggle
  } from 'sveltestrap';

  let isOpen = false;
	/*-----------------------------------------------*/

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
	let pagSiguiente = true;
	let conjCommunity = [];
	let conjYears = [];
	let numJson = 0;
	

	//Elementos para búsqueda
	let anyo ="";
	let comunidad="";
	
	//Variables mensajes de error
	let msgError = "";
	let msgExito = "";

	onMount(paginationFires);

	async function paginationFires(){
		console.log("Getting Fires...");

		const res = await fetch("api/v2/fires-stats?offset="+ limit * offset + "&limit=" + limit );
		

		if(res.ok){
			console.log("OK");
			const json = await res.json();
			fires = json;
			numJson = json.length;
			

				if(json.length == 0){
					pagSiguiente == false;	//no hay mas datos
				}
				else{
					pagSiguiente == true;	//si hay mas datos
				}
				console.log("Received " + fires.length + " fires.");
		}
		
		else if(res.status==404){
			console.log("Error al obtener la página");
			pagSiguiente = false;
			//Mensaje para cuando se borra todo
			msgExito = "Todos los elementos eliminados"
		}
		
	}

	
	function incOffset(value){
		
		offset += value;
		pagActual += value;
		paginationFires();
	}

	//Implementada para comunidad y año
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
						msgError = "No se ha podido encontrar el elemento "+ "'"+comunidad+ "'" + ", tal vez haya olvidado el guión para los nombres compuestos";
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
						msgError = "No se ha podido encontrar el elemento " +"'"+anyo +"'" ;
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
						msgError = "No se ha podido encontrar el elemento "+"'"+comunidad+ "'"+ " " + "'"+anyo +"'" + ", tal vez haya olvidado el guión para los nombres compuestos";
						console.log("Error!")
					}
					}


	}

	
	//Funcion para insertar un elemento
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
					window.alert("El elemento que desea añadir ya existe");
				}
			
		}); 


	}
	//Funcion para eliminar un elemento concreto
	async function deleteFire(community, year) {
		console.log("Deleting specific resource...");
        const res = await fetch("/api/v2/fires-stats/" + community + "/" + year, {
			method: "DELETE"
			
        }).then(function (res) {
			paginationFires();
			msgExito = "Recurso eliminado";
        });
    }
	//Funcion para eliminar todos los elementos existentes
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
	//Funcion para cargar elementos iniciales
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
		<h3 style="display:block;text-align:center;">API de estadísticas de incendios en España</h3>

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
					<td>{#if msgError}<p style="color: red; border: solid; text-align: center; width: 50%; margin: 0 0;">Error: {msgError}</p>{/if} 
						{#if msgExito}<p style="color: green;border: solid; text-align: center;">Exito: {msgExito}</p>{/if}</td>
					<!--<td><Button outline color="secondary" href="#/graph-fires-stats">Gráficas</Button></td>-->
					<td>
					<Dropdown {isOpen} toggle={() => (isOpen = !isOpen)}>
						<DropdownToggle outline caret>Gráficas</DropdownToggle>
						<DropdownMenu>
							<DropdownItem href="#/graph-highchart">HighChart</DropdownItem>
							<DropdownItem href="#/graph-chartjs">Chart.js</DropdownItem>
							
							
						</DropdownMenu>
						</Dropdown>
					</td>
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
					<td><Button color="secondary" onClick="location.reload()" on:click={loadInitialData}>Cargar elementos</Button></td>
					<td></td>
					<td></td>
					<td></td>
					<td></td>
					
				</tr>
			</tbody>

		</Table>

		

	{/await}

	<Pagination style="padding-left:40%;">
		{#if pagActual !=1} <!--Si al cargar la página no es la 1, que se vaya para la 1-->
		<PaginationItem class="{pagActual === 1 ? 'disabled' : ''}">
			<PaginationLink previous href="#/fires-stats" on:click="{() => incOffset(-1)}" /><!--Botón página anterior, 
																			si estás en la 1 no existe este botón-->
		</PaginationItem>

		
		<PaginationItem><!--Cuando retroceda disminuya el número de página-->
			<PaginationLink href ="#/fires-stats" on:click="{() => incOffset(-1)}">{pagActual -1}</PaginationLink>
		</PaginationItem>
		{/if}

		<PaginationItem active> <!--Boton de pagina actual activo-->
			<PaginationLink href="#/fires-stats">{pagActual}</PaginationLink>
		</PaginationItem>

		{#if pagSiguiente && numJson >= 10}
		<PaginationItem><!--Cuando avance aumente el numero de pagina pero solo si hay mas de 10 datos, si hubiera solo 10, 
										se quedaria en la pagina 1 mostrando los 10 datos-->
			<PaginationLink href="#/fires-stats" on:click="{() => incOffset(1)}">{pagActual + 1}</PaginationLink>
		</PaginationItem>
		

		<PaginationItem class="{pagSiguiente ? '' : 'disabled'}">
			<PaginationLink next href="#/fires-stats" on:click="{() => incOffset(1)}"/><!--Botón siguiente página-->
		</PaginationItem>
		{/if}
		
		
	</Pagination>
	<Button outline color = "secondary" on:click="{pop}">Volver &#x21a9;</Button>
</main>
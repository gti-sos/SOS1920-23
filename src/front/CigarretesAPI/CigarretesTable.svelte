<script>
	import { onMount } from "svelte";
	import Table from "sveltestrap/src/Table.svelte";
    import Button from  "sveltestrap/src/Button.svelte";
	import Input from "sveltestrap/src/Input.svelte";
	import FormGroup from "sveltestrap/src/FormGroup.svelte";
	import Pagination from "sveltestrap/src/Pagination.svelte";
	import PaginationItem from "sveltestrap/src/PaginationItem.svelte";
	import PaginationLink from "sveltestrap/src/PaginationLink.svelte";
	
	let errorMsg = "";
	let exitoMsg = "";


	let cigarretes = [];
	let newCigarrete = {
		community:"",
		year:"",
		cigarrete_sale:"",
		first_variation:"",
		second_variation:""
	};
	//Para la búsqueda:
	let communitys = [];
    let years = [];
	let community2 = "";
	let year2 = "";
	let searchCommunity = "";
	let searchYear = "";
	//Para la paginación:
	let offset = 0;
	let limit = 10;
	let paginaActual = 1;
	let paginaSiguiente = true;
	
	let siguienteJson = 0;
	onMount(paginationCigarretes);

	import {
    Dropdown,
    DropdownItem,
    DropdownMenu,
    DropdownToggle
  } from 'sveltestrap';

  let isOpen = false;


	async function paginationCigarretes(){
		console.log("Fetching cigarretes sales...");
		const res = await fetch("/api/v2/cigarretes-sales?offset="+limit * offset + "&limit=" + limit);
		const siguiente = await fetch("/api/v2/cigarretes-sales");

		
//Await bloquea la instruccion, hasta que res tenga un valor
		if(res.status == 200 ){
			console.log("OK:");
			const json = await res.json();
			 siguienteJson = json.length;
			cigarretes = json;
			console.log("Received " + cigarretes.length + " cigarretes-sales.");
			if(siguienteJson.length == 0){
					paginaSiguiente == false;	//no hay mas datos
				}
				else{
					paginaSiguiente == true;	//si hay mas datos
				}
				console.log("Received " + cigarretes.length + " cigarretes.");
		}else if(res.status==404){
				paginaSiguiente = false;
				exitoMsg = "Todos los elementos han sido borrados";
			
		}
		else{
			console.log("ERROR!");
		}
	}

	async function insertCigarretes(){
		
		const res = await fetch("/api/v2/cigarretes-sales", {
			method: "POST",
			body: JSON.stringify(newCigarrete),
			headers:{
				"Content-Type":"application/json"
			}
		}).then(function (res){
			
			exitoMsg = "Insertado correctamente";
			paginationCigarretes();
			if(res.status==400){
				errorMsg = "Revise los campos";
			}
			if(res.status==409){
				errorMsg = "Ya hay una comunidad con esos datos";
			}
			
		}); //cuando es res ok
    }
	async function deleteCigarretes(community,year) {    //si no ponemos la función asíncrona no podemos hacer el await.
		console.log("Deleting cigarrete sale..")
        const res = await fetch("/api/v2/cigarretes-sales/" + community +"/" + year ,{
			method: "DELETE"

        }).then(function (res) {
            paginationCigarretes();
			exitoMsg = "Elemento borrado correctamente";
        });
	}

	async function deleteAllCigarretes(){
		console.log("Deleting all cigarretes sales..");
		const res = await fetch("/api/v2/cigarretes-sales",{
			method:"DELETE"
		}).then(function(res){
			paginationCigarretes();
			
			
		});
	}
	async function loadInitialData() {
        const res = await fetch("/api/v2/loadInitialData", {
            method: "GET"
        }).then(function (res) {
            paginationCigarretes();
			
        });
	}
	function incOffset(value){
		
		offset += value;
		paginaActual += value;
		paginationCigarretes();
	}

	
	async function searchCigarretes(community2,year2){
		var url = "/api/v2/cigarretes-sales";
		if( community2 != "" && year2 != "" ){

			url = url + "?community=" +community2+"&year="+year2;
			const res = await fetch (url);

			if(res.ok){
			exitoMsg = "Búsqueda realizada correctamente";
			console.log("OK");
			const json = await res.json();
			cigarretes = json;
				
			 
		}else{
		
			errorMsg = "No existen datos para la comunidad de " + " " + community2 + " en el año " + " " + year2;
			console.log("Error,compruebe los campos asignados a la búsqueda");
		}
		}
		else if (community2 !="" && year2==""){


			url = url + "?community=" + community2;
			const res = await fetch (url);
			
			if(res.ok){
				exitoMsg = "Búsqueda realizada correctamente";
				console.log("OK");
				const json = await res.json();
				cigarretes = json;
				
			
			 
		}else{
			errorMsg = "No existen datos para la comunidad de "+ " "+community2;
			console.log("Error,compruebe los campos asignados a la búsqueda");
		}
		}else if(community2 == "" && year2 !=""){

			url = url + "?year="+year2;
			const res = await fetch (url);

			if(res.ok){
			exitoMsg = "Búsqueda realizada correctamente";
			console.log("OK");
			const json = await res.json();
			cigarretes = json;
				
			 
		}else{
			errorMsg = "No existen datos para el año" + " " + year2;
			console.log("Error,compruebe los campos asignados a la búsqueda");
		}
		}

		
	
	}

</script>

<main>	
		{#if errorMsg}
		<p style="color: red;">Error: {errorMsg}</p>
		{/if}
		{#if exitoMsg}
		<p style="color: blue;">Éxito: {exitoMsg}</p>
		{/if}

		{#await cigarretes}	
			Loading cigarretes-sales ...
		{:then cigarretes}
		<p>
			Estás en la página: {paginaActual}
		</p>
		
		<FormGroup style="width: 15%;"> 
			<Input placeholder="Introduce la comunidad" name="community" id="community" bind:value="{searchCommunity}">
			</Input>
		</FormGroup>
				
		<FormGroup style="width: 15%;">
			<Input placeholder="Introduce el año" name="year" id="year" bind:value="{searchYear}">
			</Input>
		</FormGroup>
		
		<Button outline color="primary" on:click="{searchCigarretes(searchCommunity, searchYear)}" class="button-search"> Buscar </Button>
	
		<Table 	bordered>
			<thead>
				<tr>

					<th>Comunidad</th>
					<th>Año</th>
					<th>Venta de paquetes</th>
					<th>Primera variacion</th>
					<th>Segunda variacion</th>
					<th>
						<Dropdown {isOpen} toggle={() => (isOpen = !isOpen)}>
							<DropdownToggle outline caret>Gráficas</DropdownToggle>
							<DropdownMenu>
								<DropdownItem href="#/graph-cigarretes-sales">HighChart</DropdownItem>
								<DropdownItem href="#/graph-chartjs">Chart.js</DropdownItem>
			
			
							</DropdownMenu>
							</Dropdown>
						</th>
					
				</tr>
			</thead>

			<tbody>

				<tr>

					<td><input type="text"  pattern="[A-Za-z]{2-60}" bind:value="{newCigarrete.community}"></td>
					<td><input type="number" bind:value="{newCigarrete.year}"></td>
					<td><input type="number" bind:value="{newCigarrete.cigarrete_sale}"></td>
					<td><input type="number" bind:value="{newCigarrete.first_variation}"></td>
					<td><input type="number" bind:value="{newCigarrete.second_variation}"></td>
					<td><Button outline color="primary"  on:click={insertCigarretes}>Insertar</Button></td>
				</tr>

				{#each cigarretes as cigarrete}


				<tr>

					
					<td>
						<a href="#/cigarretes-sales/{cigarrete.community}/{cigarrete.year}">{cigarrete.community}</a>
					</td>
					<td>{cigarrete.year}</td>
					<td>{cigarrete.cigarrete_sale}</td>
					<td>{cigarrete.first_variation}</td>
					<td>{cigarrete.second_variation}</td>
					<td><Button outline color="danger" on:click="{deleteCigarretes(cigarrete.community,cigarrete.year)}">Borrar</Button></td>
				</tr>
				{/each}
				<tr>
					<td><button outline color="primary" href= "">Pulse para ver la gráfica</button></td>
				</tr>
				<tr>
					<td><Button outline color="primary" onclick="location.reload()" on:click={loadInitialData}>Inicializar</Button></td>
                    <td></td>
                    <td></td>
                    <td></td>
                    <td></td>
					<td><Button  outline color = "danger" onclick="location.reload()" on:click="{deleteAllCigarretes}"><i class= "fa fa-trash" aria-hidden="true"></i>Borrar todo</Button>
					</td>
				</tr>
			</tbody>

		
		</Table>
		

	{/await}

	<Pagination float="center">
		{#if paginaActual !=1}
		<PaginationItem class="{paginaActual == 1 ? 'disabled' : ''}">
			<PaginationLink previous href="#/cigarretes-sales" on:click="{() => incOffset(-1)}" /><!--Botón página anterior-->
		</PaginationItem>

		 <!--Si al cargar la página actual no es la 1, que se vaya para la 1-->
		<PaginationItem>
			<PaginationLink href ="#/cigarretes-sales" on:click="{() => incOffset(-1)}">{paginaActual -1}</PaginationLink>
		</PaginationItem>
		{/if}

		<PaginationItem active> <!--Boton de pagina actual activo-->
			<PaginationLink href="#/cigarretes-sales">{paginaActual}</PaginationLink>
		</PaginationItem>

		{#if paginaSiguiente && siguienteJson>= 9 }
		<PaginationItem>
			<PaginationLink href="#/cigarretes-sales" on:click="{() => incOffset(1)}">{paginaActual + 1}</PaginationLink>
		</PaginationItem>
		

		<PaginationItem class="{paginaSiguiente ? '' : 'disabled'}">
			<PaginationLink next href="#/cigarretes-sales" on:click="{() => incOffset(1)}"/><!--Botón siguiente página-->
		</PaginationItem>
		{/if}
		
		
	</Pagination>
	
	
</main>

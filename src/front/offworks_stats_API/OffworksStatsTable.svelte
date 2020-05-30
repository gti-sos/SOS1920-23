<script>
    import Table from "sveltestrap/src/Table.svelte";
    import Button from  "sveltestrap/src/Button.svelte";
    import { Pagination, PaginationItem, PaginationLink } from 'sveltestrap';
    import Input from "sveltestrap/src/Input.svelte";
	import Label from "sveltestrap/src/Label.svelte";
	import FormGroup from "sveltestrap/src/FormGroup.svelte";

    import { pop } from "svelte-spa-router"
    
    import { onMount } from "svelte";

    let offworks = [];
    
    let offwork = {
        community: "",
        year: "",
        accident: "",
        sick: "",
        numberzone: ""
	};
	let searchOff = {
		community: "",
        year: "",
        accident: "",
        sick: "",
        numberzone: ""
	};

	let limit = 10;
	let offset = 0;
	let msgOk = false;
	let msgErr = false;
	let actualPag = 1;
	let Pagsig = true;
	let njson=0;
	//let njsonbusqueda=0;
	let msgOkBusq = false;
	let msgErrBusq = false;
	let campo="";
	let value="";
	let conjCommunity= [];
	let conjYears = [];
	let y = "-";
	let c = "-";
	let communityOn = false;
	let yearOn = false;
	//let accidentOn = false;
	//let sickOn = false;
	//let numberZoneOn = false;
    onMount(getOffworksPag);

    async function loadInitialData() {
        const res = await fetch("/api/v2/offworks-stats/loadInitialData", {
            method: "GET"
        }).then(function (res) {
			getOffworksPag();
			if(res.status == 200){
				msgOk = "Datos iniciales cargados correctamente ";
				msgErr = false;
			}
        });
	}

    async function getOffworksPag(){

		console.log("Fetching Offworks..."+offset+" "+(offset+1));
		const res = await fetch("/api/v2/offworks-stats?offset=" + limit * offset + "&limit=" + limit);
		const resConj = await fetch("/api/v2/offworks-stats");
		if (res.ok){
			console.log("Ok");
			const json = await res.json();
			offworks = json;
			njson=json.length;
			//console.log(json.length);

			const json2 = await resConj.json();
			conjCommunity = json2.map((c) => {
					return c.community;
			});
			conjCommunity = Array.from(new Set(conjCommunity)); 
			conjYears = json2.map((y) => {
					return y.year;
			});
			conjYears = Array.from(new Set(conjYears));

			if (json.length ==0){
				Pagsig = false;
			}else{
				Pagsig = true;
			}
			console.log("Received "+offworks.length+" offworks");
		}else if(res.status == 404){
			console.log("Error");
			Pagsig = false;
		}
	}

    async function insertOffworks() {
        console.log("Inserting offworks-stats..." + JSON.stringify(offwork));
        const res = await fetch("/api/v2/offworks-stats", {
            method: "POST",
            body: JSON.stringify(offwork),
            headers: {
                "Content-Type": "application/json"
            }
        }).then(function (res) {
            getOffworksPag();
            if(res.status == 201){
				msgOk = "Se ha añadido correctamente";
				msgErr = false;
			}else if(res.status == 400){
				msgOk = false;
				msgErr = "No puede estar ningun campo vacio";
			}else{
				msgOk = false;
				msgErr = "Ya existe";
			}
        });
    }

    async function deleteOffwors(community, year) {
        console.log("Deleting Offworks...");
		const res = await fetch("/api/v2/offworks-stats/"+community+"/"+year, {
			method: "DELETE"
		}).then(function (res) {
            getOffworksPag();
			if(res.status == 200){
				msgOk = "Dato borrado correctamente";
				msgErr = false;
			}
		});
    }

    async function deleteAllOffworks() {
	    console.log("Deleting All Offworks...");
		const res = await fetch("/api/v2/offworks-stats", {
			method: "DELETE"
		}).then(function (res) {
            getOffworksPag();
			if(res.status == 200){
				msgOk = "Dato borrado correctamente";
				msgErr = false;
				location.reload();
			}else{
				msgOk = false;
				msgErr="Error";
				//location.reload();
			}
		});
    }


	async function searchComAndYear(community, year) {
		offset = 0;
		actualPag = 1; 
        Pagsig = false;
		console.log("Searching data: " + community + " and " + year);
		var url = "/api/v2/offworks-stats";
		if (community != "-" && year != "-") {
			url = url + "?community=" + community + "&year=" + year; 
		} else if (community != "-" && year == "-") {
			url = url + "?community=" + community;
		} else if (community == "-" && year != "-") {
			url = url + "?year=" + year;
		}
		console.log("url: " + url);
		const res = await fetch(url);
		if (res.ok) {
			console.log("Ok:");
			const json = await res.json();
			offworks = json;
			console.log("Found " + offworks.length + " offworks.");
			msgOkBusq = "Busqueda realizada";
			msgErrBusq = false;
		} else {
			msgOkBusq = false;
			msgErrBusq = "No hay resultados";
			console.log("ERROR!");
		}
		
	}
	async function sumOffset(value){
		offset += value;
		actualPag += value;
		getOffworksPag();
	}

</script>


<main>
	
	{#await offworks}
		Loading offworks...
	{:then offworks}
	
	<h4>Busqueda por comunidad y/o año</h4>
	<div style="display: inline-block;width: 10%;" >
		<FormGroup style="width:100%;"> 
			<Label for="selectComunnity"> Comunidad </Label>
			<Input type="select" name="selectComunnity" id="selectComunnity" bind:value="{c}">
				{#each conjCommunity as community}
				<option>{community}</option>
				{/each}
				<option>-</option>
			</Input>
		</FormGroup>
	</div>	
	<div style="margin: 2px 10px;display:inline-block;width: 10%;">
		<FormGroup style="width:100%;"> 
			<Label for="selectYear"> Año </Label>
			<Input type="select"  name="selectYear" id="selectYear" bind:value="{y}">
				{#each conjYears as year}
				<option>{year}</option>
				{/each}
				<option>-</option>
			</Input>
		</FormGroup>
	</div>
	<div style="margin: 2px 10px;display:inline-block;">
		<Button color="info" on:click="{searchComAndYear(c,y)}"> Buscar </Button>
	</div>
	{#if msgErrBusq}
        <p style="color: red">ERROR: {msgErrBusq}</p>
	{/if}
	{#if msgOkBusq}
        <p style="color: green">EXITO: {msgOkBusq}</p>
	{/if}
		<Table bordered >
			<thead >
				<tr>
					<th>Comunidad</th>
					<th>Año</th>
					<th>Accidentes</th>
					<th>Enfermedades</th>
					<th>Numero de zonas</th>
					<th>Acciones</th>
				</tr>
			</thead>
			<tbody>
				{#each offworks as off}
					<tr>
						<td><a style="text-align: center;" href="#/offworks-stats/{off.community}/{off.year}">{off.community.replace(/-/g, " ")}</a></td>
						<td>{off.year}</td>
						<td>{off.accident}</td>
						<td>{off.sick}</td>
						<td>{off.numberzone}</td>
						<td> <Button outline color="danger" on:click="{deleteOffwors(off.community, off.year)}">
							Borrar </Button> </td> <!--Borrar un recurso-->
							
					</tr>
				{/each}
				<tr style="background-color:rgba(217, 219, 255, 0.945);">
					<td><Input type="text" bind:value="{offwork.community}"/></td>
					<td><Input type="number" bind:value="{offwork.year}"/></td>
					<td><Input type="number" bind:value="{offwork.accident}"/></td>
					<td><Input type="number" bind:value="{offwork.sick}"/></td>
					<td><Input type="number" bind:value="{offwork.numberzone}"/></td>
					<td> <Button  color="primary" on:click={insertOffworks}> Añadir</Button> </td>	
				</tr>
			</tbody>
		</Table>
	{/await}

	{#if msgErr}
        <p style="color: red">ERROR: {msgErr}</p>
	{/if}
	{#if msgOk}
        <p style="color: green">EXITO: {msgOk}</p>
	{/if}
	
	<Pagination style="padding-left: 40%" ariaLabel="Cambio de página">
		{#if actualPag != 1}
		<PaginationItem class="{actualPag === 1 ? 'disabled' : ''}">
			<PaginationLink previous href="#/offworks-stats" on:click="{() => sumOffset(-1)}" />
	   </PaginationItem>

		<PaginationItem>
			<PaginationLink href="#/offworks-stats" on:click="{() => sumOffset(-1)}" >{actualPag - 1}</PaginationLink>
		</PaginationItem>
		{/if}
		<PaginationItem active>
			<PaginationLink href="#/offworks-stats" >{actualPag}</PaginationLink>
		</PaginationItem>

		{#if Pagsig && njson>=9}
		<PaginationItem >
			<PaginationLink href="#/offworks-stats" on:click="{() => sumOffset(1)}">{actualPag + 1}</PaginationLink>
		</PaginationItem>
		

		<PaginationItem class="{Pagsig ? '' : 'disabled'}">
		  <PaginationLink next href="#/offworks-stats" on:click="{() => sumOffset(1)}"/>
		</PaginationItem>
		{/if}

		
	</Pagination>

<Button outline color="secondary" on:click="{pop}"> Volver </Button>
<Button outline on:click={deleteAllOffworks} color="danger"> <i class="fa fa-trash" aria-hidden="true"></i>Borrar todo </Button> <!--Borrar todos recursos-->
<Button outline on:click={loadInitialData} color="primary"> <i class="fas fa-download"></i> Cargar Datos Iniciales </Button>
</main>

<style>
	td {text-align: center;} 
	th {text-align: center;} 
	
</style>

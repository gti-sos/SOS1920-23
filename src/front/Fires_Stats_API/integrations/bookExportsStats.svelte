<script>
    import  { onMount } from "svelte";
	import { pop } from "svelte-spa-router";
	import Table from "sveltestrap/src/Table.svelte";
    import Button from "sveltestrap/src/Button.svelte";

    const url = "https://sos1920-30.herokuapp.com/api/v3/sugarconsume";

    onMount(getBookExports);

    let book_exports =[];

async function getBookExports(){
    console.log("Fetching books exports...");
    const res = await fetch(url);
    if(res.ok){
        console.log("ok");
        const json = await res.json();
        book_exports = json;
        console.log("Received " + book_exports.length + " books exports");
    }
    else{
        console.log("Error");
    }
}
/*No muestra los datos*/
</script>

<main>

	{#await getBookExports}
		Loading books exports stats ...
	{:then getBookExports}
		<figure class="highcharts-figure">
            <div id="container"></div>
                <p class="highcharts-description">
                        Esta API muestra información sobre exportaciones de libros de diferentes paises, exportaciones de libros, de editoriales y del sector gráfico.
                </p>	
        </figure>
        
		<Table bordered>
			<thead>
				<tr>
					<th>Pais</th>
					<th>Año</th>
					<th>Exportaciones de libros</th>
					<th>Exportaciones de editoriales</th>
                    <th>Exportaciones del sector gráfico</th>

				</tr>
			</thead>
			<tbody>
				{#each book_exports as exp}
				<tr>
                    <td>{exp.country}</td>
                    <td>{exp.year}</td>
                    <td>{exp["exp_book"]}</td>
                    <td>{exp["exp_editorial"]}</td>
                    <td>{exp["exp_graphic_sector"]}</td>

				</tr>
				{/each}
			</tbody>
		</Table>
	{/await}
	
</main>

 <Button outline color="secondary" on:click="{pop}">Atrás &#x21a9;</Button>
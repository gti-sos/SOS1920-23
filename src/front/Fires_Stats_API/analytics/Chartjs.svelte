<script>
  import { onMount } from "svelte";
  //import Chart from "chart.js";
  import Button from  "sveltestrap/src/Button.svelte";
  import { pop } from "svelte-spa-router";
  onMount(async () => {});

  
  async function loadGraph() {
    
    let Datos = [];

        const res = await fetch("api/v2/fires-stats");
        Datos = await res.json();

        let comunidad = Datos.filter((Datos)=> Datos.year===2007).map((Datos) => Datos.community);
        let incendio = Datos.filter((Datos) => Datos.year===2007).map((Datos) => Datos.total_fire);
        let forest = Datos.filter((Datos) => Datos.year===2007).map((Datos) => Datos.forest_area);
        let noForest = Datos.filter((Datos) => Datos.year===2007).map((Datos) => Datos.non_forest_area);
    
    
    var ctx = document.getElementById("myChart").getContext("2d");
    var chart = new Chart(ctx, {
      type: "bar",
      data: {
        labels: comunidad,
        datasets: [
          {
            label: "Nº Incendios 2007",
            backgroundColor: "rgb(230, 126, 34)",
            borderColor: "rgb(23, 32, 42)",
            data: incendio
          },
          {
            label: "Área Forestal(htras)",
            backgroundColor: "rgb(120, 126, 4)",
            borderColor: "rgb(23, 32, 42)",
            data: forest
          },
          {
            label: "Área no Forestal(htras)",
            backgroundColor: "rgb(20, 90, 50)",
            borderColor: "rgb(23, 32, 42)",
            data: noForest
          }
        ]
      },
      options: {}
    });
  }
</script>
<h5 class="titulo">Gráfica que muestra los incendios forestales en España en el año 2006, junto con el área forestal y no forestal de cada comunidad autónoma</h5>
<svelte:head>
    <script src="https://cdn.jsdelivr.net/npm/chart.js@2.8.0" on:load="{loadGraph}"></script>
</svelte:head>

<canvas id="myChart"></canvas>

<h8>
        <Button outline color="secondary" on:click="{pop}">Atrás &#x21a9;</Button>
</h8>

<style>
.titulo{
  text-align: center;
}
</style>

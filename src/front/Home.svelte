<script>
	import Button from  "sveltestrap/src/Button.svelte";
	import Table from "sveltestrap/src/Table.svelte";

</script>

<h4>Tablas de Estadísticas:</h4>

<p><Button type="button" color="info" onclick="window.location.href='#/fires-stats'"> API de estadísticas de incendios en España</Button></p>
		
<p><Button type="button" color="info" onclick="window.location.href='#/cigarretes-sales'"> API de estadísticas de venta de tabaco en España</Button></p>

<p><Button type="button" color="info" onclick="window.location.href='#/offworks-stats'"> API de bajas laborales en España </Button></p>


<h4>Gráficos Estadísticos:</h4>


<p><Button type="button" color="white" style="color:rgb(40, 83, 53);border-color:blue;" onclick="window.location.href='#/graph-highchart'"> Grafica HighChart de incendios en España </Button></p>
<p><Button type="button" color="white" style="color:rgb(40, 83, 53);border-color:blue;" onclick="window.location.href='#/graph-chartjs'"> Grafica Chart.js de incendios en España </Button></p>

<p><Button type="button" color="white" style="color:rgb(40, 83, 53);border-color:red;" onclick="window.location.href='#/graph-cigarretes-sales'"> Grafica HighChart de venta de paquetes de tabaco en España </Button></p>
<p><Button type="button" color="white" style="color:rgb(40, 83, 53);border-color:red;" onclick="window.location.href='#/chart-cigarretes-sales'"> Grafica plot.ly de venta de paquetes de tabaco en España </Button></p>

<p><Button type="button" color="white" style="color:rgb(40, 83, 53);border-color:brown;" onclick="window.location.href='#/graph-offworks-stats'"> Grafica HighChart de bajas laborales en España </Button></p>
<p><Button type="button" color="white" style="color:rgb(40, 83, 53);border-color:brown;" onclick="window.location.href='#/Rgraph-offworks-stats'"> Grafica Rgraph de bajas laborales en España </Button></p>



<h4>Integraciones:</h4>

<p><Button type="button" color="info" onclick="window.location.href='#/Integrations'"> Integraciones</Button></p>


<h4>Gráfica Grupal:</h4>

<p><Button type="button" color="warning" onclick="window.location.href='#/Analytics'"> Estadística Grupal </Button></p>

<h4>Videos explicativos:</h4>

<p><Button type="button" color="warning" onclick="window.location.href='#/About'"> Videos apis </Button></p>

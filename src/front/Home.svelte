<script>
	import Button from  "sveltestrap/src/Button.svelte";
</script>


<main>
	<div class="div-home">
		<Button type="button" color="info" onclick="window.location.href='#/fires-stats'"> API de estadísticas de incendios en España</Button>
		<Button type="button" color="info" onclick="window.location.href='#/cigarretes-sales'"> API de estadísticas de venta de tabaco en España</Button>
		<Button type="button" color="info" onclick="window.location.href='#/offworks-stats'"> API de accidentes en España </Button>
	</div>
</main>

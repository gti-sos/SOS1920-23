<script>
	import FiresStatsTable from './FiresStatsTable.svelte';
	import GraphHighchart from './Fires_Stats_API/analytics/HighChart.svelte';
	import Chartjs from './Fires_Stats_API/analytics/Chartjs.svelte';
	import integrations from './Fires_Stats_API/integrations/integrations.svelte';
	import pluginVehiclesStats from './Fires_Stats_API/integrations/pluginVehiclesStats.svelte';
</script>

<main>
	<FiresStatsTable />
	<GraphHighchart/>
	<Chartjs/>
	<integrations/>
	<pluginVehiclesStats/>
</main>
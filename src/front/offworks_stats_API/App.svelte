<script>
	import OffworksStatsTable from './OffworksStatsTable.svelte';
	import GraphOffworksStats from './offworks_stats_API/analytics/GraphOffworksStats.svelte';
	import RGraphOffworksStats from './offworks_stats_API/analytics/RGraphOffworksStats.svelte';
	import integrationsA from './offworks_stats_API/integrations/integrations.svelte';
</script>

<main>
	<OffworksStatsTable />
	<GraphOffworksStats/>
	<RGraphOffworksStats/>
	<integrationsA/>
</main>
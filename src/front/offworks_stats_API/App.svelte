<script>
	import OffworksStatsTable from './OffworksStatsTable.svelte';
	import GraphOffworksStats from './offworks_stats_API/analytics/GraphOffworksStats.svelte';
	import RGraphOffworksStats from './offworks_stats_API/analytics/RGraphOffworksStats.svelte';
	import integrationsA from './offworks_stats_API/integrations/integrations.svelte';
	import basketIntegration from './offworks_stats_API/integrations/basketIntegration.svelte';
	import drivingLicensesIntegration from './offworks_stats_API/integrations/drivingLicensesIntegration.svelte';
</script>

<main>
	<OffworksStatsTable />
	<GraphOffworksStats/>
	<RGraphOffworksStats/>
	<integrationsA/>
	<basketIntegration/>
	<drivingLicensesIntegration/>
</main>
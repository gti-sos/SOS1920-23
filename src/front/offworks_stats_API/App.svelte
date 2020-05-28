<script>
	import OffworksStatsTable from './OffworksStatsTable.svelte';
	import GraphOffworksStats from './offworks_stats_API/analytics/GraphOffworksStats.svelte';
	import RGraphOffworksStats from './offworks_stats_API/analytics/RGraphOffworksStats.svelte';
	import integrationsA from './offworks_stats_API/integrations/integrations.svelte';
	import basketIntegration from './offworks_stats_API/integrations/basketIntegration.svelte';
	import drivingLicensesIntegration from './offworks_stats_API/integrations/drivingLicensesIntegration.svelte';
	import ppasIntegration from './offworks_stats_API/integrations/ppasIntegration.svelte';
	import ruralTourismIntegration from './offworks_stats_API/integrations/ruralTourismIntegration.svelte';
	import nuclearEnergyIntegration from './offworks_stats_API/integrations/nuclearEnergyIntegration.svelte';
	import indiceMasaIntegration from './offworks_stats_API/integrations/indiceMasaIntegration.svelte';
	import goalscorersIntegration from './offworks_stats_API/integrations/goalscorersIntegration.svelte';
</script>

<main>
	<OffworksStatsTable />
	<GraphOffworksStats/>
	<RGraphOffworksStats/>
	<integrationsA/>
	<basketIntegration/>
	<drivingLicensesIntegration/>
	<ppasIntegration/>
	<ruralTourismIntegration/>
	<nuclearEnergyIntegration/>
	<indiceMasaIntegration/>
	<goalscorersIntegration/>
</main>
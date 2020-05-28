<script>

	import Router from 'svelte-spa-router';

	import Home from './Home.svelte';
	import NotFound from './NotFound.svelte';

	//Import archivos API Fires
	import FiresStatsTable from './Fires_Stats_API/FiresStatsTable.svelte';
	import EditFiresStats from './Fires_Stats_API/EditFiresStats.svelte';
	import GraphHighchart from './Fires_Stats_API/analytics/HighChart.svelte';
	import Chartjs from './Fires_Stats_API/analytics/Chartjs.svelte';
	import integrations from './Fires_Stats_API/integrations/integrations.svelte';
	import pluginVehiclesStats from './Fires_Stats_API/integrations/pluginVehiclesStats.svelte'; 
	//Import archivos API offworks
	import OffworksStatsTable from './offworks_stats_API/OffworksStatsTable.svelte';
	import EditOffworksStats from './offworks_stats_API/EditOffworksStats.svelte';
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
	//Import archivos API Cigarretes Sales
	import CigarretesTable from './CigarretesAPI/CigarretesTable.svelte';
	import GraphCigarretesSales from './CigarretesAPI/analytics/GraphCigarretesSales.svelte';
	import EditCigarretesSales from './CigarretesAPI/EditCigarretesSales.svelte';
	import ChartCigarretesSales from './CigarretesAPI/analytics/ChartCigarretesSales.svelte';


	const routes = {
		"/" : Home,
		

		"/fires-stats" : FiresStatsTable,
		"/graph-highchart" : GraphHighchart,
		"/graph-chartjs" : Chartjs,
		"/fires-stats/:community/:year" : EditFiresStats,
		"/fires-stats-integrations/integrations" : integrations,
		"/fires-stats-integrations/integrations/plugin-vehicles-stats" : pluginVehiclesStats,
		
		"/offworks-stats" : OffworksStatsTable,
		"/offworks-stats/:community/:year" : EditOffworksStats,
		"/graph-offworks-stats" : GraphOffworksStats,
		"/Rgraph-offworks-stats" : RGraphOffworksStats,
		"/offworks-stats-integrations/integrations" : integrationsA,
		"/offworks-stats-integrations/integrations/basketIntegration" : basketIntegration,
		"/offworks-stats-integrations/integrations/drivingLicensesIntegration" : drivingLicensesIntegration,
		"/offworks-stats-integrations/integrations/ppasIntegration" : ppasIntegration,
		"/offworks-stats-integrations/integrations/ruralTourismIntegration" : ruralTourismIntegration,
		"/offworks-stats-integrations/integrations/nuclearEnergyIntegration" : nuclearEnergyIntegration,
		"/offworks-stats-integrations/integrations/indiceMasaIntegration" : indiceMasaIntegration,
		"/offworks-stats-integrations/integrations/goalscorersIntegration" : goalscorersIntegration,
		
		"/cigarretes-sales" : CigarretesTable,
		"/cigarretes-sales/:community/:year" : EditCigarretesSales,
		"/graph-cigarretes-sales" : GraphCigarretesSales,
		"/chart-cigarretes-sales" : ChartCigarretesSales,
		"*" : NotFound
	};


</script>


<main>
	
	<Router {routes} />
	
</main>


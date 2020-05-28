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
	import emigrantsStats from './Fires_Stats_API/integrations/emigrantsStats.svelte';
	import notHospitalizedStats from './Fires_Stats_API/integrations/notHospitalizedStats.svelte';
	import importsStats from './Fires_Stats_API/integrations/importsStats.svelte';
	import bookExportsStats from './Fires_Stats_API/integrations/bookExportsStats.svelte';
	import sugarConsumeStats from './Fires_Stats_API/integrations/sugarConsumeStats.svelte';
	import drugOffencesStats from './Fires_Stats_API/integrations/drugOffencesStats.svelte';
	//Import archivos API offworks
	import OffworksStatsTable from './offworks_stats_API/OffworksStatsTable.svelte';
	import EditOffworksStats from './offworks_stats_API/EditOffworksStats.svelte';
	import GraphOffworksStats from './offworks_stats_API/analytics/GraphOffworksStats.svelte';
	import RGraphOffworksStats from './offworks_stats_API/analytics/RGraphOffworksStats.svelte';
	import integrationsA from './offworks_stats_API/integrations/integrations.svelte';
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
		"/fires-stats-integrations/integrations/emigrant-stats" : emigrantsStats,
		"/fires-stats-integrations/integrations/not-hosp-stats": notHospitalizedStats,
		"/fires-stats-integrations/integrations/imports": importsStats,
		"/fires-stats-integrations/integrations/book-exports":bookExportsStats,
		"/fires-stats-integrations/integrations/sugar-consume":sugarConsumeStats,
		"/fires-stats-integrations/integrations/drug-offences": drugOffencesStats,
		
		"/offworks-stats" : OffworksStatsTable,
		"/offworks-stats/:community/:year" : EditOffworksStats,
		"/graph-offworks-stats" : GraphOffworksStats,
		"/Rgraph-offworks-stats" : RGraphOffworksStats,
		"/offworks-stats-integrations/integrations" : integrationsA,
		
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


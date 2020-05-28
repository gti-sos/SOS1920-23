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
	//Import archivos API Cigarretes Sales
	import CigarretesTable from './CigarretesAPI/CigarretesTable.svelte';
	import GraphCigarretesSales from './CigarretesAPI/analytics/GraphCigarretesSales.svelte';
	import EditCigarretesSales from './CigarretesAPI/EditCigarretesSales.svelte';
	import ChartCigarretesSales from './CigarretesAPI/analytics/ChartCigarretesSales.svelte';
	import pluginTrafficAccidents from './CigarretesAPI/integrations/pluginTrafficAccidents.svelte';
	import pluginGCE from './CigarretesAPI/integrations/pluginGCE.svelte';
	import pluginFoodImports from './CigarretesAPI/integrations/pluginFoodImports.svelte';
	import pluginElectricity from './CigarretesAPI/integrations/pluginElectricity.svelte';
	import pluginNatality from './CigarretesAPI/integrations/pluginNatality.svelte';
	import pluginRenewable from './CigarretesAPI/integrations/pluginRenewable.svelte';
	import pluginLife from './CigarretesAPI/integrations/pluginLife.svelte';




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
		
		"/cigarretes-sales" : CigarretesTable,
		"/cigarretes-sales/:community/:year" : EditCigarretesSales,
		"/graph-cigarretes-sales" : GraphCigarretesSales,
		"/chart-cigarretes-sales" : ChartCigarretesSales,
		"/cigarretes-sales-integrations/integrations/pluginTrafficAccidents" : pluginTrafficAccidents,
		"/cigarretes-sales-integrations/integrations/pluginGCE" :pluginGCE,
		"/cigarretes-sales-integrations/integrations/pluginFoodImports" : pluginFoodImports,
		"/cigarretes-sales-integrations/integrations/pluginElectricity" : pluginElectricity,
		"/cigarretes-sales-integrations/integrations/pluginNatality" : pluginNatality,
		"/cigarretes-sales-integrations/integrations/pluginRenewable" : pluginRenewable,
		"/cigarretes-sales-integrations/integrations/pluginLife" : pluginLife,
		"*" : NotFound
	};


</script>


<main>
	
	<Router {routes} />
	
</main>


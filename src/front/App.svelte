<script>

	import Router from 'svelte-spa-router';

	import Home from './Home.svelte';
	import NotFound from './NotFound.svelte';

	//Import archivos API Fires
	import FiresStatsTable from './Fires_Stats_API/FiresStatsTable.svelte';
	import EditFiresStats from './Fires_Stats_API/EditFiresStats.svelte';
	import GraphFiresStats from './Fires_Stats_API/GraphFiresStats.svelte';
	//Import archivos API offworks
	import OffworksStatsTable from './offworks_stats_API/OffworksStatsTable.svelte';
	import EditOffworksStats from './offworks_stats_API/EditOffworksStats.svelte';
	//Import archivos API Cigarretes Sales
	import CigarretesTable from './CigarretesAPI/CigarretesTable.svelte';
	import EditCigarretesSales from './CigarretesAPI/EditCigarretesSales.svelte';

	const routes = {
		"/" : Home,
		

		"/fires-stats" : FiresStatsTable,
		"/graph-fires-stats" : GraphFiresStats,
		"/fires-stats/:community/:year" : EditFiresStats,
		
		"/offworks-stats" : OffworksStatsTable,
		"/offworks-stats/:community/:year" : EditOffworksStats,
		
		"/cigarretes-sales" : CigarretesTable,
		"/cigarretes-sales/:community/:year" : EditCigarretesSales,
		
		
		"*" : NotFound
	};


</script>


<main>
	
	<Router {routes} />
	
</main>


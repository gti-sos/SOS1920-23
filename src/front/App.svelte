<script>

	import Router from 'svelte-spa-router';
	import Home from './Home.svelte';
	import NotFound from './NotFound.svelte';

	//Import archivos API Fires
	import FiresStatsTable from './Fires_Stats_API/FiresStatsTable.svelte';
	import EditFiresStats from './Fires_Stats_API/EditFiresStats.svelte';

	//Import archivos API Cigarretes sales
	import CigarretesTable from './CigarretesAPI/CigarretesTable.svelte';
	import EditCigarretesSales from './CigarretesAPI/EditCigarretesSales.svelte';

	
	const routes = {
		"/" : Home,
		

		"/fires-stats" : FiresStatsTable,
		"/fires-stats/:community/:year" : EditFiresStats,

		"/cigarretes-sales": CigarretesTable,
		"/cigarretes-sales/:community/:year": EditCigarretesSales,

		"*" : NotFound
	};


</script>


<main>
	<h1>API</h1>
	<Router {routes} />
	
</main>


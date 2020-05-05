<script>

	import CigarretesTable from './CigarretesAPI/CigarretesTable.svelte';
	





	import Router from 'svelte-spa-router';

	import Home from './Home.svelte';
	import NotFound from './NotFound.svelte';

	//Import archivos API Fires
	import FiresStatsTable from './Fires_Stats_API/FiresStatsTable.svelte';
	import EditFiresStats from './Fires_Stats_API/EditFiresStats.svelte';


	const routes = {
		"/" : Home,
		

		"/fires-stats" : FiresStatsTable,
		"/fires-stats/:community/:year" : EditFiresStats,

		"*" : NotFound
	};


</script>


<main>
	<h1>API</h1>
	<Router {routes} />
	
</main>


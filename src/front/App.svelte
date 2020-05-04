<script>
	import Router from 'svelte-spa-router';

	import Home from './Home.svelte';
	import NotFound from './NotFound.svelte';

	//Import archivos API Fires
	import FiresStatsTable from './Fires_Stats_API/FiresStatsTable.svelte';
	import EditFire from './Fires_Stats_API/EditFiresStats.svelte';


	const routes = {
		"/" : Home,
		

		"/fires-stats-info" : FiresStatsTable,
		"/fires-stats-info/:community" : EditFire,

		"*" : NotFound
	}


</script>


<main>
	<h1>Select an API</h1>
	<Router {routes} />
	
</main>
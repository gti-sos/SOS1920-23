<script>
import Router from 'svelte-spa-router';
	import FiresStatsTable from './Fires_Stats_API/FiresStatsTable.svelte';
	
	
	const fires = {
		
		"/FiresStatsTable": FiresStatsTable,
		
		
	};
</script>

<main>
	<Router {fires} />
</main>
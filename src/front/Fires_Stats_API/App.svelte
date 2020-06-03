<script>
	import FiresStatsTable from './FiresStatsTable.svelte';
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
	import apiExterna1 from './Fires_Stats_API/integrations/apiExterna1.svelte';
	import apiExterna2 from './Fires_Stats_API/integrations/apiExterna2.svelte';
</script>

<main>
	<FiresStatsTable />
	<GraphHighchart/>
	<Chartjs/>
	<integrations/>
	<pluginVehiclesStats/>
	<emigrantsStats/>
	<notHospitalizedStats/>
	<importsStats/>
	<bookExportsStats/>
	<sugarConsumeStats/>
	<drugOffencesStats/>
	<apiExterna1/>
	<apiExterna2/>
</main>
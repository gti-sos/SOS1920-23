<script>

	import Router from 'svelte-spa-router';

	import Home from './Home.svelte';
	import NotFound from './NotFound.svelte';
	import Integrations from './Integrations.svelte';
	import Analytics from './Analytics.svelte';
	import About from './About.svelte';


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
	import apiExterna1 from './Fires_Stats_API/integrations/apiExterna1.svelte';
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
	import apiExterna1Integration from './offworks_stats_API/integrations/apiExterna1Integration.svelte';
	import apiExterna2Integration from './offworks_stats_API/integrations/apiExterna2Integration.svelte';
	import apiExterna3Integration from './offworks_stats_API/integrations/apiExterna3Integration.svelte';
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
		"/analytics": Analytics,
		"/integrations": Integrations,
		"/about": About,

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
		"/fires-stats-integrations/integrations/api-externa-1": apiExterna1,
		
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
		"/offworks-stats-integrations/integrations/apiExterna1Integration" : apiExterna1Integration,
		"/offworks-stats-integrations/integrations/apiExterna2Integration" : apiExterna2Integration,
		"/offworks-stats-integrations/integrations/apiExterna3Integration" : apiExterna3Integration,
		
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


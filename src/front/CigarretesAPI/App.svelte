<script>
	import CigarretesTable from './CigarretesTable.svelte';
	import GraphCigarretesSales from './CigarretesAPI/analytics/GraphCigarretesSales.svelte';
	import ChartCigarretesSales from './CigarretesAPI/analytics/GraphCigarretesSales.svelte';
	import pluginTrafficAccidents from './CigarretesAPI/integrations/pluginTrafficAccidents.svelte';
	import pluginGCE from './CigarretesAPI/integrations/pluginGCE.svelte';
</script>

<main>
	<CigarretesTable />
	<GraphCigarretesSales />
	<ChartCigarretesSales />
	<pluginTrafficAccidents />
	<pluginGCE />

</main>
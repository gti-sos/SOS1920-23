<script>
	import CigarretesTable from './CigarretesTable.svelte';
	import GraphCigarretesSales from './CigarretesAPI/analytics/GraphCigarretesSales.svelte';
	import ChartCigarretesSales from './CigarretesAPI/analytics/GraphCigarretesSales.svelte';
	import pluginTrafficAccidents from './CigarretesAPI/integrations/pluginTrafficAccidents.svelte';
	import pluginGCE from './CigarretesAPI/integrations/pluginGCE.svelte';
	import pluginFoodImports from './CigarretesAPI/integrations/pluginFoodImports.svelte';
	import pluginElectricity from './CigarretesAPI/integrations/pluginElectricity.svelte';
	import pluginNatality from './CigarretesAPI/integrations/pluginNatality.svelte';
	import pluginRenewable from './CigarretesAPI/integrations/pluginRenewable.svelte';
	import pluginLife from './CigarretesAPI/integrations/pluginLife.svelte';
	import pluginExterna1 from './CigarretesAPI/integrations/pluginExterna1.svelte';
	import pluginExterna2 from './CigarretesAPI/integrations/pluginExterna2.svelte';

</script>

<main>
	<CigarretesTable />
	<GraphCigarretesSales />
	<ChartCigarretesSales />
	<pluginTrafficAccidents />
	<pluginGCE />
	<pluginFoodImports />
	<pluginElectricty />
	<pluginNatality />
	<pluginRenewable />
	<pluginLife />
	<pluginExterna1 />
	<pluginExterna2 />
</main>
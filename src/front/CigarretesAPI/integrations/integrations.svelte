<script>

    import {
        pop
    } from "svelte-spa-router";
    import Button from "sveltestrap/src/Button.svelte";
</script>
<main style="text-align:center;">
<h3>Integraciones </h3>
<h4>Apis Externas: </h4>
<p><Button type="button" color="success" onclick="window.location.href='#/cigarretes-sales-integrations/integrations/pluginExterna1'">Estadísticas sobre paises</Button></p>
		
<p><Button type="button" color="success" onclick="window.location.href='#/cigarretes-sales-integrations/integrations/pluginExterna2'">Información sobre aeropuertos en EEUU</Button></p>
<h4>Apis de Compañeros: </h4>

    <p><Button type="button" color="success" onclick="window.location.href='#/cigarretes-sales-integrations/integrations/pluginTrafficAccidents'">Análisis del tráfico en España</Button></p>
    <p><Button type="button" color="success" onclick="window.location.href='#/cigarretes-sales-integrations/integrations/pluginElectricity'">Electricidad producida</Button></p>
    <p><Button type="button" color="success" onclick="window.location.href='#/cigarretes-sales-integrations/integrations/pluginGCE'">GCE</Button></p>
    <p><Button type="button" color="success" onclick="window.location.href='#/cigarretes-sales-integrations/integrations/pluginNatality'">Estadísticas de natalidad</Button></p>
    <p><Button type="button" color="success" onclick="window.location.href='#/cigarretes-sales-integrations/integrations/pluginRenewable'">Estadísticas de fuentes renovables</Button></p>
    <p><Button type="button" color="success" onclick="window.location.href='#/cigarretes-sales-integrations/integrations/pluginLife'">Esperanza de vida</Button></p>
    <p><Button type="button" color="success" onclick="window.location.href='#/cigarretes-sales-integrations/integrations/pluginFoodImports'">Importaciones de comida</Button></p>

        <Button outline color="secondary" on:click="{pop}">Atrás &#x21a9;</Button>
</main>
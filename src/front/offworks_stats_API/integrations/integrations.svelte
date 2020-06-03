<script>

    import {
        pop
    } from "svelte-spa-router";
    import Button from "sveltestrap/src/Button.svelte";
</script>
<main style="text-align:center;">
<h3>Integraciones </h3>
<h4>Apis Externas: </h4>
    <p><Button type="button" color="success" onclick="window.location.href='#/offworks-stats-integrations/integrations/apiExterna1Integration'">Api 1 Externa(covid19)</Button></p>
		
    <p><Button type="button" color="success" onclick="window.location.href='#/offworks-stats-integrations/integrations/apiExterna2Integration'"> API 2 Externa(Ine)</Button></p>

    <p><Button type="button" color="success" onclick="window.location.href='#/offworks-stats-integrations/integrations/apiExterna3Integration'"> API 3 Externa(govItaly)</Button></p>
<h4>Apis de Compañeros: </h4>

    <p><Button type="button" color="success" onclick="window.location.href='#/offworks-stats-integrations/integrations/basketIntegration'">Estadísticas baloncesto</Button></p>
    <p><Button type="button" color="success" onclick="window.location.href='#/offworks-stats-integrations/integrations/drivingLicensesIntegration'">Estadisticas licencias de conducir</Button></p>
    <p><Button type="button" color="success" onclick="window.location.href='#/offworks-stats-integrations/integrations/ppasIntegration'">Estadisticas ppas</Button></p>
    <p><Button type="button" color="success" onclick="window.location.href='#/offworks-stats-integrations/integrations/ruralTourismIntegration'">Estadisticas turismo rural</Button></p>
    <p><Button type="button" color="success" onclick="window.location.href='#/offworks-stats-integrations/integrations/nuclearEnergyIntegration'">Estadísticas energia nuclear</Button></p>
    <p><Button type="button" color="success" onclick="window.location.href='#/offworks-stats-integrations/integrations/indiceMasaIntegration'">Estadisticas masa corporal</Button></p>
    <p><Button type="button" color="success" onclick="window.location.href='#/offworks-stats-integrations/integrations/goalscorersIntegration'">Estadisticas futbolistas</Button></p>
    
    <Button outline color="secondary" on:click="{pop}">Atrás &#x21a9;</Button>
</main> 

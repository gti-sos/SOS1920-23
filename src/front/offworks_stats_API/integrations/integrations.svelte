<script>

    import {
        pop
    } from "svelte-spa-router";
    import Button from "sveltestrap/src/Button.svelte";
</script>

<h3>Integraciones </h3>
<h4>Apis Externas: </h4>
    <p><Button type="button" color="success" onclick="window.location.href='#/offworks-stats'">Api 1 Externa</Button></p>
		
    <p><Button type="button" color="success" onclick="window.location.href='#/offworks-stats'"> API 2 Externa</Button></p>
<h4>Apis de Compañeros: </h4>

    <!--<p><Button type="button" color="success" onclick="window.location.href='#/fires-stats/integrations/#'">Estadísticas Emigración</Button></p>
    <p><Button type="button" color="success" onclick="window.location.href='#/fires-stats-integrations/integrations/plugin-vehicles-stats'">Ventas Coches Eléctricos</Button></p>
    <p><Button type="button" color="success" onclick="window.location.href='#/fires-stats/integrations/#'">Importaciones EEUU</Button></p>
    <p><Button type="button" color="success" onclick="window.location.href='#/fires-stats/integrations/#'">Hospitalized Stats</Button></p>
    <p><Button type="button" color="success" onclick="window.location.href='#/fires-stats/integrations/#'">Exportación de Libros</Button></p>
    <p><Button type="button" color="success" onclick="window.location.href='#/fires-stats/integrations/#'">Consumo de Azúcar</Button></p>
    <p><Button type="button" color="success" onclick="window.location.href='#/fires-stats/integrations/#'">Delitos de Drogas</Button></p>-->

    <Button outline color="secondary" on:click="{pop}">Atrás &#x21a9;</Button>
    

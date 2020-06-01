<script>

    import {
        pop
    } from "svelte-spa-router";
    import Button from "sveltestrap/src/Button.svelte";
</script>

<h3>Integraciones </h3>
<h4>Apis Externas: </h4>
    <p><Button type="button" color="success" onclick="window.location.href='#/fires-stats-integrations/integrations/api-externa-1'">Api 1 Externa</Button></p>	
    <p><Button type="button" color="success" onclick="window.location.href='#/cigarretes-sales'"> API 2 Externa</Button></p>
<h4>Apis de Compañeros: </h4>

    <p><Button type="button" color="success" onclick="window.location.href='#/fires-stats-integrations/integrations/emigrant-stats'">Estadísticas Emigración</Button></p>
    <p><Button type="button" color="success" onclick="window.location.href='#/fires-stats-integrations/integrations/plugin-vehicles-stats'">Ventas Coches Eléctricos</Button></p>
    <p><Button type="button" color="success" onclick="window.location.href='#/fires-stats-integrations/integrations/imports'">Importaciones EEUU</Button></p>
    <p><Button type="button" color="success" onclick="window.location.href='#/fires-stats-integrations/integrations/not-hosp-stats'">Víctimas no hospitalizadas en accidentes</Button></p>
    <p><Button type="button" color="success" onclick="window.location.href='#/fires-stats-integrations/integrations/book-exports'">Exportación de Libros</Button></p>
    <p><Button type="button" color="success" onclick="window.location.href='#/fires-stats-integrations/integrations/sugar-consume'">Consumo de Azúcar</Button></p>
    <p><Button type="button" color="success" onclick="window.location.href='#/fires-stats-integrations/integrations/drug-offences'">Delitos de Drogas</Button></p>

        <Button outline color="secondary" on:click="{pop}">Atrás &#x21a9;</Button>
    

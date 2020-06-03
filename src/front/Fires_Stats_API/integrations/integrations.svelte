<script>

    import {
        pop
    } from "svelte-spa-router";
    import Button from "sveltestrap/src/Button.svelte";
</script>
<main style="text-align:center;">
<h3>Integraciones </h3>
<h4>Apis Externas: </h4>
    <p><Button type="button" color="success" onclick="window.location.href='#/fires-stats-integrations/integrations/api-externa-1'">Api 1 Externa</Button></p>	
    <p><Button type="button" color="success" onclick="window.location.href='#/fires-stats-integrations/integrations/api-externa-2'"> API 2 Externa</Button></p>
<h4>Apis de Compañeros: </h4>

    <p><Button type="button" color="success" onclick="window.location.href='#/fires-stats-integrations/integrations/emigrant-stats'">Estadísticas Emigración (Grupo 1)</Button></p>
    <p><Button type="button" color="success" onclick="window.location.href='#/fires-stats-integrations/integrations/plugin-vehicles-stats'">Ventas Coches Eléctricos (Grupo 9)</Button></p>
    <p><Button type="button" color="success" onclick="window.location.href='#/fires-stats-integrations/integrations/imports'">Importaciones EEUU (Grupo 7)</Button></p>
    <p><Button type="button" color="success" onclick="window.location.href='#/fires-stats-integrations/integrations/not-hosp-stats'">Víctimas no hospitalizadas en accidentes (Grupo 6)</Button></p>
    <p><Button type="button" color="success" onclick="window.location.href='#/fires-stats-integrations/integrations/book-exports'">Exportación de Libros (Grupo 5)</Button></p>
    <p><Button type="button" color="success" onclick="window.location.href='#/fires-stats-integrations/integrations/sugar-consume'">Consumo de Azúcar (Grupo 30)</Button></p>
    <p><Button type="button" color="success" onclick="window.location.href='#/fires-stats-integrations/integrations/drug-offences'">Delitos de Drogas (Grupo 12)</Button></p>

        <Button outline color="secondary" on:click="{pop}">Atrás &#x21a9;</Button>
</main>  

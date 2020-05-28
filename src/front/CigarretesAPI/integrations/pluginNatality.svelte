<script>

    import  { onMount } from "svelte";
    import { pop } from "svelte-spa-router";
    import Table from "sveltestrap/src/Table.svelte";
    import Button from "sveltestrap/src/Button.svelte";
    
    
        const url = "https://sos1920-01.herokuapp.com/api/v2/natality-stats";
    
        onMount(getPluginNatality);
        let plugins = [];
        
        
    
        async function getPluginNatality(){
    
            console.log("Fetching plugin natality..");
            const res = await fetch(url);
            if(res.ok){
                console.log("ok");
                const json = await res.json();
                plugins = json;
                console.log("Received "+ plugins.length + " plugin natality");
            }
    
            else{
                console.log("Error");
            }
        }
        
        async function loadGraph(){
    
    
       
    
        const res1 = await fetch("api/v2/cigarretes-sales");
        let datos2 = await res1.json();
        const res = await fetch(url);
        let datos = await res.json();
        let ejeX = ["Nacimientos totales","Nacimientos de hombres","Venta de paquetes de tabaco","Primera variacion"];
        let valores = [];
        let valor = {};
        datos.forEach((d) => {
            
            valor={
                name: d.country,
                data: [d.natality_totals,d.natality_men,0,0]
            }
            valores.push(valor);
        
        });
        datos2.forEach((d2) => {
            if(d2.year==2007){
            valor={
                name: d2.community,
                data:[0,0,d2.cigarrete_sale,d2.first_variation]
            }
            valores.push(valor);
        }
        });
    
        
        
        console.log("Graph_NONO");
        Highcharts.chart('container', {
    chart: {
        type: 'column'
    },
    title: {
        text: 'Integración grupo 1'
    },
    
    xAxis: {
        categories:ejeX,
        crosshair: true
    },
    
    tooltip: {
        headerFormat: '<span style="font-size:10px">{point.key}</span><table>',
        pointFormat: '<tr><td style="color:{series.color};padding:0">{series.name}: </td>' +
            '<td style="padding:0"><b>{point.y:.1f} </b></td></tr>',
        footerFormat: '</table>',
        shared: true,
        useHTML: true
    },
    plotOptions: {
        column: {
            pointPadding: 0.2,
            borderWidth: 0
        }
    },
    series:valores
});
        }
    </script>
    
    <svelte:head>
        <script src="https://code.highcharts.com/highcharts.js" on:load={loadGraph} defer></script>
        <script src="https://code.highcharts.com/modules/series-label.js" on:load={loadGraph} defer></script>
        <script src="https://code.highcharts.com/modules/exporting.js" on:load={loadGraph} defer></script>
        <script src="https://code.highcharts.com/modules/export-data.js" on:load={loadGraph} defer></script>
        <script src="https://code.highcharts.com/modules/accessibility.js" on:load="{loadGraph}" defer></script>
    </svelte:head>
    
    <main>
    
        {#await getPluginNatality}
            Loading plugin-natality ...
        {:then getPluginNatality}
            <figure class="highcharts-figure">
                <div id="container"></div>
                    <p class="highcharts-description">
                            Esta API muestra información sobre la natalidad en diversos paises europeos.
                    </p>	
            </figure>
           
            
            <Table bordered>
                <thead>
                    <tr>
                        <th>Pais</th>
                        <th>Año</th>
                        <th>Nacimientos totales</th>
                        <th>Nacimientos de hombres</th>
                        
    
                    </tr>
                </thead>
                <tbody>
                    {#each plugins as plugin}
                    <tr>
                        <td>{plugin.country}</td>
                        <td>{plugin.year}</td>
                        <td>{plugin['natality_totals']}</td>
                        <td>{plugin['natality_men']}</td>
                        
    
    
                    </tr>
                    {/each}
                </tbody>
            </Table>
        {/await}
        
    </main>
    
     <Button outline color="secondary" on:click="{pop}">Atrás &#x21a9;</Button>
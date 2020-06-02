<script>

    import  { onMount } from "svelte";
    import { pop } from "svelte-spa-router";
    import Table from "sveltestrap/src/Table.svelte";
    import Button from "sveltestrap/src/Button.svelte";
    
    
        const url = "https://sos1920-09.herokuapp.com/api/v2/renewable-sources-stats";
    
        onMount(getPluginRenewable);
        let plugins = [];
       
        
    
        async function getPluginRenewable(){
    
            console.log("Fetching plugin renewable..");
            const res = await fetch(url);
            if(res.ok){
                console.log("ok");
                const json = await res.json();
                plugins = json;
                console.log("Received "+ plugins.length + " plugin renewable");
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
        let ejeX = ["Porcentaje total","Porcentaje energía hidroeléctrica","Porcentaje energía eólica","Venta de paquetes de tabaco","Primera variacion","Segunda variacion"];
        let valores = [];
        let valor = {};
        datos.forEach((d) => {
            if(d.year==2018){
            valor={
                name: d.country,
                data: [d['percentage-hydropower-total'],d['percentage-hydropower-total'],d['percentage-wind-power-total'],0,0,0]
            }
            valores.push(valor);
            }
        });
        datos2.forEach((d2) => {
            if(d2.year==2007){
            valor={
                name: d2.community,
                data:[0,0,0,d2.cigarrete_sale,d2.first_variation,d2.second_variation]
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
        text: 'Integración grupo 9'
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
    
        {#await getPluginRenewable}
            Loading plugin-natality ...
        {:then getPluginRenewable}
            <figure class="highcharts-figure">
                <div id="container"></div>
                    <p class="highcharts-description">
                            Esta gráfica muestra información sobre los paquetes de tabaco(en millones) vendidos en 2007
                            y las diversas fuentes de energía renovable en 2018.
                    </p>	
            </figure>
           
            
            <Table bordered>
                <thead>
                    <tr>
                        <th>Pais</th>
                        <th>Año</th>
                        <th>Porcentaje total</th>
                        <th>Porcentaje energía hidroeléctrica</th>
                        <th>Porcentaje energía eólica</th>
                        
    
                    </tr>
                </thead>
                <tbody>
                    {#each plugins as plugin}
                    <tr>
                        <td>{plugin.country}</td>
                        <td>{plugin.year}</td>
                        <td>{plugin['percentage-re-total']}</td>
                        <td>{plugin['percentage-hydropower-total']}</td>
                        <td>{plugin['percentage-wind-power-total']}</td>

                        
    
    
                    </tr>
                    {/each}
                </tbody>
            </Table>
        {/await}
        
    </main>
    
     <Button outline color="secondary" on:click="{pop}">Atrás &#x21a9;</Button>
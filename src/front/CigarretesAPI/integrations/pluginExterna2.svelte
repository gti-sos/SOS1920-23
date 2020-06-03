<script>

    import  { onMount } from "svelte";
    import { pop } from "svelte-spa-router";
    import Table from "sveltestrap/src/Table.svelte";
    import Button from "sveltestrap/src/Button.svelte";
    
    
       
    
      
        
    async function loadGraph(){
    
    
        const res = await fetch("https://tsa-wait-times.p.rapidapi.com/airports/test", {
        "method": "GET",
        "headers": {
            "x-rapidapi-host": "tsa-wait-times.p.rapidapi.com",
            "x-rapidapi-key": "7188dc6c2emsh0da1d23e3692442p1d947fjsn2a60ff45419c",
            "useQueryString": true
           
    } 
    
  
        
    });
      console.log(res)  ;
            
            const res1 = await fetch("api/v2/cigarretes-sales");
            let datos2 = await res1.json();
            let datos = await res.json();
            let ejeX = ["Latitud","Longitud","Venta de paquetes","Primera variación","Segunda variación"];
            let valores = [];
            let valor = {};
            datos.forEach((d) => {
                
                valor={
                    name: d.name,
                    data: [parseFloat(d.latitude),parseFloat(d.longitude),0,0,0]
                }
                valores.push(valor);
              
            });
            datos2.forEach((d2) => {
            if(d2.year==2007){
            valor={
                name: d2.community,
                data:[0,0,d2.cigarrete_sale,d2.first_variation,d2.second_variation]
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
            text: 'Integración api externa'
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
            <figure class="highcharts-figure">
                <div id="container"></div>
                   	
            </figure>
        
        </main>
        
        <Button outline color="secondary" on:click="{pop}">Atrás &#x21a9;</Button>
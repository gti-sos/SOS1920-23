<script>
    import Button from "sveltestrap/src/Button.svelte";
    import {pop} from "svelte-spa-router";
    async function loadGraph() {
        let MyData=[];
        let comunidades = [];
        let accidentes=[];
        let enfermos = [];
        let numZonas=[];

    const resData = await fetch("api/v2/offworks-stats");
    MyData = await resData.json();

    MyData.forEach((data) => {
            let comunidad = data.community;
            let year = data.year;
            let accidente = data["accident"];
            let enfermo = data["sick"];
            let num = data["numberzone"];
            
            if (data.year == 2007) {
                comunidades.push(comunidad);
                accidentes.push(accidente);
                enfermos.push(enfermo);
                numZonas.push(num);
            }
    });
    
    Highcharts.chart('container', {
    chart: {
           type: 'line'
    },    
    title: {
    text: 'Comunidades-Accidentes'
    },

    subtitle: {
    text: 'Comunidades',
    align: 'right',
    verticalAlign: 'bottom'
    },

    yAxis: {
    title: {
        text: 'Numero de accidentes y zonas'
        
    },
    
    },

    xAxis: {
        categories: comunidades
    },

    legend: {
    layout: 'vertical',
    align: 'right',
    verticalAlign: 'middle'
    },

    plotOptions: {
    series: {
        label: {
        connectorAllowed: false
        },
        enableMouseTracking: false
    }
    },

    series: [{
        name: 'numero de zonas',
        data: numZonas
      },{
          name:"baja por accidente",
          data:accidentes
      },{
          name:"baja por enfermedad",
          data:enfermos
      }],
    responsive: {
    rules: [{
        condition: {
        maxWidth: 500
        },
        chartOptions: {
        legend: {
            layout: 'horizontal',
            align: 'center',
            verticalAlign: 'bottom'
        }
        }
    }]
    }

    });
    
};
</script>


<svelte:head>
    <script src="https://code.highcharts.com/highcharts.js"></script>
    <script src="https://code.highcharts.com/modules/series-label.js"></script>
    <script src="https://code.highcharts.com/modules/exporting.js"></script>
    <script src="https://code.highcharts.com/modules/export-data.js"></script>
    <script src="https://code.highcharts.com/modules/accessibility.js" on:load="{loadGraph}"></script>
</svelte:head>

<main>
    <figure class="highcharts-figure">
        <div id="container"></div>
        <p class="highcharts-description">
          Relación de las Comunidades en el año 2007 entre accidentes laborales,
          enfermedades laborales y numero de zonas de esa Comunidad Autonoma.
        </p>
      </figure>


    <Button outline color = "secondary" on:click="{pop}">Volver</Button>

</main>
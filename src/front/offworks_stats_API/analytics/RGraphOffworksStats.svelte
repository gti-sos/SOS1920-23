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
        new RGraph.SVG.Line({
            id: 'chart-container',
            data: enfermos,
            options: {
                backgroundGridVlinesCount: 11,
                marginInner: 0,
                textColor: 'white',
                textFont: 'Verdana',
                filled: true,
                filledColors: ['rgba(25,51,74,0.75)'],
                colors: ['#5AF'],
                marginRight: 50,
                marginBottom: 50,
                marginTop: 20,
                xaxis: false,
                yaxis: false,
                yaxisScaleUnitsPost: '',
                yaxisScaleUnitsPre: '',
                tickmarksFill: 'black',
                tickmarksLinewidth: 2,
                linewidth: 4,
                spline: true
            }
        
        }).trace().responsive([
        {maxWidth: 800, width:400,height:200,options: {xaxisLabels: comunidades,marginLeft: 80,textSize: 5,tickmarksStyle: '',tickmarksSize: 3,linewidth: 2}, css:{'float':'none'}},
        {maxWidth: null,width:750,height:300,options: {xaxisLabels: comunidades,marginLeft: 65,textSize: 7,tickmarksStyle: 'circle',tickmarksSize: 5,linewidth: 3}, css:{'float':'left'}}
        ]);
    
    }
</script>

<svelte:head>

    <script src="lib/RGraph.svg.common.core.js" on:load={loadGraph}></script>
    <script src="lib/RGraph.svg.line.js" on:load={loadGraph}></script>

</svelte:head>

<main>
    <p style="z-index: 0;">Relación de las Comunidades en el año 2007 por enfermedades laborales y Comunidad Autonoma.</p>
    <div style="z-index: 1;;width: 950px; height: 400px; background-color: black; box-shadow: 3px 3px 3px #ccc" id="chart-container"></div>
    
    <Button style="margin-top:17%;margin-left: -39%;" outline color="secondary" on:click="{pop}">Atrás</Button>
        
</main>
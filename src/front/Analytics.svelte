<script>
    import {pop} from "svelte-spa-router";
    import Button from "sveltestrap/src/Button.svelte";
    import Table from "sveltestrap/src/Table.svelte";
	import {
    Dropdown,
    DropdownItem,
    DropdownMenu,
    DropdownToggle
  } from 'sveltestrap';

  let isOpen = false;
  async function loadGraph() {
        let MyData = [];
        let comunidades = [];
        let accidentes = [];
        let enfermos = [];
        let numZonas = [];
        let cont=0;
        const resData = await fetch("api/v2/offworks-stats");
        MyData = await resData.json();

        MyData.forEach((data) => {
            let comunidad = data.community;
            let year = data.year;
            let accidente = data["accident"];
            let enfermo = data["sick"];
            let num = data["numberzone"];

            if (data.year == 2007) {// && cont<5
                comunidades.push(comunidad);
                accidentes.push(accidente);
                enfermos.push(enfermo);
                numZonas.push(num);
                cont++;
            }
        });

        let MyData1 = [];
        //let comunidades = [];
        let total_fires = [];
        let forest_areas = [];
        let non_forest_areas = [];
        cont=0;
        const resData1 = await fetch("api/v2/fires-stats");
        MyData1 = await resData1.json();

        MyData1.forEach((data) => {
            //let comunidad = data.community;
            let year = data.year;
            let total_fire = data["total_fire"];
            let forest_area = data["forest_area"];
            let non_forest_area = data["non_forest_area"];

            if (data.year == 2007&& data.community!="islas-baleares"&& cont<=7) {// && cont<5
                //comunidades.push(comunidad);
                total_fires.push(total_fire);
                forest_areas.push(forest_area);
                non_forest_areas.push(non_forest_area);
                cont++;
            }
        });

        let MyData2 = [];
        //let comunidades = [];
        let cigarrete_sales = [];
        let first_variations = [];
        let second_variations = [];
        cont=0;
        const resData2 = await fetch("api/v2/cigarretes-sales");
        MyData2 = await resData2.json();

        MyData2.forEach((data) => {
            //let comunidad = data.community;
            let year = data.year;
            let cigarrete_sale = data["cigarrete_sale"];
            let first_variation = data["first_variation"];
            let second_variation = data["second_variation"];

            if (data.year == 2007&& data.community!="Islas Baleares"&& cont<=7) {// && cont<5
                //comunidades.push(comunidad);
                cigarrete_sales.push(cigarrete_sale);
                first_variations.push(first_variation);
                second_variations.push(second_variation);
                cont++;
            }
        });
        

        Highcharts.chart('container', {
            chart: {
                type: 'line'
            },
            title: {
                text: 'Comunidades Autonomas'
            },

            subtitle: {
                text: 'Integracion offworksApi y ruralTourismApi',
                align: 'right',
                verticalAlign: 'bottom'
            },

            yAxis: {
                title: {
                    text: 'Numero en decenas'

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
                name: 'accidentes',
                data: accidentes
            }, {
                name: "enfermos",
                data: enfermos
            }, {
                name: "numZonas",
                data: numZonas
            }, {
                name: "total_fires",
                data: total_fires
            }, {
                name: "forest_areas",
                data: forest_areas
            }, {
                name: "non_forest_areas",
                data: non_forest_areas
            }, {
                name: "cigarrete_sales",
                data: cigarrete_sales
            }, {
                name: "first_variations",
                data: first_variations
            }, {
                name: "second_variations",
                data: second_variations
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
            Relación de las Comunidades en el año 2007 entre las Apis de bajas laborales
            incendios forestales y consumo de cigarros en Comunidades Autonomas de España.
        </p>
    </figure>
    <Button outline color = "secondary" on:click="{pop}">Volver</Button>

</main>

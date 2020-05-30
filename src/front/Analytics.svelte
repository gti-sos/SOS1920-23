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
        let comunidades1 = [];
        let accidentes = [];
        let enfermos = [];
        let numZonas = [];

        let MyData1 = [];
        let comunidades2 = [];
        let total_fires = [];
        let forest_areas = [];
        let non_forest_areas = [];

        let MyData2 = [];
        let comunidades3 = [];
        let cigarrete_sales = [];
        let first_variations = [];
        let second_variations = [];

        const resData = await fetch("api/v2/offworks-stats");
        MyData = await resData.json();
        const resData1 = await fetch("api/v2/fires-stats");
        MyData1 = await resData1.json();
        const resData2 = await fetch("api/v2/cigarretes-sales");
        MyData2 = await resData2.json();

        MyData.forEach((data1) => {
            MyData1.forEach((data2) => {
                MyData2.forEach((data3) => {
                    let comunidad1 = data1.community;
                    let year1 = data1.year;
                    let accidente = data1["accident"];
                    let enfermo = data1["sick"];
                    let num = data1["numberzone"];

                    let comunidad2 = data2.community;
                    let year2 = data2.year;
                    let total_fire = data2["total_fire"];
                    let forest_area = data2["forest_area"];
                    let non_forest_area = data2["non_forest_area"];

                    let comunidad3 = data3.community;
                    let year3 = data3.year;
                    let cigarrete_sale = data3["cigarrete_sale"];
                    let first_variation = data3["first_variation"];
                    let second_variation = data3["second_variation"];

                    let comunidadRes = "";
                    //console.log(comunidad1.toLowerCase().replace(/-/g, " ")+" "+comunidad2.toLowerCase().replace(/-/g, " ")+" "+comunidad3.toLowerCase().replace(/-/g, " "));
                    if (comunidad1.toLowerCase().replace(/-/g, " ") == comunidad2.toLowerCase().replace(/-/g, " ") && 
                            comunidad1.toLowerCase().replace(/-/g, " ") == comunidad3.toLowerCase().replace(/-/g, " ")&&
                            
                                year1 == 2007 && year2 == 2007 && year3 == 2007) {// .replace("-", " ")  .toLowerCase() .replace(/^-+/, " ") .replace(/-/g, " ")
                                console.log(comunidad1.toLowerCase().replace(/-/g, " ")+" "+comunidad2.toLowerCase().replace(/-/g, " ")+" "+comunidad3.toLowerCase().replace(/-/g, " "));
                        comunidades1.push(comunidad1.replace(/-/g, " "));
                        accidentes.push(accidente);
                        enfermos.push(enfermo);
                        numZonas.push(num);
                        total_fires.push(total_fire);
                        forest_areas.push(forest_area);
                        non_forest_areas.push(non_forest_area);
                        cigarrete_sales.push(cigarrete_sale);
                        first_variations.push(first_variation);
                        second_variations.push(second_variation);
                    }
                });
            });
        });
        

        Highcharts.chart('container', {
            chart: {
                type: 'line'
            },
            title: {
                text: 'Comunidades Autonomas'
            },

            subtitle: {
                text: 'Integracion offworksApi, firesApi y cigarretesApi',
                align: 'right',
                verticalAlign: 'bottom'
            },

            yAxis: {
                title: {
                    text: 'Numero en decenas'

                },

            },

            xAxis: {
                categories: comunidades1
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
            Relación de las Comunidades en el año 2007 entre las Apis de bajas laborales,
            incendios forestales y consumo de cigarros en Comunidades Autonomas de España.
        </p>
    </figure>
    <Button outline color = "secondary" on:click="{pop}">Volver</Button>

</main>

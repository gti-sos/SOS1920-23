<script>
    import Button from "sveltestrap/src/Button.svelte";
    import { pop } from "svelte-spa-router";
    import  { onMount } from "svelte";
    import Table from "sveltestrap/src/Table.svelte";

    onMount(getApi);

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

            if (data.year == 2007) {
                comunidades.push(comunidad);
                accidentes.push(accidente);
                enfermos.push(enfermo);
                numZonas.push(num);
                //cont++;
            }
        });
        let dataExt = [];
        let countries = [];
        let casess = [];
        let actives = [];
        let testss = [];
        //let recovereds = [];
        const resDataExt = await fetch("/v2/countries");
        dataExt = await resDataExt.json();

        dataExt.forEach((data) => {
            let countrie = data.country;
            let cases = data["cases"];
            let active = data["active"];
            let tests = data["tests"];
            //let recovered = data["recovered"];
            
            if (cont<=7) {
                countries.push(countrie);
                casess.push(cases);
                actives.push(active);
                testss.push(tests);
                cont++;
            }
            //countries.push(data.Id);
            //years.push(data["Cod_IOE"]);
            //points.push(data["Nombre"]);
            //threepoints.push(data["Codigo"]);
        });

        Highcharts.chart('container', {
            chart: {
                type: 'line'
            },
            title: {
                text: 'Comunidades-Accidentes-Casos-Activos-Tests'
            },

            subtitle: {
                text: 'Integracion offworksApi y CoronalmaoNinjaApi',
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
                name: 'Casos',
                data: casess
            }, {
                name: "Casos activos",
                data: actives
            }, {
                name: "Test realizados",
                data: testss
            }, {
                name: "baja por accidente",
                data: accidentes
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
    let datosApi=[];
    async function getApi(){
        //console.log("Fetching plugin vehicles..");
        const res = await fetch("/v2/countries");
        if(res.ok){
            console.log("ok");
            const json = await res.json();
            datosApi = json;
            //console.log("Received "+ plugins.length + " plugin vehicles");
        }

        else{
            console.log("Error");
        }
    }
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
            Relación de las Comunidades en el año 2007 entre enfermedades laborales y
            casos,casos activos y tests en Comunidades Autonomas.
        </p>
    </figure>
    <Button outline color = "secondary" on:click="{pop}">Volver</Button>
    {#await getApi}
		Loading basket-stats ...
	{:then getApi}
    <Table bordered>
        <thead>
            <tr>
                <th>Pais</th>
                <th>Casos</th>
                <th>Casos hoy</th>
                <th>tests</th>
                <th>activos</th>
                <th>muertes</th>
                <th>recuperados</th>
            </tr>
        </thead>
        <tbody>
            {#each datosApi as datoApi}
				<tr>
                    <td>{datoApi.country}</td>
                    <td>{datoApi['cases']}</td>
                    <td>{datoApi['todayCases']}</td>
                    <td>{datoApi['tests']}</td>
                    <td>{datoApi['active']}</td>
                    <td>{datoApi['deaths']}</td>
                    <td>{datoApi['recovered']}</td>
				</tr>
				{/each}
			</tbody>
		</Table>
    {/await}
    <Button outline color = "secondary" on:click="{pop}">Volver</Button>

</main>
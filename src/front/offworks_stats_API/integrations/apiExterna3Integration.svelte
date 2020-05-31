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
        const resDataExt = await fetch("https://disease.sh/v2/gov/italy");
        dataExt = await resDataExt.json();

        dataExt.forEach((data) => {
            let countrie = data.region;
            let cases = data["hospitalizedWithSymptoms"];
            let active = data["totalCases"];
            let tests = data["recovered"];
            
            if (cont<=7) {
                countries.push(countrie);
                casess.push(cases);
                actives.push(active);
                testss.push(tests);
                cont++;
            }
        });

        Highcharts.chart('container', {
            chart: {
                polar: true,
                type: 'line'
            },
            accessibility: {
                description: '.'
            },
            title: {
                text: 'Comunidades-Accidentes-Hospitalizados-Casos-Recuperados',
                x: -80
            },
            subtitle: {
                text: 'Integracion offworksApi y DiseaseApi',
                align: 'right',
                verticalAlign: 'bottom'
            },
            pane: {
                size: '80%'
            },
            xAxis: {
                categories: comunidades
            },
            yAxis: {
                text: 'Numero en decenas',
                gridLineInterpolation: 'polygon',
                lineWidth: 0,
                min: 0
            },
            tooltip: {
                shared: true,
                pointFormat: '<span style="color:{series.color}">{series.name}: <b>{point.y}</b><br/>'
            },
            legend: {
                align: 'right',
                verticalAlign: 'middle',
                layout: 'vertical'
            },
            series: [{
                name: 'Hospitalizados',
                data: casess
            }, {
                name: "Total Casos",
                data: actives
            }, {
                name: "Recuperados",
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
                            align: 'center',
                            verticalAlign: 'bottom',
                            layout: 'horizontal'
                        },
                        pane: {
                            size: '70%'
                        }
                    }
                }]
            }
        });


    };
    let datosApi=[];
    async function getApi(){
        //console.log("Fetching plugin vehicles..");
        const res = await fetch("https://disease.sh/v2/gov/italy");
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
            hospitalizados,casos activos y recuperdos en Comunidades Autonomas.
        </p>
    </figure>
    <Button outline color = "secondary" on:click="{pop}">Volver</Button>
    {#await getApi}
		Loading basket-stats ...
	{:then getApi}
    <Table bordered>
        <thead>
            <tr>
                <th>Region</th>
                <th>Hospitalizados con sintomas</th>
                <th>Casos totales</th>
                <th>Recuperados</th>
            </tr>
        </thead>
        <tbody>
            {#each datosApi as datoApi}
				<tr>
                    <td>{datoApi.region}</td>  <!-- datoApi.fields  -->
                    <td>{datoApi['hospitalizedWithSymptoms']}</td>
                    <td>{datoApi['totalCases']}</td>
                    <td>{datoApi['recovered']}</td>
                    <!--<td>{datoApi['Precio_gas_natural_comprimido']}</td>
                    <td>{datoApi['Precio_gasolina_95']}</td-->
				</tr>
				{/each}
			</tbody>
		</Table>
    {/await}
    <Button outline color = "secondary" on:click="{pop}">Volver</Button>

</main>
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

            if (data.year == 2007&&cont<5) {
                comunidades.push(comunidad);
                accidentes.push(accidente);
                enfermos.push(enfermo);
                numZonas.push(num);
                cont++;
            }
        });
        let dataExt = [];
        let countries = [];
        let years = [];
        let points = [];
        let threepoints = [];
        let rebounds = [];
        const resDataExt = await fetch("https://sos1920-22.herokuapp.com/api/v1/og-basket-stats");
        dataExt = await resDataExt.json();

        dataExt.forEach((data) => {
            /*let comunidad = data.community;
            let year = data.year;
            let accidente = data["accident"];
            let enfermo = data["sick"];
            let num = data["numberzone"];
            
            if (data.year == 2007) {
                comunidades.push(comunidad);
                accidentes.push(accidente);
                enfermos.push(enfermo);
                numZonas.push(num);
            }*/
            countries.push(data.country);
            years.push(data.year);
            points.push(data["points"]);
            threepoints.push(data["threepoints"]);
            rebounds.push(data["rebounds"]);
        });

        Highcharts.chart('container', {
            chart: {
                type: 'line'
            },
            title: {
                text: 'Comunidades-Enfermedades-Puntos-Triples-Rebotes'
            },

            subtitle: {
                text: 'Integracion offworksApi y BasketApi',
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
                name: 'puntos',
                data: points
            }, {
                name: "triples",
                data: threepoints
            }, {
                name: "rebotes",
                data: rebounds
            }, {
                name: "baja por enfermedad",
                data: enfermos
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
        const res = await fetch("https://sos1920-22.herokuapp.com/api/v1/og-basket-stats");
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
            puntos,triples y rebotes en Comunidades Autonomas.
        </p>
    </figure>
    {#await getApi}
		Loading basket-stats ...
	{:then getApi}
    <Table bordered>
        <thead>
            <tr>
                <th>Pais</th>
                <th>Año</th>
                <th>Puntos</th>
                <th>triples</th>
                <th>rebotes</th>
            </tr>
        </thead>
        <tbody>
            {#each datosApi as datoApi}
				<tr>
                    <td>{datoApi.country}</td>
                    <td>{datoApi.year}</td>
                    <td>{datoApi['points']}</td>
                    <td>{datoApi['threepoints']}</td>
                    <td>{datoApi['rebounds']}</td>
				</tr>
				{/each}
			</tbody>
		</Table>
    {/await}
    <Button outline color = "secondary" on:click="{pop}">Volver</Button>

</main>
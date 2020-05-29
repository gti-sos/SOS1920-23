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

            if (data.year == 2007 && cont<5) {
                comunidades.push(comunidad);
                accidentes.push(accidente);
                enfermos.push(enfermo);
                numZonas.push(num);
                cont++;
            }
        });
        let dataExt = [];
        let countrys = [];
        let years = [];
        let aas_grosss = [];
        let aas_nets = [];
        let ppa_per_capitas = [];
        const resDataExt = await fetch("/api/v1/ppas");
        dataExt = await resDataExt.json();

        dataExt.forEach((data) => {
            let country = data.aut_com;
            let yearss = data.year;
            let aas_gross = data["aas_gross"];
            let aas_net = data["aas_net"];
            let ppa_per_capita = data["ppa_per_capita"];
            
            if (data.year == 2017) {
                countrys.push(country);
                aas_grosss.push(aas_gross);
                aas_nets.push(aas_net);
                ppa_per_capitas.push(ppa_per_capita);
            }
            
        });

        Highcharts.chart('container', {
            chart: {
                type: 'line'
            },
            title: {
                text: 'Comunidades-Accidentes-aas_gross-aas_net-ppa_per_capitas'
            },

            subtitle: {
                text: 'Integracion offworksApi y ppasApi',
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
                name: 'aas_gross',
                data: aas_grosss
            }, {
                name: "aas_nets",
                data: aas_nets
            }, {
                name: "ppa_per_capitas",
                data: ppa_per_capitas
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
        const res = await fetch("/api/v1/ppas");
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
            Relación de las Comunidades en el año 2007 entre accidentes laborales y
            aas_gross,aas_nets y ppa_per_capitas en Comunidades Autonomas.
        </p>
    </figure>
    <Button outline color = "secondary" on:click="{pop}">Volver</Button>
    {#await getApi}
		Loading ppas ...
	{:then getApi}
    <Table bordered>
        <thead>
            <tr>
                <th>Pais</th>
                <th>Año</th>
                <th>aas_gross</th>
                <th>aas_net</th>
                <th>ppa_per_capita</th>
            </tr>
        </thead>
        <tbody>
            {#each datosApi as datoApi}
				<tr>
                    <td>{datoApi.country}</td>
                    <td>{datoApi.year}</td>
                    <td>{datoApi['aas_gross']}</td>
                    <td>{datoApi['aas_net']}</td>
                    <td>{datoApi['ppa_per_capita']}</td>
				</tr>
				{/each}
			</tbody>
		</Table>
    {/await}
    <Button outline color = "secondary" on:click="{pop}">Volver</Button>

</main>
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

            if (data.year == 2007) {// && cont<5
                comunidades.push(comunidad);
                accidentes.push(accidente);
                enfermos.push(enfermo);
                numZonas.push(num);
                cont++;
            }
        });
        let dataExt = [];
        let countrys = [];
        let names = [];
        let debut = [];
        let goals = [];
        let matches = [];
        let teams = [];
        const resDataExt = await fetch("/api/v3/goalscorers");
        dataExt = await resDataExt.json();

        dataExt.forEach((data) => {
            let country = data.place;
            let debut = data.debut;
            let name = data["name"];
            let goal = data["goals"];
            let matche = data["matches"];
            let team = data["teams"];
            
            //if (data.year == 2019) {
                countrys.push(country);
                names.push(name);
                goals.push(goal);
                matches.push(matche);
                teams.push(team);
            //}
            
        });

        Highcharts.chart('container', {
            chart: {
                type: 'line'
            },
            title: {
                text: 'Comunidades-Enfermos-Goles-Partidos-Equipos'
            },

            subtitle: {
                text: 'Integracion offworksApi y goalscoreApi',
                align: 'right',
                verticalAlign: 'bottom'
            },

            yAxis: {
                title: {
                    text: 'Numero de en decenas'

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
                name: 'Goles',
                data: goals
            }, {
                name: "Partidos",
                data: matches
            }, {
                name: "Equipos",
                data: teams
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
        const res = await fetch("/api/v3/goalscorers");
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
            goles,partidos y equipos en Comunidades Autonomas.
        </p>
    </figure>
    <Button outline color = "secondary" on:click="{pop}">Volver</Button>
    {#await getApi}
		Loading ppas ...
	{:then getApi}
    <Table bordered>
        <thead>
            <tr>
                <th>Nombre</th>
                <th>Pais</th>
                <th>Debut</th>
                <th>Goles</th>
                <th>Partidos</th>
                <th>Equipos</th>
            </tr>
        </thead>
        <tbody>
            {#each datosApi as datoApi}
				<tr>
                    <td>{datoApi.name}</td>
                    <td>{datoApi.country}</td>
                    <td>{datoApi.debut}</td>
                    <td>{datoApi['goals']}</td>
                    <td>{datoApi['matches']}</td>
                    <td>{datoApi['teams']}</td>
				</tr>
				{/each}
			</tbody>
		</Table>
    {/await}
    <Button outline color = "secondary" on:click="{pop}">Volver</Button>

</main>

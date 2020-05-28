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
        let dataExt = [];
        let com = [];
        //let years = [];
        let mot_mens = [];
        let mot_womens = [];
        let total_mots = [];
        let cont=0;
        const resDataExt = await fetch("/api/v2/driving-licenses");
        dataExt = await resDataExt.json();

        dataExt.forEach((data) => {
            let comu = data.aut_com;
            let year = data.year;
            let mot_men = data["mot_men"];
            let mot_women = data["mot_women"];
            let total_mot = data["total_mot"];
            
            if (data.year == 2018 && cont <=7) {  // && dataExt.length<=7
                com.push(comu);
                mot_mens.push(mot_men);
                mot_womens.push(mot_women);
                total_mots.push(total_mot);
                cont++;
            }
            
        });
        //console.log(mot_mens+" "+mot_mens.length);
        Highcharts.chart('container', {
            chart: {
                type: 'line'
            },
            title: {
                text: 'Comunidades-Accidentes-Hombres y Mujeres en moto'
            },

            subtitle: {
                text: 'Integracion offworksApi y DrivingLicenseApi',
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
                name: 'Hombres en moto',
                data: mot_mens
            }, {
                name: "Mujeres en moto",
                data: mot_womens
            }, {
                name: "Total de motos",
                data: total_mots
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
        const res = await fetch("/api/v2/driving-licenses");
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
    <Button outline color = "secondary" on:click="{pop}">Volver</Button>
    {#await getApi}
		Loading driving-licenses ...
	{:then getApi}
    <Table bordered>
        <thead>
            <tr>
                <th>Comunidad</th>
                <th>Año</th>
                <th>Coches hombres</th>
                <th>Coches mujeres</th>
                <th>Motos hombres</th>
                <th>Motos mujeres</th>
                <th>Total de coches</th>
                <th>Total de motos</th>
                <th>Relacion coches</th>
                <th>Relacion motos</th>
            </tr>
        </thead>
        <tbody>
            {#each datosApi as datoApi}
				<tr>
                    <td>{datoApi.aut_com}</td>
                    <td>{datoApi.year}</td>
                    <td>{datoApi['cars_men']}</td>
                    <td>{datoApi['cars_women']}</td>
                    <td>{datoApi['mot_men']}</td>
                    <td>{datoApi['mot_women']}</td>
                    <td>{datoApi['total_cars']}</td>
                    <td>{datoApi['total_mot']}</td>
                    <td>{datoApi['rel_cars']}</td>
                    <td>{datoApi['rel_mot']}</td>
				</tr>
				{/each}
			</tbody>
		</Table>
    {/await}
    <Button outline color = "secondary" on:click="{pop}">Volver</Button>

</main>
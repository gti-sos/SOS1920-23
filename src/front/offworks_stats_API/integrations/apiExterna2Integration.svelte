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
        const resDataExt = await fetch("https://servicios.ine.es/wstempus/js/ES/OPERACIONES_DISPONIBLES");
        dataExt = await resDataExt.json();

        dataExt.forEach((data) => {
            let countrie = data.Nombre;
            let cases = data["Id"];
            let active = data["Cod_IOE"];
            let tests = data["Codigo"];
            //let recovered = data["recovered"];
            
            if (cont<=7) {
                countries.push(countrie);
                casess.push(cases);
                actives.push(parseInt(active));
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
                polar: true,
                type: 'line'
            },
            accessibility: {
                description: '.'
            },
            title: {
                text: 'Comunidades-Enfermedades-Id',
                x: -80
            },
            subtitle: {
                text: 'Integracion offworksApi y serviciosIneApi',
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
                text: 'Numero de enfermedades y zonas',
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
                name: 'Id',
                data: casess
            }
            //, {
            //    name: "Cod_IOE",
            //    data: actives
           // }
            , {
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
        const res = await fetch("https://servicios.ine.es/wstempus/js/ES/OPERACIONES_DISPONIBLES");
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
            las id en Comunidades Autonomas.
        </p>
    </figure>
    <Button outline color = "secondary" on:click="{pop}">Volver</Button>
    {#await getApi}
		Loading basket-stats ...
	{:then getApi}
    <Table bordered>
        <thead>
            <tr>
                <th>Id</th>
                <th>Nombre</th>
                <th>Cod_IOE</th>
                <th>Codigo</th>
            </tr>
        </thead>
        <tbody>
            {#each datosApi as datoApi}
				<tr>
                    <td>{datoApi['Id']}</td>  <!-- datoApi.fields  -->
                    <td>{datoApi.Nombre}</td>
                    <td>{datoApi['Cod_IOE']}</td>
                    <td>{datoApi['Codigo']}</td>
				</tr>
				{/each}
			</tbody>
		</Table>
    {/await}
    <Button outline color = "secondary" on:click="{pop}">Volver</Button>

</main>
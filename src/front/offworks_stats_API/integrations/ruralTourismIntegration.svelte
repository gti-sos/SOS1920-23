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
        let provinces = [];
        let years = [];
        let travellers = [];
        let overnightstays = [];
        let averagestays = [];
        const resDataExt = await fetch("https://sos1920-02.herokuapp.com/api/v2/rural-tourism-stats");
        dataExt = await resDataExt.json();

        dataExt.forEach((data) => {
            let province = data.province;
            let yearss = data.year;
            let traveller = data["traveller"];
            let overnightstay = data["overnightstay"];
            let averagestay = data["averagestay"];
            
            if (data.year == 2016) {
                provinces.push(province);
                travellers.push(traveller);
                overnightstays.push(overnightstay);
                averagestays.push(averagestay);
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
                text: 'Comunidades-Accidentes-Viajeros-Noches-Porcentaje',
                x: -80
            },
            subtitle: {
                text: 'Integracion offworksApi y ruralTourismApi',
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
                name: 'viajeros',
                data: travellers
            }, {
                name: "noches",
                data: overnightstays
            }, {
                name: "porcentaje quedadas",
                data: averagestays
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
        const res = await fetch("https://sos1920-02.herokuapp.com/api/v2/rural-tourism-stats");
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
            viajeros,noches y porcetaje quedadas en Comunidades Autonomas.
        </p>
    </figure>
    <Button outline color = "secondary" on:click="{pop}">Volver</Button>
    {#await getApi}
		Loading ppas ...
	{:then getApi}
    <Table bordered>
        <thead>
            <tr>
                <th>Provincia</th>
                <th>Año</th>
                <th>Viajeros</th>
                <th>Noches</th>
                <th>Porcentaje quedadas</th>
            </tr>
        </thead>
        <tbody>
            {#each datosApi as datoApi}
				<tr>
                    <td>{datoApi.province}</td>
                    <td>{datoApi.year}</td>
                    <td>{datoApi['traveller']}</td>
                    <td>{datoApi['overnightstay']}</td>
                    <td>{datoApi['averagestay']}</td>
				</tr>
				{/each}
			</tbody>
		</Table>
    {/await}
    <Button outline color = "secondary" on:click="{pop}">Volver</Button>

</main>
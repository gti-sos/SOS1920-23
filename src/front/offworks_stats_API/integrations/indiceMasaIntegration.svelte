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

            if (data.year == 2007&& cont<5) {// && cont<5
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
        let indice_de_masa_corporals = [];
        let alturas = [];
        let tasa_obesidads = [];
        const resDataExt = await fetch("https://sos1920-30.herokuapp.com/api/v3/indice_de_masa_corporal");
        dataExt = await resDataExt.json();

        dataExt.forEach((data) => {
            let country = data.place;
            let yearss = data.year;
            let indice_de_masa_corporal = data["indice_de_masa_corporal"];
            let altura = data["altura"];
            let tasa_obesidad = data["tasa_obesidad"];
            
            if (data.year == 2019) {
                countrys.push(country);
                indice_de_masa_corporals.push(indice_de_masa_corporal);
                alturas.push(altura);
                tasa_obesidads.push(tasa_obesidad);
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
                text: 'Comunidades-Enfermos-Indice-Altura-Tasa',
                x: -80
            },
            subtitle: {
                text: 'Integracion offworksApi y indiceMasaApi',
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
                text: 'Numero de en decenas',
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
                name: 'Indice masa corporal',
                data: indice_de_masa_corporals
            }, {
                name: "Alturas",
                data: alturas
            }, {
                name: "Tasa obesidad",
                data: tasa_obesidads
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
        const res = await fetch("https://sos1920-30.herokuapp.com/api/v3/indice_de_masa_corporal");
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
            indice masa,altura y tasa obesidad en Comunidades Autonomas.
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
                <th>Indice masa corporal</th>
                <th>Altura</th>
                <th>Tasa Obesidad</th>
            </tr>
        </thead>
        <tbody>
            {#each datosApi as datoApi}
				<tr>
                    <td>{datoApi.place}</td>
                    <td>{datoApi.year}</td>
                    <td>{datoApi['indice_de_masa_corporal']}</td>
                    <td>{datoApi['altura']}</td>
                    <td>{datoApi['tasa_obesidad']}</td>
				</tr>
				{/each}
			</tbody>
		</Table>
    {/await}
    <Button outline color = "secondary" on:click="{pop}">Volver</Button>

</main>
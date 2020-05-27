<script>
    import {
        pop
    } from "svelte-spa-router";
    import Button from "sveltestrap/src/Button.svelte";
    async function loadGraph() {
        const res = await fetch("api/v2/cigarretes-sales");
        let datos = await res.json();
        let comunidad = datos.filter((datos)=> datos.year===2007).map((datos) => datos.community);
        let venta_de_cigarros = datos.filter((datos) => datos.year===2007).map((datos) => datos.cigarrete_sale);
        let primera_variacion = datos.filter((datos) => datos.year===2007).map((datos) => datos.first_variation);
        let segunda_variacion = datos.filter((datos) => datos.year===2007).map((datos) => datos.second_variation);
        function makeTrace(i) {
            if (i == 0) {
                return {
                    x: comunidad,
                    y: Array.apply(null, venta_de_cigarros),
                    line: { 
                        shape: 'spline' ,
                        color: 'red'
                    },
                    visible: i === 0,
                    name: 'Ventas de paquetes de tabaco',
                };
            } else if (i == 1) {
                return {
                    x: comunidad,
                    y: Array.apply(null, primera_variacion),
                    line: { 
                        shape: 'spline' ,
                        color: 'red'
                    },
                    visible: i === 0,
                    name: 'Primera variacion',
                };
            } else if (i == 2) {
                return {
                    x: comunidad,
                    y: Array.apply(null, segunda_variacion),
                    line: { 
                        shape: 'spline' ,
                        color: 'red'
                    },
                    visible: i === 0,
                    name: 'Segunda variacion',
                };
            }
            
        }
        Plotly.plot('graph', [0, 1, 2].map(makeTrace), {
            updatemenus: [{
                y: 0.8,
                yanchor: 'top',
                
            }, {
                y: 1,
                yanchor: 'top',
                buttons: [{
                    method: 'restyle',
                    args: ['visible', [true, false, false, false]],
                    label: 'Venta de paquetes'
                }, {
                    method: 'restyle',
                    args: ['visible', [false, true, false, false]],
                    label: 'Primera variacion'
                }, {
                    method: 'restyle',
                    args: ['visible', [false, false, true, false]],
                    label: 'Segunda variacion'
                }]
            }],
        });
    }
</script>

<svelte:head>
    <script src="https://cdn.plot.ly/plotly-latest.min.js" on:load="{loadGraph}"></script>
</svelte:head>

<main>
    <h2 style="text-align: center;"> <i class="fas fa-car"></i> Ventas de paquetes de tabaco en 2007(en millones)</h2>

    <Button outline color="secondary" on:click="{pop}">Volver</Button><br>

    <div id="graph"></div>
    <p>El gráfico de barras muestra un estudio de millones de paquetes de tabaco comprados en el año 2007 , comparando este año con 2003 (primera variacion) 
        y con 2012 (segunda variacion).</p>
</main>

<style>
</style>
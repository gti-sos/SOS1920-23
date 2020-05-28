<script>
	import Button from  "sveltestrap/src/Button.svelte";
	import Table from "sveltestrap/src/Table.svelte";
	import {
    Dropdown,
    DropdownItem,
    DropdownMenu,
    DropdownToggle
  } from 'sveltestrap';

  let isOpen = false;
</script>

<h4>Tablas de Estadísticas:</h4>

<p><Button type="button" color="info" onclick="window.location.href='#/fires-stats'"> API de estadísticas de incendios en España</Button></p>
		
<p><Button type="button" color="info" onclick="window.location.href='#/cigarretes-sales'"> API de estadísticas de venta de tabaco en España</Button></p>

<p><Button type="button" color="info" onclick="window.location.href='#/offworks-stats'"> API de bajas laborales en España </Button></p>

<h4>Gráficos Estadísticos:</h4>
<td>
					<Dropdown {isOpen} toggle={() => (isOpen = !isOpen)}>
						<DropdownToggle color="primary" outline caret>Incendios Forestales en España</DropdownToggle>
						<DropdownMenu>
							<DropdownItem href="#/graph-highchart">HighChart</DropdownItem>
							<DropdownItem href="#/graph-chartjs">Chart.js</DropdownItem>
							
							
						</DropdownMenu>
						</Dropdown>
</td>

<th>
					<Dropdown {isOpen} toggle={() => (isOpen = !isOpen)}>
						<DropdownToggle outline caret>Gráficas de venta de paquetes de tabaco en España</DropdownToggle>
						<DropdownMenu>
							<DropdownItem href="#/graph-cigarretes-sales">HighChart</DropdownItem>
							<DropdownItem href="#/chart-cigarretes-sales">Chart.js</DropdownItem>


						</DropdownMenu>
						</Dropdown>
</th>
<p><Button type="button" color="white" style="color:rgb(40, 83, 53);border-color:brown;margin-top: 5%;" onclick="window.location.href='#/graph-offworks-stats'"> Grafica HighChart de bajas laborales en España </Button></p>
<p><Button type="button" color="white" style="color:rgb(40, 83, 53);border-color:brown;" onclick="window.location.href='#/Rgraph-offworks-stats'"> Grafica Rgraph de bajas laborales en España </Button></p>


	

<h4>Integraciones:</h4>

<p><Button type="button" color="info" onclick="window.location.href='#/fires-stats-integrations/integrations'"> Integraciones Fires Stats </Button></p>
<p><Button type="button" color="info" onclick="window.location.href='#/offworks-stats-integrations/integrations'"> Integraciones Offworks Stats </Button></p>
<p><Button type="button" color="info" onclick="window.location.href='#/cigarretes-sales-integrations/integrations'"> Integraciones cigarretes-sales </Button></p>


<h4>Gráfica Grupal:</h4>

<p><Button type="button" color="warning" onclick="window.location.href='#/analytics'"> Estadística Grupal </Button></p>

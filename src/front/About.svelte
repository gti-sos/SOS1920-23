<script>
    import {pop} from "svelte-spa-router";
    import Button from "sveltestrap/src/Button.svelte";
    import Table from "sveltestrap/src/Table.svelte";
	import {
    Dropdown,
    DropdownItem,
    DropdownMenu,
    DropdownToggle
  } from 'sveltestrap';
  let isOpen = false;
</script>
<body style="text-align:center;">
<h4>Videos explicativos:</h4>
<Button color="info" on:click="{pop}">INCENDIOS FORESTALES</Button>
<Button color="info" on:click="{pop}">VENTAS DE TABACO</Button>
<Button color="info" on:click="{pop}">BAJAS LABORALES</Button>
  	

<p><Button outline color="secondary" on:click="{pop}">Volver</Button></p>
</body>
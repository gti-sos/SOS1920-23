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


    <h4>Integraciones:</h4>

    <p><Button type="button" color="info" onclick="window.location.href='#/fires-stats-integrations/integrations'"> Integraciones Fires Stats </Button></p>
    <p><Button type="button" color="info" onclick="window.location.href='#/offworks-stats-integrations/integrations'"> Integraciones Offworks Stats </Button></p>
    <p><Button type="button" color="info" onclick="window.location.href='#/cigarretes-sales-integrations/integrations'"> Integraciones cigarretes-sales </Button></p>
    <Button outline color="secondary" on:click="{pop}">Volver</Button>
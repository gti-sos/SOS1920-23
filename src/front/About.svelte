
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

<h4>Videos explicativos:</h4>

<Button outline color="secondary" on:click="{pop}">Volver</Button>
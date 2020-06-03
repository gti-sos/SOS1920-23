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
<div class="card">
  <div class="embed-responsive embed-responsive-16by9 video">
      <iframe title="cig" width="560" height="315" src="https://www.youtube.com/embed/HhXnWtQvIHg" frameborder="0" allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>
  </div>
<div class="card-body">
  <h5 class="card-title">Ventas de paquete de tabaco</h5>
  <p class="card-text">Vídeo explicativo sobre la API venta de paquetes de tabaco en España.</p>
</div>
</div>
<h5>Videos explicativo offworkApi:</h5>
<iframe title="off" width="560" height="315" src="https://www.youtube.com/embed/qKW2lMeceCs" frameborder="0" allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>
  	

<p><Button outline color="secondary" on:click="{pop}">Volver</Button></p>
</body>

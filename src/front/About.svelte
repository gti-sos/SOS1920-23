<script>
    import {pop} from "svelte-spa-router";
    import Button from "sveltestrap/src/Button.svelte";
	
</script>
<body style="text-align:center;">

  <h4>Videos explicativos:</h4>

<h5>Video explicativo cigarretteApi:</h5>
<iframe width="560" height="315" src="https://www.youtube.com/embed/Ofrb63BmNgo" frameborder="0" allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>
<h5>Video explicativo offworkApi:</h5>
<iframe title="off" width="560" height="315" src="https://www.youtube.com/embed/qKW2lMeceCs" frameborder="0" allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>
<h5>Video explicativo fires-stats-API:</h5>
<iframe width="560" height="315" src="https://www.youtube.com/embed/ETMqhWTBeF4" frameborder="0" allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>
  	

<p><Button outline color="secondary" on:click="{pop}">Volver &#x21a9;</Button></p>
</body>

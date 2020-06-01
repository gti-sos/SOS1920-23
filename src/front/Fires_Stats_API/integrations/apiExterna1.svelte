<script>
    import  { onMount } from "svelte";
	import { pop } from "svelte-spa-router";
	import Table from "sveltestrap/src/Table.svelte";
    import Button from "sveltestrap/src/Button.svelte";

    

    onMount(getEminemApi);

    

    let songs = [];

    async function getEminemApi(){
        
        console.log("Fetching Eminem Songs...");
        const res = await fetch("/search");
        if(res.ok){
            const json = await res.json();
            songs=json;
            console.log("Received " + songs.length + " Eminem´s songs");
        }
        else{
            console.log("Error");
        }

    }


</script>
<script lang="ts">
	import '../app.css';
	let { children } = $props();
	import { ModeWatcher } from 'mode-watcher';
</script>

<svelte:head>
	<title>Sealshare</title>
</svelte:head>
<ModeWatcher />
{@render children()}

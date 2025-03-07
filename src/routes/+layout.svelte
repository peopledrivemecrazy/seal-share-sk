<script lang="ts">
	import { goto } from '$app/navigation';
	import pb from '$lib/vendor/pocketbase';
	import '../app.css';
	let { children } = $props();
	import { ModeWatcher } from 'mode-watcher';

	$effect(() => {
		if (!pb.authStore.token) goto('/login');
	});
</script>

<ModeWatcher />
{@render children()}

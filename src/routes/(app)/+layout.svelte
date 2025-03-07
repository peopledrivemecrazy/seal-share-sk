<script lang="ts">
	import type { Snippet } from 'svelte';
	import type { LayoutData } from './$types';
	import * as Sidebar from '$lib/components/ui/sidebar/index.js';
	import AppSidebar from '$lib/components/app-sidebar.svelte';

	let { data, children }: { data: LayoutData; children: Snippet } = $props();

	import { goto } from '$app/navigation';
	import pb from '$lib/vendor/pocketbase';
	
	$effect(() => {
		if (!pb.authStore.token) goto('/login');
	});
</script>

<Sidebar.Provider>
	<AppSidebar />
	<main>
		<Sidebar.Trigger />
		{@render children?.()}
	</main>
</Sidebar.Provider>

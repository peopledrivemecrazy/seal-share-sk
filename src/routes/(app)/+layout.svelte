<script lang="ts">
	import { onMount, type Snippet } from 'svelte';
	import type { LayoutData } from './$types';

	let { data, children }: { data: LayoutData; children: Snippet } = $props();

	import { goto } from '$app/navigation';
	import pb from '$lib/vendor/pocketbase';
	import { userHasKeys } from '$lib/vendor/pocketbase/user';

	$effect(() => {
		if (!pb.authStore.token) goto('/login');
	});

	onMount(async () => {
		const hasKeys = await userHasKeys();
		if (!hasKeys) goto('/onboarding');
	});
</script>

{@render children?.()}

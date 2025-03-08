<script lang="ts">
	import { onMount, type Snippet } from 'svelte';
	import type { LayoutData } from './$types';

	let { data, children }: { data: LayoutData; children: Snippet } = $props();

	import { goto } from '$app/navigation';
	import pb from '$lib/vendor/pocketbase';
	import { logout, userHasKeys } from '$lib/vendor/pocketbase/user';
	import Button from '$lib/components/ui/button/button.svelte';

	$effect(() => {
		if (!pb.authStore.token) goto('/login');
	});

	onMount(async () => {
		if (pb.authStore.token) {
			const hasKeys = await userHasKeys();
			if (!hasKeys) goto('/onboarding');
		}
	});
</script>

<div class="flex items-center justify-end gap-2 p-2">
	<p>{pb.authStore.record?.email}</p>
	<Button
		size="sm"
		variant="link"
		onclick={() => {
			logout();
			goto('/login');
		}}
	>
		Logout
	</Button>
</div>
{@render children()}

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

	let userEmail = $derived(pb.authStore.record?.email);
	let userName = $derived(userEmail.substring(0, userEmail.indexOf('@')));

</script>

<div class="flex items-center justify-between p-2">
	<!-- navigation links	-->
	<div class="">
		<Button
			size="sm"
			variant="link"
			onclick={() => {
			goto('/');
		}}
		>
			Inbox
		</Button>
		<Button
			size="sm"
			variant="link"
			onclick={() => {
			goto('/send');
		}}
		>
			Send
		</Button>
		<Button
			size="sm"
			variant="link"
			onclick={() => {
			goto('/setting');
		}}
		>
			Setting
		</Button>
	</div>

	<div>
		<p class="inline-block">{userName}</p>
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

</div>
{@render children()}

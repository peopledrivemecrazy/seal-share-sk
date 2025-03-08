<script lang="ts">
	import Button from '$lib/components/ui/button/button.svelte';
	import type { PageData } from './$types';

	let { data }: { data: PageData } = $props();

	console.log(data);

	const downloadFile = () => {
		if (!data.message?.files) return;

		const file = new File([data.message?.files], `${data.message.id}.zip`, {
			type: 'application/zip'
		});

		const url = URL.createObjectURL(file);
		const a = document.createElement('a');
		const now = new Date().toISOString().replace(/[-:Z]/g, '');
		a.href = url;
		a.download = `file_${now}.zip`;
		a.click();
	};
</script>

{#if data.message}
	<div class="px-4">

	<h1 class="text-3xl font-bold text-center my-6">Message</h1>

	<div class="space-y-4">
		<div class="space-y-1">
			<p class="text-lg">
				<span class="font-medium">From:</span> {data.message?.sender_name}
			</p>
			<p class="text-lg">
				<span class="font-medium">On:</span> {data.message?.created}
			</p>
			<p class="text-lg font-medium">Message from {data.message?.sender_name}</p>
		</div>

		<div class="bg-[#1a1a1a] p-4 rounded-md min-h-24">
			<p class="text-white">{data.message.decrypted_message?.decrypted_message || "No message here"}</p>
		</div>
	</div>

	<div class="mt-8 space-x-2">
		<Button onclick={downloadFile}>Download</Button>
		<a href={'/inbox'}>Back to inbox</a>
	</div>
	</div>
	{:else}
	<p>Loading...</p>
{/if}

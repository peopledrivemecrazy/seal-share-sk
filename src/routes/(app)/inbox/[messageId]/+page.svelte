<script lang="ts">
	import Button from '$lib/components/ui/button/button.svelte';
	import type { PageData } from './$types';

	let { data }: { data: PageData } = $props();

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

<Button onclick={downloadFile}>Download</Button>
<a href={'/inbox'}>Back to inbox</a>
{#if data.message}
	<h1>{data.message.id}</h1>

	<hr />
	<pre>
	{data.message.decrypted_message?.decrypted_message}
	</pre>
	<hr />
{:else}
	<p>Loading...</p>
{/if}

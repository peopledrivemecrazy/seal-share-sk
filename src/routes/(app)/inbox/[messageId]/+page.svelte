<script lang="ts">
	import Button from '$lib/components/ui/button/button.svelte';
	import type { PageData } from './$types';

	let { data }: { data: PageData } = $props();

	const downloadFile = () => {
		const file = new File([data.message.files.decrypted_message], 'file.pdf', {
			type: 'application/pdf'
		});

		const url = URL.createObjectURL(file);
		const a = document.createElement('a');
		const now = new Date().toISOString().replace(/[-:Z]/g, '');
		a.href = url;
		a.download = `file_${now}.pdf`;
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

<script lang="ts">
	import { onMount } from 'svelte';
	import { getMessage } from '$lib/vendor/pocketbase/message';
	import type { RecordModel } from 'pocketbase';
	import type { PageData } from './$types';

	let { data }: { data: PageData } = $props();

	console.log(data.message);
</script>

<a href={'/inbox.html'}>Back to inbox</a>
{#if data.message}
	<h1>{data.message.id}</h1>
	<p>From {data.message.sender_name} to {data.message.recepient_name} on {data.message.created}</p>
	<hr />
	<pre>
	{data.message.decrypted_message?.decrypted_message}
	</pre>
	<hr />
	{data.message.decrypted_message?.signature}
	<pre>{JSON.stringify(data.message, null, 2)}</pre>
{:else}
	<p>Loading...</p>
{/if}

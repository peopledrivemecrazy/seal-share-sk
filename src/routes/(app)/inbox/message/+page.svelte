<script lang="ts">
	import { onMount } from 'svelte';
	import { page } from '$app/state';
	import { getMessage } from '$lib/vendor/pocketbase/message';
	import type { RecordModel } from 'pocketbase';

	let message: RecordModel;
	let messageId = '';

	onMount(async () => {
		messageId = page.url.searchParams.get('message_id') || '';
		if (messageId) {
			message = await getMessage(messageId);
		}
	});
</script>

<a href={"/inbox.html"}>Back to inbox</a>
{#if message}
	<h1>{message.id}</h1>
	<p>From {message.sender_name} to {message.recepient_name} on {message.created}</p>
	<hr />
	<pre>
	{message.decrypted_message?.decrypted_message}
	</pre>
	<hr />
	{message.decrypted_message?.signature}
	<pre>{JSON.stringify(message, null, 2)}</pre>
{:else}
	<p>Loading...</p>
{/if}

<script lang="ts">
	import { getMessages } from '$lib/vendor/pocketbase/message';
	import type { RecordModel } from 'pocketbase';
	import { onMount } from 'svelte';
	let messages: RecordModel[] = $state([]);

	onMount(async () => {
		messages = await getMessages();
	});
</script>

<div class="flex items-center justify-end gap-2 p-2">
	<ul>
		{#each messages as message}
			<li>
				<a href={`/inbox/${message.id}`}>
					{message.id} send to {message.created}
				</a>
			</li>
		{/each}
	</ul>
</div>

<script lang="ts">
	import pb from '$lib/vendor/pocketbase';
</script>

{#if pb.authStore.record}
	<div class="flex flex-col items-center justify-center">
		<h1 class="text-2xl font-bold">Welcome, {pb.authStore.record?.name}</h1>
	</div>
{/if}

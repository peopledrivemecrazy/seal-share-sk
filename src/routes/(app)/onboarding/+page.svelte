<script lang="ts">
	import Button from '$lib/components/ui/button/button.svelte';
	import pb from '$lib/vendor/pocketbase';
	import type { PageData } from './$types';
	let checked = $state(false);
	let { data }: { data: PageData } = $props();

	let privateKey = $state(data.privateKey);

	const stringToTxt = (str: string, email: string) => {
		const blob = new Blob([str], { type: 'text/plain' });
		const url = URL.createObjectURL(blob);
		const now = new Date().toISOString();
		const a = document.createElement('a');
		a.href = url;
		a.download = `${email}_key_${now}.txt`;
		a.click();
	};
</script>

<div class="flex min-h-screen flex-col items-center justify-center bg-background p-4">
	<div class="w-full max-w-md">
		<!--	heading	-->
		<h1 class="mb-7 scroll-m-20 text-4xl font-extrabold tracking-tight lg:text-5xl">
			Your Encryption Keys Are Ready!
		</h1>

		<p class="mb-2 text-lg bg-slate-800 p-4 rounded-lg">
			We've generated a unique key pair for you. Your public key will be used to encrypt files, and
			your private key is required to decrypt them. For security reasons, we don't store your
			private key—make sure to download and keep it safe.
		</p>

		<div class="py-4">
			<Button
				class="w-full"
				onclick={() => {
					stringToTxt(privateKey, pb.authStore.record?.email);
				}}>Download Private Key File</Button
			>
		</div>

		<p class="text-sm font-medium">
			If you lose your private key, you won't be able to access encrypted files.
		</p>

		<div class="space-y-4 pt-8">
			<label class="flex cursor-pointer items-center justify-center space-x-2">
				<input type="checkbox" class="checkbox" bind:checked />
				<span class="text-sm font-medium"> I Understand & Saved My Private Key </span>
			</label>

			<Button
				class="btn w-full"
				disabled={!checked}
				onclick={() => {
					window.location.href = '/';
				}}
			>
				Proceed
			</Button>
		</div>
	</div>
</div>

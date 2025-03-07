<script lang="ts">
	import Button from '$lib/components/ui/button/button.svelte';
	import generateKeyPair from '$lib/vendor/openpgp';
	import pb from '$lib/vendor/pocketbase';
	import { createKeyStore } from '$lib/vendor/pocketbase/keystore';
	import { userHasKeys } from '$lib/vendor/pocketbase/user';
	import { onMount } from 'svelte';
	let checked = $state(false);
	let hasKeys = $state(false);

	onMount(async () => {
		hasKeys = await userHasKeys();
		if (hasKeys) {
			window.location.href = '/';
		} else {
			generateKeys();
		}
	});

	let privateKey = $state('');

	const generateKeys = async () => {
		const email = pb.authStore.record?.email;
		if (!email) throw 'No User';
		const { privateKey: pKey, publicKey } = await generateKeyPair(email, 'replaceMeWithUserInput');
		privateKey = pKey;

		const success = await createKeyStore(publicKey);
		if (!success) throw 'Failed to create key store';
	};

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
	<div class="space-y-8r w-full max-w-md">
		<h1 class="scroll-m-20 text-4xl font-extrabold tracking-tight lg:text-5xl">
			Your Encryption Keys Are Ready!
		</h1>

		<p class="text-lg">
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

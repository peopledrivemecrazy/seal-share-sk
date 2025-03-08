<script lang="ts">
	import Button from '$lib/components/ui/button/button.svelte';
	import * as Form from '$lib/components/ui/form/index.js';
	import pb from '$lib/vendor/pocketbase';
	import { superForm, defaults } from 'sveltekit-superforms';
	import { zod } from 'sveltekit-superforms/adapters';
	import { z } from 'zod';

	import type { PageData } from './$types';
	import { Textarea } from '$lib/components/ui/textarea';
	import { isValidPgpPrivateKey } from '$lib/vendor/openpgp';

	const formSchema = z.object({
		private_key: z.string().refine(isValidPgpPrivateKey, {
			message: 'Invalid PGP private key'
		})
	});

	const form = superForm(defaults(zod(formSchema)), {
		SPA: true,
		dataType: 'json',
		validators: zod(formSchema),
		resetForm: false,
		async onUpdate({ form }) {
			if (form.valid) {
				// api call
				console.log($formData);
				localStorage.setItem("privatekey_" + pb.authStore.record?.email, $formData.private_key)
			}
		}
	});
	const { form: formData, enhance } = form;
	$inspect($formData);
</script>

{#if pb.authStore.record}
	<div class="flex flex-col items-center justify-center">
		<h1 class="text-2xl font-bold">Settings for {pb.authStore.record?.name}</h1>
	</div>
{/if}
<div class="p-4">
	<form method="POST" use:enhance>
		<Form.Field {form} name="private_key">
			<Form.Control>
				<Form.Label>Private Key [DO NOT DO THIS AT HOME]</Form.Label>
				<Textarea
					id="private_key"
					placeholder="Enter Your Private Key Here"
					bind:value={$formData.private_key}
				/>
			</Form.Control>
			<Form.Description />
			<Form.FieldErrors />
		</Form.Field>

		<div>
			<Button type="submit" class="my-2 w-full capitalize">Save</Button>
		</div>
	</form>
</div>

<script lang="ts">
	import Button from '$lib/components/ui/button/button.svelte';
	import * as Form from '$lib/components/ui/form/index.js';
	import { Input } from '$lib/components/ui/input/index.js';
	import type { PageData } from './$types';
	import { superForm, defaults } from 'sveltekit-superforms';
	let { data }: { data: PageData } = $props();
	import { zod } from 'sveltekit-superforms/adapters';

	import { z } from 'zod';

	const formSchema = z.object({
		email: z.string().email(),
		password: z.string().min(8)
	});

	const form = superForm(defaults(zod(formSchema)), {
		SPA: true,
		dataType: 'json',
		validators: zod(formSchema),
		onUpdate({ form }) {
			if (form.valid) {
				// TODO: Call an external API with form.data, await the result and update form
			}
		}
	});
	const { form: formData, enhance, message, constraints } = form;
</script>

<div class="grid h-screen place-items-center">
	<div class="w-full max-w-md">
		{#if $message}<h3>{$message}</h3>{/if}

		<form method="POST" use:enhance>
			<Form.Field {form} name="email">
				<Form.Control>
					<Form.Label>Email</Form.Label>
					<Input {...$constraints.email} bind:value={$formData.email} />
				</Form.Control>
				<Form.Description />
				<Form.FieldErrors />
			</Form.Field>
			<Form.Field {form} name="password">
				<Form.Control>
					<Form.Label>Password</Form.Label>
					<Input {...$constraints.password} bind:value={$formData.password} type="password" />
				</Form.Control>
				<Form.Description />
				<Form.FieldErrors />
			</Form.Field>
			<div>
				<Button type="submit" class="my-2">Submit</Button>
			</div>
		</form>
	</div>
</div>

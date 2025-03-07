<script lang="ts">
	import Button from '$lib/components/ui/button/button.svelte';
	import * as Form from '$lib/components/ui/form/index.js';
	import { Input } from '$lib/components/ui/input/index.js';
	import { requestOTP } from '$lib/vendor/pocketbase/user';
	import { superForm, defaults } from 'sveltekit-superforms';
	let { otpId = $bindable(''), email = $bindable('') }: { otpId: string; email: string } = $props();
	import { zod } from 'sveltekit-superforms/adapters';

	import { z } from 'zod';

	const formSchema = z.object({
		email: z.string().email()
	});

	const form = superForm(defaults(zod(formSchema)), {
		SPA: true,
		dataType: 'json',
		validators: zod(formSchema),
		async onUpdate({ form }) {
			if (form.valid) {
				email = $formData.email;
				otpId = await requestOTP($formData.email);
			}
		}
	});

	const { form: formData, enhance, message, constraints } = form;
</script>

<div class="grid h-screen place-items-center p-4">
	<div class="w-full max-w-sm">
		<h1 class="text-2xl font-bold">Welcome back</h1>
		<p class="text-sm text-gray-500">Log in to continue your journey with us.</p>
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
			<div>
				<Button type="submit" class="my-2 w-full capitalize">Sign in with Email</Button>
			</div>
		</form>
	</div>
</div>

<script lang="ts">
	import { goto } from '$app/navigation';
	import Button from '$lib/components/ui/button/button.svelte';
	import * as Form from '$lib/components/ui/form/index.js';
	import { Input } from '$lib/components/ui/input/index.js';
	import { login, requestOTP } from '$lib/vendor/pocketbase/user';
	import { superForm, defaults } from 'sveltekit-superforms';
	let { otpId = $bindable(''), email = $bindable('') }: { otpId: string; email: string } = $props();
	import { zod } from 'sveltekit-superforms/adapters';

	import { z } from 'zod';

	const formSchema = z.object({
		email: z.string().email(),
		password: z.string().min(8).optional()
	});

	let togglePasswordInput = $state(true);

	const form = superForm(defaults(zod(formSchema)), {
		SPA: true,
		dataType: 'json',
		validators: zod(formSchema),
		async onUpdate({ form }) {
			if (form.valid) {
				email = $formData.email;
				if (!togglePasswordInput) otpId = await requestOTP($formData.email);
				else if ($formData.password) {
					const user = await login($formData.email, $formData.password);
					if (user.token) await goto('/');
				}
			}
		}
	});

	const { form: formData, enhance, message, constraints } = form;
</script>

<div class="grid h-screen place-items-center p-4">
	<div class="w-full max-w-sm">
		<!--	Header	-->
		<div class="mb-4">
			<h1 class="text-center text-2xl font-bold mb-2">Welcome back</h1>
			<p class="text-center text-sm text-gray-500">Log in to continue your journey with us.</p>
		</div>

		{#if $message}<h3>{$message}</h3>{/if}

		<form method="POST" use:enhance>
			<!--	Email		-->
			<Form.Field {form} name="email">
				<Form.Control>
					<Form.Label>Email</Form.Label>
					<Input {...$constraints.email} bind:value={$formData.email} />
				</Form.Control>
				<Form.Description />
				<Form.FieldErrors />
			</Form.Field>

			{#if togglePasswordInput}
				<Form.Field {form} name="password">
					<Form.Control>
						<Form.Label>Password</Form.Label>
						<Input {...$constraints.password} bind:value={$formData.password} type="password" />
					</Form.Control>
					<Form.Description />
					<Form.FieldErrors />
				</Form.Field>
			{/if}
			<div>
				<Button type="submit" class="my-3 w-full capitalize">
					{togglePasswordInput ? 'Sign in' : 'Sign in with Email'}
				</Button>
			</div>
			<!--	Ask to toggle with OTP option		-->
			<div class="text-center text-xs">
				<Button variant="link" onclick={() => (togglePasswordInput = !togglePasswordInput)}>
					{togglePasswordInput ? 'Sign in with OTP instead?' : 'Sign in with password?'}
				</Button>
			</div>
		</form>
	</div>
</div>

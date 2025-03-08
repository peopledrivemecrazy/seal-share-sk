<script lang="ts">
	import Button from '$lib/components/ui/button/button.svelte';
	import * as Form from '$lib/components/ui/form/index.js';
	import pb from '$lib/vendor/pocketbase';
	import { superForm, defaults } from 'sveltekit-superforms';
	import { zod } from 'sveltekit-superforms/adapters';
	import { z } from 'zod';
	import { Input } from '$lib/components/ui/input/index.js';
	import SearchRecipients from '$lib/components/search-recipients.svelte';

	import type { PageData } from './$types';
	import { Textarea } from '$lib/components/ui/textarea';
	let { data }: { data: PageData } = $props();

	const formSchema = z.object({
		recipient: z.string().email(),
		message: z.string(),
		files: z.array(z.string())
	});

	const form = superForm(defaults(zod(formSchema)), {
		SPA: true,
		dataType: 'json',
		validators: zod(formSchema),
		async onUpdate({ form }) {
			if (form.valid) {
				console.log(form.data);
			}
		}
	});
	const { form: formData, enhance, message, constraints } = form;
</script>

{#if pb.authStore.record}
	<div class="flex flex-col items-center justify-center">
		<h1 class="text-2xl font-bold">Welcome, {pb.authStore.record?.name}</h1>
	</div>
{/if}
<div class="p-4">
	<form method="POST" use:enhance>
		<Form.Field {form} name="recipient">
			<Form.Control>
				<Form.Label>Recipient</Form.Label>

				<div>
					<SearchRecipients
						placeholder="Search recipients..."
						fallback="No recipients found"
						users={data.users}
					/>
				</div>
			</Form.Control>
			<Form.Description />
			<Form.FieldErrors />
		</Form.Field>
		<Form.Field {form} name="message">
			<Form.Control>
				<Form.Label>Message</Form.Label>
				<Textarea id="message" placeholder="Enter your message here..." />
			</Form.Control>
			<Form.Description />
			<Form.FieldErrors />
		</Form.Field>
		<Form.Field {form} name="files">
			<Form.Control>
				<Form.Label>Files</Form.Label>
				<div class="grid w-full max-w-sm items-center gap-1.5">
					<Input id="files" type="file" multiple />
				</div>
			</Form.Control>
			<Form.Description />
			<Form.FieldErrors />
		</Form.Field>

		<div>
			<Button type="submit" class="my-2 w-full capitalize">Submit</Button>
		</div>
	</form>
</div>

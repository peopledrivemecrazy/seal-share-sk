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
	import { sendMessage } from '$lib/vendor/pocketbase/message';
	let { data }: { data: PageData } = $props();

	const formSchema = z.object({
		recipientId: z.string(),
		message: z.string(),
		files: z.record(z.string(), z.instanceof(File))
	});

	const form = superForm(defaults(zod(formSchema)), {
		SPA: true,
		dataType: 'json',
		validators: zod(formSchema),
		resetForm: false,
		async onUpdate({ form }) {
			if (form.valid) {
				// api call
				sendMessage($formData);
			}
		}
	});
	const { form: formData, enhance } = form;
	$inspect($formData);
</script>

{#if pb.authStore.record}
	<div class="flex flex-col items-center justify-center">
		<h1 class="text-2xl font-bold">Welcome, {pb.authStore.record?.name}</h1>
	</div>
{/if}
<div class="p-4">
	<form method="POST" use:enhance>
		<Form.Field {form} name="recipientId">
			<Form.Control>
				<Form.Label>Recipient</Form.Label>

				<div>
					<SearchRecipients
						placeholder="Search recipients..."
						fallback="No recipients found"
						users={data.users}
						bind:value={$formData.recipientId}
					/>
				</div>
			</Form.Control>
			<Form.Description />
			<Form.FieldErrors />
		</Form.Field>
		<Form.Field {form} name="message">
			<Form.Control>
				<Form.Label>Message</Form.Label>
				<Textarea
					id="message"
					placeholder="Enter your message here..."
					bind:value={$formData.message}
				/>
			</Form.Control>
			<Form.Description />
			<Form.FieldErrors />
		</Form.Field>
		<Form.Field {form} name="files">
			<Form.Control>
				<Form.Label>Files</Form.Label>
				<div class="grid w-full max-w-sm items-center gap-1.5">
					<Input
						id="files"
						type="file"
						multiple
						onchange={(e) => {
							const files = (e.target as HTMLInputElement).files;
							if (!files) return;
							const newFiles: Record<string, File> = {};
							const keys = Object.keys(files);

							for (let i = 0; i < keys.length; i++) {
								const file = files[i];
								newFiles[file.name] = file;
							}
							$formData.files = newFiles;
						}}
					/>
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

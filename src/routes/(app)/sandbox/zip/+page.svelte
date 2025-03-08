<script lang="ts">
	import { zipDocuments } from '$lib/vendor/jszip/index';
	import * as Form from '$lib/components/ui/form/index.js';
	import { Input } from '$lib/components/ui/input/index.js';
	import { superForm, defaults } from 'sveltekit-superforms';
	import { zod } from 'sveltekit-superforms/adapters';

	import { z } from 'zod';
	import Button from '$lib/components/ui/button/button.svelte';

	const formSchema = z.object({
		documents: z.record(z.string(), z.instanceof(File))
	});

	const form = superForm(defaults(zod(formSchema)), {
		SPA: true,
		dataType: 'json',
		async onUpdate({ form }) {
			if (form.valid) {
				const zip = await zipDocuments($formData.documents, 'test.zip');
				downloadZip(zip);
			}
		}
	});
	const { form: formData, enhance, message, constraints } = form;
	const downloadZip = (zip: Blob) => {
		const url = URL.createObjectURL(zip);
		const a = document.createElement('a');
		a.href = url;
		a.download = 'test.zip';
		a.click();
		URL.revokeObjectURL(url);
	};
</script>

<form method="POST" use:enhance>
	<Form.Field {form} name="documents">
		<Form.Control>
			<Form.Label>Files</Form.Label>
			<Input
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
					$formData.documents = newFiles;
				}}
			/>
		</Form.Control>
	</Form.Field>
	<Button type="submit">Submit</Button>
</form>

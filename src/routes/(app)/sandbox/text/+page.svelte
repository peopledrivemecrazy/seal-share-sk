<script lang="ts">
	import Button from '$lib/components/ui/button/button.svelte';
	import { encrypt, decrypt } from '$lib/vendor/openpgp/streamed';

	const pubKey = `-----BEGIN PGP PUBLIC KEY BLOCK-----

xiYEZ8te2RsHqYBRyPBUL1yj0NsO0AQWonb03J7jgfsu7Ycep+759s0RPHRl
c3QubGVvQHRkdS5jYz7CwA8EExsKAIUFgmfLXtkDCwkHCZA2FYJMRmMXYkUU
AAAAAAAcACBzYWx0QG5vdGF0aW9ucy5vcGVucGdwanMub3JnDK5fI2xWxTbz
t0FgZk4xcPgqmBsxjPgGFhDX7l0LCTAFFQoIDgwEFgACAQIZAQKbAwIeARYh
BKaRU7At1LdsZJKUezYVgkxGYxdiAAAmtm/DwLlCOSI5KIHvNPcEa4xgH1k8
fgGKbPc8/U0BbJxXCjfibOgP6QC5/eSAPgLTo/y4ZLJTWliZwGlkfDjKtQTO
JgRny17ZGbKT9fw/Y/ZENLHH7Vc2w+kWXy/46tJ52/Yul7K0xWBRwroEGBsK
AHAFgmfLXtkJkDYVgkxGYxdiRRQAAAAAABwAIHNhbHRAbm90YXRpb25zLm9w
ZW5wZ3Bqcy5vcmdZ2SBiwDEXCQLtCufrFnz/qkLdp65W8tmU9H7PDnFF4QKb
DBYhBKaRU7At1LdsZJKUezYVgkxGYxdiAABFu1aHau1QwXltz+VtiHg/+kLN
0zUQixkXhMceOslp1RGDGhh+d7LFs18CBlhPSntU7OiNd/LN0kjqPEZNg4nX
QwI=
=vqeC
-----END PGP PUBLIC KEY BLOCK-----
`;
	const privKey = `-----BEGIN PGP PRIVATE KEY BLOCK-----

xXcEZ8te2RsHqYBRyPBUL1yj0NsO0AQWonb03J7jgfsu7Ycep+759v4JAwif
ATqWnhINLuAAAAAAAAAAAAAAAAAAAAAAdGDt/lMeQrU1PE7EvJi4SDTWWy6C
hLfpG78WYfR40w+wXxE9MBw9OpmHXn1+9ySNjK1UZM0RPHRlc3QubGVvQHRk
dS5jYz7CwA8EExsKAIUFgmfLXtkDCwkHCZA2FYJMRmMXYkUUAAAAAAAcACBz
YWx0QG5vdGF0aW9ucy5vcGVucGdwanMub3JnDK5fI2xWxTbzt0FgZk4xcPgq
mBsxjPgGFhDX7l0LCTAFFQoIDgwEFgACAQIZAQKbAwIeARYhBKaRU7At1Lds
ZJKUezYVgkxGYxdiAAAmtm/DwLlCOSI5KIHvNPcEa4xgH1k8fgGKbPc8/U0B
bJxXCjfibOgP6QC5/eSAPgLTo/y4ZLJTWliZwGlkfDjKtQTHdwRny17ZGbKT
9fw/Y/ZENLHH7Vc2w+kWXy/46tJ52/Yul7K0xWBR/gkDCMd21uyNMSjH4AAA
AAAAAAAAAAAAAAAAAADgoED44AHbE+/OWoPH86Hy3GlX4XeKT0PSK2mNYQ3W
85hOPS+8bc5rXp4WviWaDdI7dBpSwroEGBsKAHAFgmfLXtkJkDYVgkxGYxdi
RRQAAAAAABwAIHNhbHRAbm90YXRpb25zLm9wZW5wZ3Bqcy5vcmdZ2SBiwDEX
CQLtCufrFnz/qkLdp65W8tmU9H7PDnFF4QKbDBYhBKaRU7At1LdsZJKUezYV
gkxGYxdiAABFu1aHau1QwXltz+VtiHg/+kLN0zUQixkXhMceOslp1RGDGhh+
d7LFs18CBlhPSntU7OiNd/LN0kjqPEZNg4nXQwI=
=WNrc
-----END PGP PRIVATE KEY BLOCK-----`;

	let encrypted = $state('');

	const enc = async () => {
		encrypted = await encrypt(pubKey, $formData.documents, 'test.zip');
	};

	const dec = async () => {
		const decrypted = await decrypt(encrypted, privKey);
		console.log(decrypted);
		download(decrypted);
	};

	const download = async (file: Blob) => {
		const fileBlob = new File([file], 'test.zip');
		const url = URL.createObjectURL(fileBlob);
		const a = document.createElement('a');
		a.href = url;
		a.download = fileBlob.name;
		a.click();
	};

	import * as Form from '$lib/components/ui/form/index.js';
	import { Input } from '$lib/components/ui/input/index.js';
	import { superForm, defaults } from 'sveltekit-superforms';
	import { zod } from 'sveltekit-superforms/adapters';

	import { z } from 'zod';

	const formSchema = z.object({
		documents: z.record(z.string(), z.instanceof(File))
	});
	const form = superForm(defaults(zod(formSchema)), {
		SPA: true,
		dataType: 'json',
		async onUpdate({ form }) {
			if (form.valid) {
				enc();
			}
		}
	});
	const { form: formData, enhance, message, constraints } = form;
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
	<Button type="submit">Encrypt</Button>
</form>

<Button onclick={dec}>Decrypt</Button>

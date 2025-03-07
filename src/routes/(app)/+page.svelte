<script lang="ts">
	import { Button } from '$lib/components/ui/button/index.js';
	import generateKeyPair from '$lib/vendor/openpgp';
	import pb from '$lib/vendor/pocketbase';

	const getData = async () => {
		const record = await pb.collection('test').getOne('408a03k76nkg4et');
		console.log(record);
	};

	let keys = $state({
		privateKey: '',
		publicKey: '',
		revocationCertificate: ''
	});

	const generateKeys = async () => {
		const { privateKey, publicKey, revocationCertificate } = await generateKeyPair(
			'test@test.com',
			'test'
		);
		keys = { privateKey, publicKey, revocationCertificate };
	};
</script>

<Button onclick={getData}>Click me</Button>
<Button onclick={generateKeys}>Generate keys</Button>
<pre>{JSON.stringify(keys, null, 2)}</pre>

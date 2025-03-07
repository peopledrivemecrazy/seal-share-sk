<script lang="ts">
	import { Button } from '$lib/components/ui/button/index.js';
	import pb from '$lib/vendor/pocketbase';

	const getData = async () => {
		const record = await pb.collection('test').getOne('408a03k76nkg4et');
		console.log(record);
	};
</script>

<Button onclick={getData}>Click me</Button>

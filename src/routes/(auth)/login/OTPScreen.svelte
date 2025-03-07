<script lang="ts">
	import Button from '$lib/components/ui/button/button.svelte';
	let {
		otp = $bindable(''),
		submit = $bindable(() => {}),
		email = $bindable(''),
		otpId = $bindable('')
	}: { otp: string; submit: () => void; email: string; otpId: string } = $props();
	import * as InputOTP from '$lib/components/ui/input-otp/index.js';
	import { requestOTP } from '$lib/vendor/pocketbase/user';
</script>

<div class="mx-auto max-w-sm">
	<h1 class="text-2xl font-bold">Enter the code sent to your email</h1>
	<InputOTP.Root maxlength={8} class="text-center" bind:value={otp}>
		{#snippet children({ cells })}
			<InputOTP.Group>
				{#each cells.slice(0, 8) as cell}
					<InputOTP.Slot {cell} />
				{/each}
			</InputOTP.Group>
		{/snippet}
	</InputOTP.Root>
</div>
<Button class="mt-4 w-full" onclick={submit}>Verify</Button>

<div class="my-3">
	<p>
		Didn't receive the code?
		<Button
			variant="link"
			onclick={async () => {
				otpId = await requestOTP(email);
			}}
		>
			Resend
		</Button>
	</p>
</div>

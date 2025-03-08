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
	<!-- heading -->
	<h1 class="text-2xl font-bold mb-4 text-center">Enter the code sent to your email</h1>
	<!-- input OTP	-->
	<InputOTP.Root maxlength={8} bind:value={otp}>
		{#snippet children({ cells })}
			<InputOTP.Group class="w-full relative left-8">
				{#each cells.slice(0, 8) as cell}
					<InputOTP.Slot {cell} />
				{/each}
			</InputOTP.Group>
		{/snippet}
	</InputOTP.Root>
</div>

<Button class="mt-4 w-full" onclick={submit}>Verify</Button>

<div class="my-3">
	<p class="text-center">
		Didn't receive the code?
		<Button
			class="p-0 text-md"
			variant="link"
			onclick={async () => {
				otpId = await requestOTP(email);
			}}
		>
			Resend OTP
		</Button>
	</p>
</div>

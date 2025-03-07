<script lang="ts">
	import { goto } from '$app/navigation';
	import { verifyOTP } from '$lib/vendor/pocketbase/user';
	import LoginForm from './LoginForm.svelte';
	import OtpScreen from './OTPScreen.svelte';
	let otpId = $state('');
	let otp = $state('');
	let email = $state('');
	const submit = async () => {
		const user = await verifyOTP(otpId, otp);
		if (user.token) goto('/');
	};
</script>

{#if !otpId}
	<LoginForm bind:otpId bind:email />
{:else}
	<div class="grid h-screen place-items-center p-4">
		<div class="w-full max-w-sm">
			<OtpScreen bind:otp bind:email bind:otpId {submit} />
		</div>
	</div>
{/if}

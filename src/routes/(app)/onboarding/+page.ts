import generateKeyPair from '$lib/vendor/openpgp';
import pb from '$lib/vendor/pocketbase';
import { createKeyStore } from '$lib/vendor/pocketbase/keystore';
import { userHasKeys } from '$lib/vendor/pocketbase/user';
import { redirect } from '@sveltejs/kit';
import type { PageLoad } from './$types';

export const load = (async () => {
	const hasKeys = await userHasKeys();
	if (!hasKeys) {
		const { privateKey, publicKey } = await generateKeys();

		localStorage.setItem('privatekey_' + pb.authStore.record?.email, privateKey)
		
		return {
			hasKeys,
			privateKey,
			publicKey
		};
	} else redirect(301, '/');
}) satisfies PageLoad;

const generateKeys = async () => {
	const email = pb.authStore.record?.email;
	if (!email) throw 'No User';
	const { privateKey, publicKey } = await generateKeyPair(email, 'replaceMeWithUserInput');
	const success = await createKeyStore(publicKey);
	if (!success) throw 'Failed to create key store';
	return { privateKey, publicKey };
};

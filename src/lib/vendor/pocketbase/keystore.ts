import pb from '.';

export const createKeyStore = async (publicKey: string) => {
	const user = pb.authStore.record;
	if (!user?.id) return false;

	const data = {
		user: user.id,
		key_name: `${user.email} public key ${new Date().toString()}`,
		public_key: publicKey,
		fingerprint: 'TODO'
	};

	const record = await pb.collection('user_public_keys').create(data);

	return !!record;
};

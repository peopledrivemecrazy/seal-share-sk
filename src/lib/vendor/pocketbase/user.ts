import pb from '.';

export interface User {
	email: string;
	publicKey: string;
	revocationCertificate: string;
	key_name: string;
	role: 'doctor' | 'lawyer' | 'pd';
}

export const createUser = async (user: User) => {
	const password = crypto.randomUUID();

	const data = {
		email: user.email,
		role: user.role,
		publicKey: user.publicKey,
		revocationCertificate: user.revocationCertificate,
		key_name: user.key_name,
		password,
		confirmPassword: password,
		verified: true
	};

	const request = await pb.collection('users').create(data);

	return request;
};

export const login = async (email: string, password: string) => {
	const request = await pb.collection('users').authWithPassword(email, password);
	return request;
};

export const logout = async () => {
	pb.authStore.clear();
};

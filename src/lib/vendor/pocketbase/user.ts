import pb from '.';
import { PgpKeyConfig } from '../openpgp/index';

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

export const requestOTP = async (email: string) => {
	const { otpId } = await pb.collection('users').requestOTP(email);
	return otpId;
};

export const verifyOTP = async (otpId: string, otp: string) => {
	const request = await pb.collection('users').authWithOTP(otpId, otp);
	return request;
};

export const userHasKeys = async () => {
	const id = pb.authStore.record?.id;
	if (!id) return false;
	try {
		const request = await pb.collection('user_public_keys').getFirstListItem(`user = "${id}"`);
		console.log(request);
		return !!request;
		// eslint-disable-next-line @typescript-eslint/no-unused-vars
	} catch (error) {
		return false;
	}
};

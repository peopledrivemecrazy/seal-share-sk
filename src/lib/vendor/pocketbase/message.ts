import { getDecryptedMessage } from '../openpgp/index';
import pb from './index';

export const getMessages = async () => {
	return await pb.collection('messages').getFullList();
};

export const getMessage = async (messageId: string) => {
	const record = await pb.collection('messages').getOne(messageId);

	const passphrase = 'replaceMeWithUserInput';
	const user = pb.authStore.record?.email;
	const privateKey = localStorage.getItem('privatekey_' + user);
	if (!privateKey) throw 'No Private Key';

	const decrypted_message = await getDecryptedMessage(
		record.encrypted_message,
		privateKey,
		passphrase
	);

	console.log({ ...record, decrypted_message });
	return { ...record, decrypted_message };
};

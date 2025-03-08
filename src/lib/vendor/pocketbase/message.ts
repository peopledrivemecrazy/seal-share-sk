import { encryptDocument, getDecryptedMessage, getEncryptedMessage } from '../openpgp/index';
import pb from './index';
import { getKeyStore } from './keystore';

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

	return { ...record, decrypted_message };
};

export interface Message {
	recipientId: string;
	message: string;
	files: Record<string, File>;
}

export const sendMessage = async ({ recipientId, message, files }: Message) => {
	const documents = Object.values(files).map((e) => new File([e], e.name));
	const encryptedDocuments = await encryptDocuments(documents, recipientId);
	const data = {
		sender: pb.authStore.record?.id,
		recipient: recipientId,
		encrypted_message: getEncryptedMessage(message, (await getKeyStore(recipientId)).public_key),
		files: encryptedDocuments,
		public_key: (await getKeyStore(recipientId)).id // recipient public key id
	};

	const record = await pb.collection('messages').create(data);
	return record;
};

const encryptDocuments = async (documents: File[], recipientId: string) => {
	const publicKey = await getKeyStore(recipientId);
	if (!publicKey) return false;
	const encryptedDocuments = documents.map((document) => {
		return encryptDocument(document.arrayBuffer(), publicKey.public_key);
	});
	return encryptedDocuments;
};

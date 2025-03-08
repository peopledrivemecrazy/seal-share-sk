import { encryptDocument, getDecryptedMessage, getEncryptedMessage } from '../openpgp/index';
import pb, { pb_host } from './index';
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

	const rawTextFile = await fetchPBFile({
		collectionId: record.collectionId,
		recordId: record.id,
		filename: record.files[0]
	});

	const decrypted_files = await getDecryptedMessage(rawTextFile, privateKey, passphrase);
	console.log(decrypted_files);
	return { ...record, decrypted_message, files: decrypted_files };
};

export interface Message {
	recipientId: string;
	message: string;
	files: Record<string, File>;
}

export const sendMessage = async ({ recipientId, message, files }: Message) => {
	const sender = pb.authStore.record?.id;
	if (!sender) throw 'No sender';

	const documents = Object.values(files).map((e) => new File([e], e.name));
	const { public_key, id: keyId } = await getKeyStore(recipientId);
	const encryptedDocuments = await encryptDocuments(documents, public_key);
	const _files = await Promise.all(encryptedDocuments);

	const data = {
		sender,
		recepient: recipientId,
		encrypted_message: await getEncryptedMessage(message, public_key),
		files: _files,
		public_key: keyId // recipient public key id
	};

	const record = await pb.collection('messages').create(data);
	return record;
};

const encryptDocuments = async (documents: File[], publicKey: string) => {
	const encryptedDocuments = documents.map(async (document) => {
		const encrypted = await encryptDocument(await document.arrayBuffer(), publicKey);
		return blobify(encrypted);
	});
	return encryptedDocuments;
};

const blobify = (encrypted: string) => {
	const blob = new Blob([encrypted], { type: 'application/octet-stream' });
	return blob;
};

const fetchPBFile = async ({
	collectionId,
	recordId,
	filename
}: {
	collectionId: string;
	recordId: string;
	filename: string;
}) => {
	// https://hack.tdu.cc/_pb/api/files/pbc_3446931122/l7dc0yqycuzq5hx/blob_zyefc00jg0.txt?token=
	const url = pb_host + `/api/files/${collectionId}/${recordId}/${filename}`;
	console.log(url);
	const response = await fetch(url);
	const blob = await response.text();
	return blob;
};

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

	return { ...record, decrypted_message };
};

export interface Message {
	recipientId: string;
	message: string;
	files: Record<string, File>;
}

export const sendMessage = async ({ recipientId, message, files }: Message) => {
	// create a new record and upload multiple files
	// (files must be Blob or File instances)
	// const createdRecord = await pb.collection('example').create({
	//     title: 'Hello world!', // regular text field
	//     'documents': [
	//         new File(['content 1...'], 'file1.txt'),
	//         new File(['content 2...'], 'file2.txt'),
	//     ]
	// });

	const documents = Object.values(files).map((e) => new File([e], e.name));
	const data = {
		sender: pb.authStore.record?.id,
		recipient: recipientId,
		encrypted_message: message,
		files: documents,
		public_key: 'dly9tyioijrgnh6'
	};
	console.log(data);
	const record = await pb.collection('messages').create(data);
	return record;
};

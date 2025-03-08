import * as openpgp from 'openpgp';
import { zipDocuments } from '../jszip';

export const encrypt = async (
	publicKeyArmored: string,
	documents: Record<string, File>,
	filename: string
) => {
	const browserZipped = await zipDocuments(documents, filename);

	const zipFile = await new File([browserZipped], `${filename}.zip.enc`).arrayBuffer();

	const publicKey = await openpgp.readKey({ armoredKey: publicKeyArmored });

	const encrypted = await openpgp.encrypt({
		message: await openpgp.createMessage({ binary: new Uint8Array(zipFile) }),
		encryptionKeys: publicKey,
		format: 'binary'
	});

	// Convert binary data to base64 string in chunks
	const chunk = 8192;
	let result = '';
	const arr = new Uint8Array(encrypted as ArrayBuffer);
	
	for (let i = 0; i < arr.length; i += chunk) {
		const slice = arr.subarray(i, i + chunk);
		result += String.fromCharCode(...slice);
	}
	
	return btoa(result);
};

export const decrypt = async (encrypted: string, privateKeyArmored: string) => {
	// Convert base64 string back to binary in chunks
	const binaryStr = atob(encrypted);
	const binaryData = new Uint8Array(binaryStr.length);
	const chunk = 8192;

	for (let i = 0; i < binaryStr.length; i += chunk) {
		const end = Math.min(i + chunk, binaryStr.length);
		for (let j = i; j < end; j++) {
			binaryData[j] = binaryStr.charCodeAt(j);
		}
	}

	const message = await openpgp.readMessage({ 
		binaryMessage: binaryData 
	});

	const privateKey = await openpgp.decryptKey({
		privateKey: await openpgp.readPrivateKey({ armoredKey: privateKeyArmored }),
		passphrase: 'replaceMeWithUserInput'
	});
	
	const { data: decrypted } = await openpgp.decrypt({
		message,
		decryptionKeys: privateKey,
		format: 'binary'
	});
	
	const blob = new Blob([decrypted], { type: 'application/zip' });
	return blob;
};

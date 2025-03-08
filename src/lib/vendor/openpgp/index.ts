import * as openpgp from 'openpgp';

// const encrypt = async (publicKeyArmored: string, file: File) => {
// 	const message = await openpgp.createMessage({ binary: file });
// 	const publicKey = await openpgp.readKey({ armoredKey: publicKeyArmored });
// 	const encrypted = await openpgp.encrypt({
// 		message,

// 	});

// 	return encrypted;
// };

export type PgpKeyConfig = {
	privateKey: string;
	publicKey: string;
	revocationCertificate: string;
	fingerprint: string;
};

const generateKeyPair = async (email: string, passphrase: string): Promise<PgpKeyConfig> => {
	const { privateKey, publicKey, revocationCertificate } = await openpgp.generateKey({
		type: 'curve25519',
		userIDs: [{ email }],
		passphrase
	});

	// Get the fingerprint of the public key (instead of keyID) since curve25519 does not support keyID
	const fingerprint = 'TO IMPLEMENT';

	return { privateKey, publicKey, revocationCertificate, fingerprint };
};

export const getEncryptedMessage = async (message: string, publicKeyArmored: string) => {
	const publicKey = await openpgp.readKey({ armoredKey: publicKeyArmored });

	const encrypted = await openpgp.encrypt({
		message: await openpgp.createMessage({ text: message }), // input as Message object
		encryptionKeys: publicKey
		//signingKeys: privateKey // optional
	});

	return encrypted;
};

export const getDecryptedMessage = async (
	encrypted_message: string,
	privateKeyArmored: string,
	passphrase: string
) => {
	const message = await openpgp.readMessage({
		armoredMessage: encrypted_message // parse armored message
	});

	const privateKey = await openpgp.decryptKey({
		privateKey: await openpgp.readPrivateKey({ armoredKey: privateKeyArmored }),
		passphrase
	});

	const { data: decrypted_message, signatures } = await openpgp.decrypt({
		message,
		//verificationKeys: publicKey, // optional
		decryptionKeys: privateKey
	});

	return { decrypted_message, signatures };
};

export const encryptDocument = async (document: ArrayBuffer, publicKeyArmored: string) => {
	const publicKey = await openpgp.readKey({ armoredKey: publicKeyArmored });
	const encrypted = await openpgp.encrypt({
		message: await openpgp.createMessage({ binary: new Uint8Array(document) }),
		encryptionKeys: publicKey
	});

	return encrypted;
};

export default generateKeyPair;

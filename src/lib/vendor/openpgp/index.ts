import * as openpgp from 'openpgp';

// const encrypt = async (publicKeyArmored: string, file: File) => {
// 	const message = await openpgp.createMessage({ binary: file });
// 	const publicKey = await openpgp.readKey({ armoredKey: publicKeyArmored });
// 	const encrypted = await openpgp.encrypt({
// 		message,

// 	});

// 	return encrypted;
// };

const generateKeyPair = async (email: string, passphrase: string) => {
	const { privateKey, publicKey, revocationCertificate } = await openpgp.generateKey({
		type: 'curve25519',
		userIDs: [{ email }],
		passphrase
	});

	return { privateKey, publicKey, revocationCertificate };
};

export default generateKeyPair;

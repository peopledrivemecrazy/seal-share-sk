<script lang="ts">
	import { Button } from '$lib/components/ui/button/index.js';
	import { Input } from '$lib/components/ui/input';
	import generateKeyPair, { getDecryptedMessage, getEncryptedMessage } from '$lib/vendor/openpgp';
	import pb from '$lib/vendor/pocketbase';
	import type { RecordModel } from 'pocketbase';

	const helloWorld = () => {
		console.log(helloWorld);
	};

	const getData = async () => {
		const record = await pb.collection('test').getOne('408a03k76nkg4et');
		console.log(record);
	};

	let keys = $state({
		privateKey: '',
		publicKey: '',
		revocationCertificate: ''
	});

	const generateKeys = async () => {
		const { privateKey, publicKey, revocationCertificate } = await generateKeyPair(
			'test@test.com',
			'test'
		);
		keys = { privateKey, publicKey, revocationCertificate };
	};

    // ---------------------------------------------------------------------------------------

	let email = $state('');
	let otpId = $state('');
	let verification_code = $state('');

	const initiateOtp = async () => {
		const result = await pb.collection('users').requestOTP(email);

		otpId = result.otpId;
		verification_code = '';
		console.log({ result });
	};
	const verifyOtp = async () => {
		const authData = await pb.collection('users').authWithOTP(otpId, verification_code);

		console.log({ authData });
	};

    
    // ---------------------------------------------------------------------------------------
	const savePgpKey = async () => {
		const user = pb.authStore.record?.email;
		if (!user) throw 'No User';

		const { privateKey, publicKey, revocationCertificate } = await generateKeyPair(
			user,
			'replaceMeWithUserInput'
		);

		console.log(pb.authStore.record);

		localStorage.setItem('privatekey_' + user, privateKey);
		const data = {
			user: pb.authStore.record?.id,
			key_name: `${user} public key ${new Date().toString()}`,
			public_key: publicKey,
			fingerprint: 'TODO'
		};

		const record = await pb.collection('user_public_keys').create(data);

		console.log({ record });
	};

    
    // ---------------------------------------------------------------------------------------

	let message = $state('');
	let recipientPublicKeyId = $state('');
	const saveEncryptedMessage = async () => {
        const sender = pb.authStore.record?.id

        type UserKeyRecord = {
            id: string,
            user: string, 
            key_name: string,
            public_key: string,
            fingerprint: string,
        }
        const selectedKey = publicKeys.find((key: RecordModel) => {
            return key.id === recipientPublicKeyId
        })

        if(!selectedKey)
            throw "No Public key found"
        
        console.log({selectedKey})

        const {id: keyId, public_key, user: recepient} = selectedKey

        const encrypted_message = await getEncryptedMessage(message, public_key)
        
		// example create data
		const data = {
			sender,
			recepient,
			encrypted_message,
			public_key: keyId,
		};

        console.log({data})

		const record = await pb.collection('messages').create(data);
	};

    let publicKeys: RecordModel[] = $state([])
    const fetchPublicKeys = async () => {
        const records: RecordModel[] = await pb.collection('user_public_keys').getFullList()

        publicKeys = records ?? []
        console.log({records})
    }

    // ---------------------------------------------------------------------------------------

    let messages: RecordModel[] = $state([])

    let decryptMessageId = $state("") 

    let decryptedMessage = $state("")
    
    const fetchMessages = async () => {
        const records: RecordModel[] = await pb.collection('messages').getFullList()

        messages = records ?? []
    }

    const decryptMessage = async () => {
        const user = pb.authStore.record?.email
        const privateKey = localStorage.getItem('privatekey_' + user)
        if(!privateKey)
            throw "No Private Key"

        const foundMessage = messages.find((m) => m.id = decryptMessageId)
        if(!foundMessage)
            throw "No Message found"

        const decrypted_result = await getDecryptedMessage(foundMessage.encrypted_message,  privateKey, 'replaceMeWithUserInput')

        decryptedMessage= decrypted_result.decrypted_message
    }
</script>

<h1>Sandbox</h1>
<Button onclick={helloWorld}>console.log</Button>
<Button onclick={getData}>Fetch data</Button>
<Button onclick={generateKeys}>Generate keys</Button>
<h2>Authentication</h2>
<h3>Otp step 1</h3>
<Input bind:value={email} />
<Button onclick={initiateOtp}>Get OTP</Button>
<h3>Otp step 2</h3>
<Input bind:value={verification_code} />
<Button onclick={verifyOtp}>Verify OTP for id ({otpId})</Button>
<h2>Save pgp key</h2>
<Button disabled={!pb.authStore.record?.email} onclick={savePgpKey}
	>Create and save pgp key for {pb.authStore.record?.email}</Button
>

<h2>Send Encrypted Message</h2>
<Button onclick={fetchPublicKeys}>Get Public Keys</Button>
Message: <Input bind:value={message} />
Key Id: <Input bind:value={recipientPublicKeyId} />
<pre>{JSON.stringify(publicKeys, null, 2)}</pre>
<Button onclick={saveEncryptedMessage}>Save Encrypted Message</Button>



<h2>Decrypted Message</h2>
<Button onclick={fetchMessages}>Fetch Messages</Button>
<pre>{JSON.stringify(messages, null, 2)}</pre>
Message Id: <Input bind:value={decryptMessageId} />

<pre>{JSON.stringify(decryptedMessage, null, 2)}</pre>
<Button onclick={decryptMessage}>Decrypt Message</Button>

<pre>{JSON.stringify(keys, null, 2)}</pre>

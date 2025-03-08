import { getMessage } from '$lib/vendor/pocketbase/message';
import type { PageLoad } from './$types';

export const load = (async ({ params }) => {
	const message = await getMessage(params.messageId);
	return {
		messageId: params.messageId,
		message
	};
}) satisfies PageLoad;

export const prerender = 'auto';

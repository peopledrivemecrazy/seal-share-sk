import type { PageLoad } from './$types';
import { getUsers } from '$lib/vendor/pocketbase/user';

export const load = (async () => {
	const users = await getUsers();
	return {
		users
	};
}) satisfies PageLoad;

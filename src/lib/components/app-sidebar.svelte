<script lang="ts">
	import Calendar from 'lucide-svelte/icons/calendar';
	import Logout from 'lucide-svelte/icons/log-out';
	import House from 'lucide-svelte/icons/house';
	import Inbox from 'lucide-svelte/icons/inbox';
	import Search from 'lucide-svelte/icons/search';
	import Settings from 'lucide-svelte/icons/settings';
	import * as Sidebar from '$lib/components/ui/sidebar/index.js';
	import Button from './ui/button/button.svelte';
	import { logout } from '$lib/vendor/pocketbase/user';
	import { goto } from '$app/navigation';
	import pb from '$lib/vendor/pocketbase';

	// Menu items.
	const items = [
		{
			title: 'Home',
			url: '/',
			icon: House
		},
		{
			title: 'Inbox',
			url: '/inbox',
			icon: Inbox
		},
		{
			title: 'Send Message',
			url: '/send_message',
			icon: Settings
		}
	];
</script>

<Sidebar.Root>
	<Sidebar.Content>
		<Sidebar.Group>
			<Sidebar.GroupLabel>SealShare</Sidebar.GroupLabel>
			<Sidebar.GroupContent>
				<Sidebar.Menu>
					{#each items as item (item.title)}
						<Sidebar.MenuItem>
							<Sidebar.MenuButton>
								{#snippet child({ props })}
									<a href={item.url} {...props}>
										<item.icon />
										<span>{item.title}</span>
									</a>
								{/snippet}
							</Sidebar.MenuButton>
						</Sidebar.MenuItem>
					{/each}
				</Sidebar.Menu>
			</Sidebar.GroupContent>
		</Sidebar.Group>
	</Sidebar.Content>
	<Sidebar.Footer>
		<Sidebar.Group>
			<Sidebar.GroupContent>
				<Sidebar.Menu>
					{#if pb.authStore.record}
						<Sidebar.MenuItem>
							<Sidebar.MenuButton>
								{#snippet child()}
									<div class="flex items-center justify-between">
										<span>{pb.authStore.record!.email}</span>
										<Button
											variant="destructive"
											onclick={() => {
												logout();
												goto('/login');
											}}
										>
											<Logout size={16} />
										</Button>
									</div>
								{/snippet}
							</Sidebar.MenuButton>
						</Sidebar.MenuItem>
					{/if}
				</Sidebar.Menu>
			</Sidebar.GroupContent>
		</Sidebar.Group>
	</Sidebar.Footer>
</Sidebar.Root>

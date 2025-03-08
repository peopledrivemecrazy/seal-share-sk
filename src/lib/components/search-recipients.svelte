<script lang="ts">
	import Check from 'lucide-svelte/icons/check';
	import ChevronsUpDown from 'lucide-svelte/icons/chevrons-up-down';
	import { tick } from 'svelte';
	import * as Command from '$lib/components/ui/command/index.js';
	import * as Popover from '$lib/components/ui/popover/index.js';
	import { Button } from '$lib/components/ui/button/index.js';
	import { cn } from '$lib/utils.js';
	import type { RecordModel } from 'pocketbase';

	let {
		placeholder = 'Search recipients...',
		fallback = 'No recipients found',
		users,
		value = $bindable('')
	}: {
		placeholder?: string;
		fallback?: string;
		users: RecordModel[];
		value?: string;
	} = $props();

	let open = $state(false);
	let name = $state('');
	let triggerRef = $state<HTMLButtonElement>(null!);

	const selectedValue = $derived(users.find((f) => f.name === name)?.name);

	// We want to refocus the trigger button when the user selects
	// an item from the list so users can continue navigating the
	// rest of the form with the keyboard.
	function closeAndFocusTrigger() {
		open = false;
		tick().then(() => {
			triggerRef.focus();
		});
	}
</script>

<Popover.Root bind:open>
	<Popover.Trigger bind:ref={triggerRef}>
		{#snippet child({ props })}
			<Button
				variant="outline"
				class="w-full justify-between"
				{...props}
				role="combobox"
				aria-expanded={open}
			>
				{selectedValue || placeholder}
				<ChevronsUpDown class="ml-2 size-4 shrink-0 opacity-50" />
			</Button>
		{/snippet}
	</Popover.Trigger>
	<Popover.Content class="w-fit p-0">
		<Command.Root>
			<Command.Input {placeholder} />
			<Command.List>
				<Command.Empty>{fallback}</Command.Empty>
				<Command.Group>
					{#each users as user}
						<Command.Item
							value={user.name}
							onSelect={() => {
								name = user.name;
								value = user.id;
								closeAndFocusTrigger();
							}}
						>
							<Check class={cn('mr-2 size-4', name !== user.name && 'text-transparent')} />
							{user.name}
						</Command.Item>
					{/each}
				</Command.Group>
			</Command.List>
		</Command.Root>
	</Popover.Content>
</Popover.Root>

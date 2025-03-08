<script lang="ts">
	import type { RecordModel } from 'pocketbase';
	import { onMount } from 'svelte';
	import { getMessages } from '$lib/vendor/pocketbase/message';
	import { writable } from "svelte/store";
	import { createTable, Render, Subscribe } from "svelte-headless-table";
	import * as Table from "$lib/components/ui/table";
	import { goto } from '$app/navigation';

	// Define the state for messages
	let messages = writable<RecordModel[]>([]);
	let tableShow = $state(false);

	// Fetch messages on component mount
	onMount(async () => {
		const data = await getMessages();
		messages.set(data); // Update messages state
		tableShow = true;
	});

	// Define the data structure of table
	const table = createTable((messages));

	const columns = table.createColumns([
		table.column({
			accessor: "sender_name",
			header: "Sender",
		}),
		table.column({
			accessor: "created",
			header: "Received",
		}),
	]);

	// Define the view model
	const { headerRows, pageRows, tableAttrs, tableBodyAttrs } =
		table.createViewModel(columns);
</script>


{#if tableShow}
<div class="rounded-md border">
	<Table.Root {...$tableAttrs}>
		<Table.Header>
			{#each $headerRows as headerRow}
				<Subscribe rowAttrs={headerRow.attrs()}>
					<Table.Row>
						{#each headerRow.cells as cell (cell.id)}
							<Subscribe attrs={cell.attrs()} let:attrs props={cell.props()}>
								<Table.Head {...attrs}>
									<Render of={cell.render()} />
								</Table.Head>
							</Subscribe>
						{/each}
					</Table.Row>
				</Subscribe>
			{/each}
		</Table.Header>
		<Table.Body {...$tableBodyAttrs}>
			{#if $pageRows.length > 0}
				{#each $pageRows as row (row.id)}
					<Subscribe rowAttrs={row.attrs()} let:rowAttrs>
							<Table.Row
								{...rowAttrs}
								class="cursor-pointer"
								on:click={() => goto(`/inbox/${row.original.id}`)}>
								{#each row.cells as cell (cell.id)}
									<Subscribe attrs={cell.attrs()} let:attrs>
										<Table.Cell {...attrs}>
											<Render of={cell.render()} />
										</Table.Cell>
									</Subscribe>
								{/each}
							</Table.Row>
					</Subscribe>
				{/each}
				{:else}
				<!-- Display this row if no messages exist -->
				<Table.Row>
					<Table.Cell class="text-center text-gray-500 p-4">
						No messages found.
					</Table.Cell>
				</Table.Row>
				{/if}
		</Table.Body>
	</Table.Root>
</div>
{/if}
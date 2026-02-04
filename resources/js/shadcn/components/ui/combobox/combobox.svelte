<script lang="ts">
    import { Input } from "../input/index.js";
    import * as Popover from "$shadcn/components/ui/popover/index";
    import { cn } from "$shadcn/utils.js";

    type ComboboxItem = {
        value: string;
        label: string;
    };

    let {
        items = [],
        value = $bindable(''),
        placeholder = 'Search...',
        emptyMessage = 'No results found.',
        class: className = '',
        onSelect = undefined,
    }: {
        items: ComboboxItem[];
        value?: string;
        placeholder?: string;
        emptyMessage?: string;
        class?: string;
        onSelect?: (value: string) => void;
    } = $props();

    let open = $state(false);
    let searchQuery = $state('');

    // Filter items based on search query
    const filteredItems = $derived(
        items.filter((item) =>
            item.label.toLowerCase().includes(searchQuery.toLowerCase())
        )
    );

    // Get selected item label
    const selectedLabel = $derived(
        items.find((item) => item.value === value)?.label || ''
    );

    function selectItem(itemValue: string) {
        value = itemValue;
        open = false;
        searchQuery = '';
        if (onSelect) {
            onSelect(itemValue);
        }
    }

    function handleOpenChange(newOpen: boolean) {
        open = newOpen;
        if (!newOpen) {
            searchQuery = '';
        }
    }
</script>

<Popover.Root bind:open onOpenChange={handleOpenChange}>
    <Popover.Trigger
        role="combobox"
        aria-expanded={open}
        class={cn(
            "flex h-10 w-full items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",
            className
        )}
    >
        <span class="truncate">{selectedLabel || placeholder}</span>
        <svg
            xmlns="http://www.w3.org/2000/svg"
            class="ml-2 h-4 w-4 shrink-0 opacity-50"
            viewBox="0 0 20 20"
            fill="currentColor"
        >
            <path
                fill-rule="evenodd"
                d="M10 3a1 1 0 01.707.293l3 3a1 1 0 01-1.414 1.414L10 5.414 7.707 7.707a1 1 0 01-1.414-1.414l3-3A1 1 0 0110 3zm-3.707 9.293a1 1 0 011.414 0L10 14.586l2.293-2.293a1 1 0 011.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z"
                clip-rule="evenodd"
            />
        </svg>
    </Popover.Trigger>
    <Popover.Content class="w-(--bits-popover-trigger-width) p-0" align="start">
        <div class="border rounded-md bg-white shadow-md">
            <div class="p-2 border-b">
                <Input
                    bind:value={searchQuery}
                    placeholder={placeholder}
                    class="h-9"
                    autofocus
                />
            </div>
            <div class="max-h-75 overflow-y-auto p-1">
                {#if filteredItems.length === 0}
                    <div class="py-6 text-center text-sm text-muted-foreground">
                        {emptyMessage}
                    </div>
                {:else}
                    {#each filteredItems as item (item.value)}
                        <button
                            type="button"
                            class={cn(
                                "relative flex w-full cursor-pointer select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none hover:bg-accent hover:text-accent-foreground",
                                value === item.value && "bg-accent text-accent-foreground"
                            )}
                            onclick={() => selectItem(item.value)}
                        >
                            <span class="flex-1 text-left">{item.label}</span>
                            {#if value === item.value}
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    class="h-4 w-4"
                                    viewBox="0 0 20 20"
                                    fill="currentColor"
                                >
                                    <path
                                        fill-rule="evenodd"
                                        d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                                        clip-rule="evenodd"
                                    />
                                </svg>
                            {/if}
                        </button>
                    {/each}
                {/if}
            </div>
        </div>
    </Popover.Content>
</Popover.Root>

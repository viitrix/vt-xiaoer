<script lang="ts">
	import { LoaderCircle } from 'lucide-svelte';
	import Trash_2 from 'lucide-svelte/icons/trash-2';
	import { toast } from 'svelte-sonner';

	import LL from '$i18n/i18n-svelte';
	import Badge from '$lib/components/Badge.svelte';
	import Button from '$lib/components/Button.svelte';
	import FieldCheckbox from '$lib/components/FieldCheckbox.svelte';
	import FieldHelp from '$lib/components/FieldHelp.svelte';
	import FieldInput from '$lib/components/FieldInput.svelte';
	import Fieldset from '$lib/components/Fieldset.svelte';
	import P from '$lib/components/P.svelte';
	import { devicesStore } from '$lib/localStorage';
    import type { Device } from '$lib/devices'

	interface Props {
		index: number;
	}

	let { index }: Props = $props();
	let server: Device = $state($devicesStore[index]);
	let isLoading = $state(false);

	$effect(() => {
        console.log(">>>>>>>>>>>>>>>>>");
        devicesStore.update((servers) => {
			servers.splice(index, 1, server);
			return servers;
		});
	});

	async function verifyServer() {
		isLoading = true;
		const toastId = toast.loading($LL.connecting());

		toast.success($LL.connectionIsVerified(), { id: toastId });
		isLoading = false;
	}

	function deleteServer() {
		devicesStore.update((servers) => servers.filter((s) => s.id !== server.id));
	}
</script>

<div data-testid="server">
	<Fieldset>
        <Badge>{server.label ? server.label : server.deviceType?.toUpperCase()}</Badge>

		<Fieldset>
			<nav class="flex items-stretch gap-x-2">
				<Button
					class="max-h-full"
					variant="outline"
					on:click={deleteServer}
					aria-label={$LL.deleteServer()}
				>
					<Trash_2 class="base-icon" />
				</Button>

				<Button
					disabled={isLoading}
					variant={!server.isVerified ? 'default' : 'outline'}
					on:click={verifyServer}
				>
					{#if isLoading}
						<LoaderCircle class="base-icon animate-spin" />
					{:else}
						{server.isVerified ? $LL.reVerify() : $LL.verify()}
					{/if}
				</Button>
			</nav>

			<div class="flex flex-col gap-2 sm:grid sm:grid-cols-2">
				<FieldInput
					name={`label-${server.id}`}
					label={$LL.label()}
					bind:value={server.label}
					placeholder="my-llama-server"
				>
					<svelte:fragment slot="help">
						<FieldHelp>
							<P>{$LL.connectionLabelHelp()}</P>
						</FieldHelp>
					</svelte:fragment>
				</FieldInput>
			</div>
		</Fieldset>
	</Fieldset>
</div>

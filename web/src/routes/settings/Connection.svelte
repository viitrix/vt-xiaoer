<script lang="ts">
	import { LoaderCircle } from 'lucide-svelte';
	import Trash_2 from 'lucide-svelte/icons/trash-2';
	import { toast } from 'svelte-sonner';

	import LL from '$i18n/i18n-svelte';
	import Badge from '$lib/components/Badge.svelte';
	import Button from '$lib/components/Button.svelte';
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
	let device : Device = $state($devicesStore[index]);
	let isLoading = $state(false);

	$effect(() => {
        devicesStore.update((devices) => {
			devices.splice(index, 1, device);
			return devices;
		});
	});

	async function verifyDevice() {
		isLoading = true;
		const toastId = toast.loading($LL.connecting());
		toast.success($LL.connectionIsVerified(), { id: toastId });
		isLoading = false;
	}

	function deleteDevice() {
		devicesStore.update((devices) => devices.filter((s) => s.id !== device.id));
	}
</script>

<div>
	<Fieldset>
		{#snippet legend()}
        <Badge>{device.deviceType}</Badge>
		{/snippet}
		<Fieldset>
			<div class="flex flex-col gap-2 sm:grid sm:grid-cols-2">	
				<FieldInput
					name={`label-${device.id}`}
					label={$LL.deviceId()}
					bind:value={device.deviceId}
					placeholder={device.deviceId}
				>
					<svelte:fragment slot="help">
						<FieldHelp>
							<P>{$LL.deviceIdHelp()}</P>
						</FieldHelp>
					</svelte:fragment>
				</FieldInput>
				<FieldInput
					name={`label-${device.id}`}
					label={$LL.deviceApiKey()}
					bind:value={device.apiKey}
					placeholder={device.apiKey}
				>
					<svelte:fragment slot="help">
						<FieldHelp>
							<P>{$LL.deviceApiKeyHelp()}</P>
						</FieldHelp>
					</svelte:fragment>
				</FieldInput>
			</div>
			<nav class="flex items-stretch gap-x-2">
				<Button
					class="max-h-full"
					variant="outline"
					on:click={deleteDevice}
					aria-label={$LL.deleteServer()}
				>
					<Trash_2 class="base-icon" />
				</Button>

				<Button
					disabled={isLoading}
					variant={!device.isVerified ? 'default' : 'outline'}
					on:click={verifyDevice}
				>
					{#if isLoading}
						<LoaderCircle class="base-icon animate-spin" />
					{:else}
						{device.isVerified ? $LL.reVerify() : $LL.verify()}
					{/if}
				</Button>
			</nav>
		</Fieldset>
	</Fieldset>
</div>

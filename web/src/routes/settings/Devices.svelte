<script lang="ts">
	import LL from '$i18n/i18n-svelte';
	import Button from '$lib/components/Button.svelte';
	import EmptyMessage from '$lib/components/EmptyMessage.svelte';
	import FieldSelect from '$lib/components/FieldSelect.svelte';
	import Fieldset from '$lib/components/Fieldset.svelte';
	import P from '$lib/components/P.svelte';
	import { DeviceType, getDefaultDevice } from '$lib/devices';
	import { devicesStore } from '$lib/localStorage';
    //import Connection from './Connection.svelte';
    
    let newDeviceType: DeviceType | undefined = $state();

	function addDevice() {
		if (!newDeviceType) return;
		const server = getDefaultDevice(newDeviceType);
		devicesStore.update((servers) => [...servers, server]);
		newDeviceType = undefined;
	}
</script>

<Fieldset>
	<P>
		<strong>{$LL.devices()}</strong>
	</P>

	<div class="devices">
		<div class="devices__add">
			{#key newDeviceType}
				<FieldSelect
					name="deviceType"
					isLabelVisible={false}
					label={$LL.connectionType()}
					placeholder={$LL.connectionType()}
					options={[
						{ value: DeviceType.VTCamera, label: "ZN04摄像头"  },
						{ value: DeviceType.VTSpeaker, label: "ESP32音箱" },
					]}
					bind:value={newDeviceType}
				/>
			{/key}
			<Button disabled={!newDeviceType} on:click={addDevice}>
				{$LL.addConnection()}
			</Button>
		</div>
	</div>
    
    <!--
	<div class="servers">
		{#if !$devicesStore.length}
			<div
				class="col-span-full -mt-3 flex text-balance rounded-md border border-shade-3 text-center"
			>
				<EmptyMessage>{$LL.noServerConnections()}</EmptyMessage>
			</div>
		{/if}

		{#each $devicesStore as server, index (server.id)}
			<Connection {index} />
		{/each}
	</div>
    -->
</Fieldset>

<style lang="postcss">
	.devices {
		@apply mb-4 flex flex-col gap-y-2;
	}

	.devices__add {
		@apply grid grid-cols-[auto_max-content] gap-2;
	}

	.servers {
		@apply flex flex-col gap-y-4;
	}
</style>

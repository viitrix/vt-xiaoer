<script lang="ts">
	import LL from '$i18n/i18n-svelte';
	import { devicesStore, settingsStore } from '$lib/localStorage';
	import { type Role } from '$lib/devices';
	import FieldSelect from './FieldSelect.svelte';

	interface Props {
		isLabelVisible?: boolean;
		value?: string;
	}

	let { value = $bindable() }: Props = $props();

	const disabled = $derived(!$settingsStore.roles?.length);
	const models = $derived($settingsStore.roles?.map(formatModelToSelectOption));

	type RoleOption = {
		value: string;
		label: string;
		badge?: string | string[];
	};

	function formatModelToSelectOption(role: Role): RoleOption {
		const badges: string[] = [];
		const modelServer = $devicesStore.find((s) => s.id === role.serverId);
		badges.push(modelServer?.deviceId || modelServer?.deviceType || '');
		return { value: role.name, label: role.name, badge: badges };
	}

	// Auto-select model when there is only one available
	$effect(() => {
		if (!value && models?.length === 1) value = models[0].value;
	});
</script>

<FieldSelect
	name="model"
	{disabled}
	placeholder={$LL.availableModels()}
	label={$LL.availableRoles()}
	isLabelVisible={true}
	options={models}
	bind:value
/>

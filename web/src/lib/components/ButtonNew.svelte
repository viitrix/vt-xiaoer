<script lang="ts">
	import { onMount } from 'svelte';

	import LL from '$i18n/i18n-svelte';
	import { generateRandomId } from '$lib/utils';
	import Button from './Button.svelte';

	let newId = $state('');
	let href = $state('');

	export function generateNewUrl(id?: string): string {
		return `/sessions/${id ? id : generateRandomId()}`;
	}	

	function setId() {
		newId = generateRandomId();
		href = generateNewUrl(newId);
	}

	onMount(setId);
</script>

<div class="flex gap-x-2">
	<Button
		class="w-full"
		variant="outline"
		{href}
		onclick={setId}
	>
		{$LL.newSession()}
	</Button>
</div>

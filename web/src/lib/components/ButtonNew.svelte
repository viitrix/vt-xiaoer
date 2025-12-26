<script lang="ts">
	import { onMount } from 'svelte';

	import LL from '$i18n/i18n-svelte';
	import { Sitemap } from '$lib/sitemap';
	import { generateRandomId } from '$lib/utils';

	import Button from './Button.svelte';

	interface Props {
		sitemap: Sitemap;
	}

	let { sitemap }: Props = $props();
	let newId = $state('');
	let href = $state('');

	function generateNewUrl(sitemap: Sitemap, id?: string): string {
		return `/${sitemap}/${id ? id : generateRandomId()}`;
	}

	function setId() {
		newId = generateRandomId();
		href = generateNewUrl(sitemap, newId);
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
		{sitemap === Sitemap.SESSIONS ? $LL.newSession() : $LL.newAgent()}
	</Button>
</div>

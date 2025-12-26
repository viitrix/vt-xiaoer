<script lang="ts">
	import LL from '$i18n/i18n-svelte';
	import EmptyMessage from '$lib/components/EmptyMessage.svelte';
	import Head from '$lib/components/Head.svelte';
</script>

<Head title={$LL.agents()} />
<EmptyMessage>{$LL.noAgentChosen()}</EmptyMessage>

<script lang="ts">
	import { onMount, tick } from 'svelte';
	import { toast } from 'svelte-sonner';

	import LL from '$i18n/i18n-svelte';
	import { beforeNavigate } from '$app/navigation';
	import Button from '$lib/components/Button.svelte';
	import ButtonCopy from '$lib/components/ButtonCopy.svelte';
	import ButtonDelete from '$lib/components/ButtonDelete.svelte';
	import Head from '$lib/components/Head.svelte';
	import Header from '$lib/components/Header.svelte';
	import Metadata from '$lib/components/Metadata.svelte';
	import { devicesStore, settingsStore } from '$lib/localStorage';
	import type { PageData } from './$types';

	interface Props {
		data: PageData;
	}

	let { data }: Props = $props();

	
	$effect(() => {
		//if (data.id !== session.id) handleSessionChange();
	});

	$effect(() => {
		//session.model = $settingsStore.models.find((m) => m.name === modelName);
	});

	$effect(() => {
		/*
		if (editor.shouldFocusTextarea && editor.promptTextarea) {
			editor.promptTextarea.focus();
			editor.shouldFocusTextarea = false;
		}
		*/
	});

	onMount(async () => {
		/*
		handleSessionChange();
		await scrollToBottom();
		messagesWindow?.addEventListener('scroll', handleScroll);
		*/
	});

	beforeNavigate((navigation) => {
		/*
		if (editor.isCompletionInProgress) {
			const userConfirmed = confirm($LL.areYouSureYouWantToLeave());
			if (userConfirmed) {
				stopCompletion();
				return;
			}
			navigation.cancel();
			return;
		}

		// Only show confirmation when navigating outside of /sessions/ path
		if (
			editor.prompt &&
			editor.prompt.trim() !== '' &&
			!navigation.to?.url.pathname.startsWith('/sessions/')
		) {
			const userConfirmed = confirm($LL.unsavedChangesWillBeLost());
			if (!userConfirmed) {
				navigation.cancel();
			}
		}
		*/
	});

</script>

<div class="session">
	<Head title={[$LL.newSession(), $LL.sessions()]}/>
	
</div>

<style lang="postcss">
	.session {
		@apply flex h-full w-full flex-col overflow-hidden;
	}

	.session__history {
		@apply base-fieldset-container overflow-scrollbar flex-grow;
	}
</style>

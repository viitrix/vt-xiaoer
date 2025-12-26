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
	import { Sitemap } from '$lib/sitemap';
	import { devicesStore, settingsStore } from '$lib/localStorage';
	import type { PageData } from './$types';
	import {
		formatSessionMetadata,
		getSessionTitle,
		loadSession,
		saveSession,
		type Editor,
		type Message
	} from '$lib/sessions';

	import Messages from './Messages.svelte';
	import Prompt from './Prompt.svelte';

	interface Props {
		data: PageData;
	}

	let { data }: Props = $props();

	let session = $state(loadSession(data.id));
	
	let editor = $state<Editor>({
		prompt: '',
		messageIndexToEdit: null,
		isCodeEditor: false,
		isCompletionInProgress: false,
		shouldFocusTextarea: false,
		isNewSession: true
	});
	let messagesWindow: HTMLDivElement | undefined = $state();
	let roleName: string | undefined = $state();
	let userScrolledUp = $state(false);
	let shouldConfirmDeletion = $state(false);

	$effect(() => {
		if (data.id !== session.id) handleSessionChange();
	});

	$effect(() => {
		if (roleName) {
			const rid = roleName.split(' ')[1];
			session.role = $settingsStore.roles.find((m) => m.roleId === rid);
		}
	});

	$effect(() => {
		if (editor.shouldFocusTextarea && editor.promptTextarea) {
			editor.promptTextarea.focus();
			editor.shouldFocusTextarea = false;
		}
	});

	onMount(async () => {
		handleSessionChange();
		await scrollToBottom();
		messagesWindow?.addEventListener('scroll', handleScroll);
	});

	beforeNavigate((navigation) => {
		if (editor.isCompletionInProgress) {
			const userConfirmed = confirm($LL.areYouSureYouWantToLeave());
			if (userConfirmed) {
				// TODO 
				//stopCompletion();
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
	});

	function handleScroll() {
		if (!messagesWindow) return;
		const { scrollTop, scrollHeight, clientHeight } = messagesWindow;
		userScrolledUp = scrollTop + clientHeight < scrollHeight;
	}

	async function handleSessionChange() {
		session = loadSession(data.id);
		roleName = session.role?.name || '';
		editor.isNewSession = !session?.messages?.length;
		scrollToBottom();
	}
	
	async function scrollToBottom(shouldForceScroll = false) {
		if (!shouldForceScroll && (!messagesWindow || userScrolledUp)) return;
		await tick();
		requestAnimationFrame(() => {
			if (messagesWindow) messagesWindow.scrollTop = messagesWindow.scrollHeight;
		});
	}

	function handleSubmit(images?: { data: string; filename: string }[]) {
	}
	function stopCompletion() {
	}

</script>

<div class="session">
	<Head
		title={[editor.isNewSession ? $LL.newSession() : getSessionTitle(session), $LL.sessions()]}
	/>

	<Header confirmDeletion={shouldConfirmDeletion}>
		{#snippet headline()}
			<p data-testid="session-id" class="font-bold leading-none">
				{$LL.session()}
				<Button variant="link" href={`/sessions/${session.id}`}>#{session.id}</Button>
			</p>
			<Metadata dataTestid="session-metadata">
				{editor.isNewSession ? $LL.newSession() : formatSessionMetadata(session)}
			</Metadata>
		{/snippet}

		{#snippet nav()}
			{#if !editor.isNewSession}
				{#if !shouldConfirmDeletion}
					<ButtonCopy content={JSON.stringify(session.messages, null, 2)} />
				{/if}
				<ButtonDelete sitemap={Sitemap.SESSIONS} id={session.id} bind:shouldConfirmDeletion />
			{/if}
		{/snippet}
	</Header>
	<div class="session__history" bind:this={messagesWindow}>
		<Messages bind:session bind:editor />
	</div>
	<Prompt
		bind:session
		bind:editor
		bind:roleName
		{handleSubmit}
		{stopCompletion}
		{scrollToBottom}
	/>
	
</div>

<style lang="postcss">
	.session {
		@apply flex h-full w-full flex-col overflow-hidden;
	}

	.session__history {
		@apply base-fieldset-container overflow-scrollbar flex-grow;
	}
</style>

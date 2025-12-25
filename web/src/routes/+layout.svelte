<script lang="ts">
	import { onMount, type Snippet } from 'svelte';
	import { toast, Toaster } from 'svelte-sonner';
	import { detectLocale, navigatorDetector } from 'typesafe-i18n/detectors';

	import LL, { setLocale } from '$i18n/i18n-svelte';
	import { loadLocale } from '$i18n/i18n-util.sync';

	import '../app.pcss';

	import type { Locales } from '$i18n/i18n-types';
	import { env } from '$env/dynamic/public';
	import { browser } from '$app/environment';
	import { onNavigate } from '$app/navigation';
	import CollapsibleSidebar from '$lib/components/CollapsibleSidebar.svelte';
	import SidebarToggle from '$lib/components/SidebarToggle.svelte';
	import { settingsStore } from '$lib/localStorage';

	let { children }: { children: Snippet } = $props();

	onNavigate(async (navigation) => {
		// Auto-collapse sidebar on mobile when navigating (except for exact /sessions and /knowledge)
		if (browser && window.innerWidth < 1024) {
			const pathname = navigation.to?.url.pathname;
			if (pathname && pathname !== '/sessions' && pathname !== '/knowledge') {
				$settingsStore.sidebarExpanded = false;
			}
		}
	});

	$effect(() => {
		if (!$settingsStore.userLanguage) return;
		loadLocale($settingsStore.userLanguage);
		setLocale($settingsStore.userLanguage);
	});

	$effect(() =>
		document.documentElement.setAttribute('data-color-theme', $settingsStore.userTheme)
	);

	onMount(() => {
		// Language
		if (!$settingsStore.userLanguage)
			$settingsStore.userLanguage = detectLocale(
				'en',
				['en', 'zh-cn'],
				navigatorDetector
			) as Locales;

		loadLocale($settingsStore.userLanguage);
		setLocale($settingsStore.userLanguage);

		// Migrate old server settings to new format
		// TODO 当网页更新的时候，合并之前的设置

		// Color theme
		if (browser && !$settingsStore.userTheme) {
			$settingsStore.userTheme = window.matchMedia('(prefers-color-scheme: dark)').matches
				? 'dark'
				: 'light';
		}
	});
</script>

<svelte:head>
	{#if env.PUBLIC_PLAUSIBLE_DOMAIN}
		<script
			defer
			data-domain={env.PUBLIC_PLAUSIBLE_DOMAIN}
			data-api={env.PUBLIC_PLAUSIBLE_API}
			src={env.PUBLIC_PLAUSIBLE_SRC}
		></script>
	{/if}
</svelte:head>

<Toaster
	toastOptions={{
		unstyled: true,
		classes: {
			toast:
				'shadow-xl px-4 py-3 flex items-center gap-x-3 max-w-full w-full rounded mx-auto text-xs mx-0',
			loading: 'bg-shade-0',
			error: 'text-red-50 bg-red-700',
			success: 'text-emerald-50 bg-emerald-700',
			warning: 'text-yellow-50 bg-yellow-700',
			info: 'bg-shade-1 text-neutral-500'
		}
	}}
	position="top-center"
/>

<div class="relative flex h-dvh w-screen bg-shade-2 lg:p-4">
	<CollapsibleSidebar />
	<div class="relative flex-1">
		<SidebarToggle />
		{@render children()}
	</div>
</div>

<style lang="postcss">
	:global(html) {
		@apply fixed bg-shade-0 text-base tracking-normal;
		@apply text-base lg:bg-shade-2;
	}
</style>

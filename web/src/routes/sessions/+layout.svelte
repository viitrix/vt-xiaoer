<script lang="ts">
	import { type Snippet } from 'svelte';

	import { browser } from '$app/environment';
	import RobotsNoIndex from '$lib/components/RobotsNoIndex.svelte';
	import { devicesStore, settingsStore } from '$lib/localStorage';
	import { type Role } from '$lib/devices';

	let { children }: { children: Snippet } = $props();

	async function listRoles(): Promise<Role[]> {
		const roles: Role[] = [];
		let r : Role = {
			name: '沙县小吃店小二',
			id: "32324ACD3422"
		}
		roles.push(r)
		return roles;
	}

	$effect(() => {
		if (browser) {
			listRoles().then((roles) => {
				$settingsStore.roles = roles;
			});
		}
	});
</script>

<RobotsNoIndex />

<div class="flex h-full w-full">
	<main class="flex min-w-0 flex-1 flex-col bg-shade-1 lg:rounded-xl lg:border">
		<div class="flex-1 overflow-auto">
			{@render children()}
		</div>
	</main>
</div>

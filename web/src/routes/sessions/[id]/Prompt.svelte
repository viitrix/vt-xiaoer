<script lang="ts">
	import { CircleStop, Image, LoaderCircle, UnfoldVertical } from 'lucide-svelte';
	import Trash_2 from 'lucide-svelte/icons/trash-2';
	import { toast } from 'svelte-sonner';

	import LL from '$i18n/i18n-svelte';
	import Button from '$lib/components/Button.svelte';
	import ButtonSubmit from '$lib/components/ButtonSubmit.svelte';
	import Field from '$lib/components/Field.svelte';
	import FieldSelectRole from '$lib/components/FieldSelectRole.svelte';
	import FieldTextEditor from '$lib/components/FieldTextEditor.svelte';
	import { devicesStore } from '$lib/localStorage';
	import type { Editor, Message, Session } from '$lib/sessions';
	import { generateRandomId } from '$lib/utils';

	import AttachmentImage from './AttachmentImage.svelte';
	type ImageAttachment = {
		id: string;
		name: string;
		dataUrl: string;
	};

	interface Props {
		editor: Editor;
		session: Session;
		roleName: string | undefined;
		handleSubmit: (images?: { data: string; filename: string }[]) => void;
		stopCompletion: () => void;
		scrollToBottom: (shouldForceScroll: boolean) => void;
	}

	let {
		editor = $bindable(),
		session = $bindable(),
		roleName = $bindable(),
		handleSubmit,
		stopCompletion,
		scrollToBottom
	}: Props = $props();

	let attachments: ImageAttachment[] = $state([]);


	$effect(() => {
		if (attachments.length) scrollToBottom(true);
	});

	$effect(() => {
		if (editor.messageIndexToEdit !== null && editor.attachments) {
			attachments = [...editor.attachments];
		}
	});

	function toggleCodeEditor() {
		editor.isCodeEditor = !editor.isCodeEditor;
		editor.shouldFocusTextarea = !editor.isCodeEditor;
	}

	function handleKeyDown(event: KeyboardEvent) {
		if (event.shiftKey) return;
		if (event.key !== 'Enter') return;
		event.preventDefault();
		submit();
	}

	function handlePaste(event: ClipboardEvent) {
		const clipboardData = event.clipboardData;
		if (!clipboardData) return;

		const items = Array.from(clipboardData.items);
		const imageItems = items.filter((item) => item.type.startsWith('image/'));

		if (imageItems.length === 0) return;

		// Prevent default paste behavior when images are detected
		event.preventDefault();

		const allowedTypes = ['image/png', 'image/jpeg'];
		const newAttachments: ImageAttachment[] = [];
		let unsupportedFiles = false;

		const imagePromises = imageItems.map((item, index) => {
			return new Promise<void>((resolve) => {
				if (!allowedTypes.includes(item.type)) {
					unsupportedFiles = true;
					resolve();
					return;
				}

				const file = item.getAsFile();
				if (!file) {
					resolve();
					return;
				}

				const reader = new FileReader();
				reader.onload = (event) => {
					const dataUrl = event.target?.result as string;
					if (dataUrl) {
						// Generate a filename based on timestamp and index
						const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
						const extension = item.type === 'image/png' ? 'png' : 'jpg';
						const filename = `pasted-image-${timestamp}-${index + 1}.${extension}`;

						newAttachments.push({
							id: generateRandomId(),
							name: filename,
							dataUrl
						});
					}
					resolve();
				};
				reader.onerror = () => {
					console.error('Error reading pasted image');
					resolve();
				};
				reader.readAsDataURL(file);
			});
		});

		Promise.all(imagePromises).then(() => {
			if (unsupportedFiles) {
				toast.warning('Some images were ignored. Only PNG and JPEG images are supported.');
			}
			if (newAttachments.length > 0) {
				attachments = [...attachments, ...newAttachments];
			}
		});
	}

	function handleImageUploadClick() {
		const input = document.createElement('input');
		input.type = 'file';
		input.accept = '.png,.jpg,.jpeg,image/png,image/jpeg';
		input.multiple = true;
		input.onchange = (e) => {
			const files = (e.target as HTMLInputElement).files;
			if (!files || files.length === 0) return;

			const allowedTypes = ['image/png', 'image/jpeg'];
			const newAttachments: ImageAttachment[] = [];
			let unsupportedFiles = false;

			const filePromises = Array.from(files).map((file) => {
				return new Promise<void>((resolve) => {
					if (!allowedTypes.includes(file.type)) {
						unsupportedFiles = true;
						resolve();
						return;
					}

					const reader = new FileReader();
					reader.onload = (event) => {
						const dataUrl = event.target?.result as string;
						if (dataUrl) {
							newAttachments.push({
								type: 'image',
								id: generateRandomId(),
								name: file.name,
								dataUrl
							});
						}
						resolve();
					};
					reader.onerror = () => {
						console.error('Error reading file:', file.name);
						resolve();
					};
					reader.readAsDataURL(file);
				});
			});

			Promise.all(filePromises).then(() => {
				if (unsupportedFiles) {
					toast.warning('Some files were ignored. Only PNG and JPEG images are supported.');
				}
				if (newAttachments.length > 0) {
					attachments = [...attachments, ...newAttachments];
				}
			});
		};
		input.click();
	}

	function handleDeleteAttachment(id: string) {
		attachments = [
			...attachments.filter((a) => a.id !== id)
		];
	}

	function submit() {
		const imageAttachments = attachments.filter((a): a is ImageAttachment => a.type === 'image');
		const imagesPayload = imageAttachments.map((a) => ({
			filename: a.name,
			data: a.dataUrl.replace(/^data:image\/[a-zA-Z]+;base64,/, '')
		}));

		handleSubmit(imagesPayload.length ? imagesPayload : undefined);
		attachments = [];
	}
</script>

<div class="prompt-editor {editor.isCodeEditor ? 'prompt-editor--fullscreen' : ''}">
	<div class="prompt-editor__form">
		<div class="prompt-editor__project">
			<FieldSelectRole bind:value={roleName} />
			<Button
				variant={editor.isCodeEditor ? 'default' : 'outline'}
				class="prompt-editor__toggle"
				onclick={toggleCodeEditor}
			>
				<UnfoldVertical class="base-icon" />
			</Button>
		</div>

		{#if editor.isCodeEditor}
			<FieldTextEditor label={$LL.prompt()} handleSubmit={submit} bind:value={editor.prompt} />
		{:else}
			<Field name="prompt">
				<textarea
					name="prompt"
					class="prompt-editor__textarea"
					placeholder={$LL.promptPlaceholder()}
					bind:this={editor.promptTextarea}
					bind:value={editor.prompt}
					onkeydown={handleKeyDown}
					onpaste={handlePaste}
				></textarea>
			</Field>
		{/if}

		{#if attachments.length}
			<div class="attachments">
				{#each attachments as attachment }
					<div class="attachment">
						<AttachmentImage dataUrl={attachment.dataUrl} name={attachment.name} />
						<Button
							variant="outline"
							onclick={() =>
								handleDeleteAttachment( attachment.id)}
							data-testid="attachment-delete"
						>
							<Trash_2 class="base-icon" />
						</Button>
					</div>
				{/each}
			</div>
		{/if}

		<nav class="prompt-editor__toolbar">
			<div class="attachments-toolbar">
				<Button
					variant="outline"
					onclick={handleImageUploadClick}
					data-testid="image-attachment"
					title={$LL.attachImage()}
				>
					<Image class="base-icon" />
				</Button>
			</div>

			<div class="prompt-editor__submit">
				{#if editor.messageIndexToEdit !== null}
					<Button
						class="h-full"
						variant="outline"
						onclick={() => {
							editor.prompt = '';
							editor.messageIndexToEdit = null;
							editor.isCodeEditor = false;
						}}
					>
						{$LL.cancel()}
					</Button>
				{/if}

				<ButtonSubmit
					handleSubmit={submit}
					hasMetaKey={editor.isCodeEditor}
					disabled={(!editor.prompt && !attachments.filter((a) => a.type === 'image').length) ||
						!session.role ||
						editor.isCompletionInProgress}
				>
					{$LL.run()}
				</ButtonSubmit>

				{#if editor.isCompletionInProgress}
					<Button
						class="h-full"
						title={$LL.stopCompletion()}
						variant="outline"
						onclick={stopCompletion}
					>
						<div class="prompt-editor__stop">
							<span class="prompt-editor__stop-icon">
								<CircleStop class=" base-icon" />
							</span>
							<span class="prompt-editor__loading-icon">
								<LoaderCircle class="prompt-editor__loading-icon base-icon animate-spin" />
							</span>
						</div>
					</Button>
				{/if}
			</div>
		</nav>
	</div>
</div>

<style lang="postcss">
	.prompt-editor {
		@apply sticky bottom-0 z-10 mx-auto flex w-full flex-col border-t bg-shade-1 p-3;
		@apply md:p-4;
		@apply lg:p-6;
		@apply 2xl:max-w-[80ch] 2xl:rounded-t-lg 2xl:border-l 2xl:border-r;
	}

	.prompt-editor__project {
		@apply grid grid-cols-[auto,max-content,max-content] items-end gap-x-2;
	}

	:global(.prompt-editor__toggle) {
		@apply h-full;
	}

	.prompt-editor--fullscreen {
		@apply min-h-[60dvh];
		@apply md:min-h-[75dvh];
	}

	.prompt-editor__form {
		@apply flex h-full min-h-0 flex-col gap-y-2;
	}

	.prompt-editor__textarea {
		@apply base-input max-h-48 min-h-14 resize-none scroll-p-2 px-3 py-2;
		field-sizing: content;
		font-variant-ligatures: none;
	}

	.prompt-editor__toolbar {
		@apply flex items-center justify-between gap-x-2;
	}

	.prompt-editor__stop {
		@apply relative -mx-3 -my-2 h-9 w-9;
	}

	.prompt-editor__stop:hover {
		.prompt-editor__stop-icon {
			@apply opacity-100;
		}

		.prompt-editor__loading-icon {
			@apply opacity-0;
		}
	}

	.prompt-editor__submit {
		@apply flex h-full items-center gap-x-2;
	}

	.prompt-editor__stop-icon,
	.prompt-editor__loading-icon {
		@apply absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2;
	}

	.prompt-editor__stop-icon {
		@apply opacity-0;
	}

	.prompt-editor__loading-icon {
		@apply opacity-100;
	}

	.segmented-nav {
		@apply flex h-full items-center rounded bg-shade-2 p-0.5;
	}

	.segmented-nav__button {
		@apply h-full rounded-sm text-shade-6;

		&--active {
			@apply bg-shade-0 text-neutral-50 shadow;
		}
	}

	.attachments-toolbar {
		@apply flex h-full gap-x-1;
	}

	.attachments {
		@apply overflow-scrollbar flex max-h-48 flex-col gap-y-1;
	}

	.attachment {
		@apply flex w-full justify-between;
	}

	.attachment__knowledge {
		@apply w-full;
	}
</style>

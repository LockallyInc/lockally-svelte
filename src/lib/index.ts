export { default as LockallyProvider } from './LockallyProvider.svelte';
export { default as EmailComposer } from './EmailComposer.svelte';
export { default as ContactPicker } from './ContactPicker.svelte';
export { default as TemplateSelector } from './TemplateSelector.svelte';
export { default as SignaturePicker } from './SignaturePicker.svelte';
export { default as AttachmentUpload } from './AttachmentUpload.svelte';
export { setLockally, getLockally } from './context.js';

// Re-export the core client + types for convenience.
export { LockallyClient, LockallyError, fileToAttachment } from '@lockally/ui-core';
export type {
  GetToken,
  LockallyAuth,
  Attachment,
  SendMessage,
  SendResult,
  Contact,
  Template,
  Signature,
} from '@lockally/ui-core';

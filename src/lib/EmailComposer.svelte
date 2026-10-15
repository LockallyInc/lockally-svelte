<script lang="ts">
  import type { Attachment, SendMessage, SendResult, Signature } from '@lockally/ui-core';
  import { getLockally } from './context.js';
  import TemplateSelector from './TemplateSelector.svelte';
  import SignaturePicker from './SignaturePicker.svelte';
  import AttachmentUpload from './AttachmentUpload.svelte';

  let {
    defaultFrom = '',
    defaultTo = '',
    signatures,
    onsent,
    onerror,
  }: {
    defaultFrom?: string;
    defaultTo?: string;
    signatures?: Signature[];
    onsent?: (result: SendResult) => void;
    onerror?: (error: Error) => void;
  } = $props();

  const client = getLockally();
  let from = $state(defaultFrom);
  let to = $state(defaultTo);
  let cc = $state('');
  let subject = $state('');
  let body = $state('');
  let attachments = $state<Attachment[]>([]);
  let templateId = $state<string | undefined>(undefined);
  let sending = $state(false);
  let error = $state<string | undefined>(undefined);

  function splitAddresses(value: string): string[] {
    return value.split(',').map((s) => s.trim()).filter(Boolean);
  }

  async function submit(e: Event) {
    e.preventDefault();
    sending = true;
    error = undefined;
    try {
      const message: SendMessage = {
        from,
        to: splitAddresses(to),
        ...(cc.trim() ? { cc: splitAddresses(cc) } : {}),
        ...(subject ? { subject } : {}),
        ...(templateId ? { template_id: templateId } : { html: body }),
        ...(attachments.length ? { attachments } : {}),
      };
      const result = await client.send(message);
      onsent?.(result);
      body = '';
      attachments = [];
      templateId = undefined;
    } catch (err) {
      error = (err as Error).message;
      onerror?.(err as Error);
    } finally {
      sending = false;
    }
  }
</script>

<form data-lockally="email-composer" onsubmit={submit}>
  <input aria-label="From" placeholder="From" bind:value={from} />
  <input aria-label="To" placeholder="To (comma-separated)" bind:value={to} />
  <input aria-label="Cc" placeholder="Cc" bind:value={cc} />
  <input aria-label="Subject" placeholder="Subject" bind:value={subject} />
  <TemplateSelector
    onselect={(t) => {
      templateId = t.id;
      if (t.subject) subject = t.subject;
      if (t.html) body = t.html;
    }}
  />
  <textarea aria-label="Body" placeholder="Write your message…" bind:value={body}></textarea>
  {#if signatures && signatures.length > 0}
    <SignaturePicker {signatures} onselect={(s) => (body += s.html)} />
  {/if}
  <AttachmentUpload bind:value={attachments} />
  {#if error}
    <p role="alert" data-lockally="error">{error}</p>
  {/if}
  <button type="submit" disabled={sending || !from || !to.trim()}>
    {sending ? 'Sending…' : 'Send'}
  </button>
</form>

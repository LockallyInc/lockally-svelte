<script lang="ts">
  import { fileToAttachment, type Attachment } from '@lockally/ui-core';

  let {
    value = $bindable([]),
  }: { value?: Attachment[] } = $props();

  async function onFiles(e: Event) {
    const files = (e.target as HTMLInputElement).files;
    if (!files || files.length === 0) return;
    const added = await Promise.all(Array.from(files).map(fileToAttachment));
    value = [...value, ...added];
  }

  function remove(i: number) {
    value = value.filter((_, j) => j !== i);
  }
</script>

<div data-lockally="attachment-upload">
  <input type="file" multiple aria-label="Add attachments" onchange={onFiles} />
  <ul data-lockally="attachment-list">
    {#each value as a, i (`${a.filename}-${i}`)}
      <li>
        <span>{a.filename}</span>
        <button type="button" aria-label={`Remove ${a.filename}`} onclick={() => remove(i)}>×</button>
      </li>
    {/each}
  </ul>
</div>

<script lang="ts">
  import type { Signature } from '@lockally/ui-core';

  // Prop-driven: Lockally has no public signatures API, so pass your own list.
  let { signatures, onselect }: { signatures: Signature[]; onselect: (s: Signature) => void } = $props();

  function change(e: Event) {
    const s = signatures.find((x) => x.id === (e.target as HTMLSelectElement).value);
    if (s) onselect(s);
  }
</script>

<select data-lockally="signature-picker" aria-label="Choose a signature" onchange={change}>
  <option value="" disabled selected>Choose a signature…</option>
  {#each signatures as s (s.id)}
    <option value={s.id}>{s.name}</option>
  {/each}
</select>

<script lang="ts">
  import type { Template } from '@lockally/ui-core';
  import { getLockally } from './context.js';

  let { onselect }: { onselect: (t: Template) => void } = $props();

  const client = getLockally();
  let data = $state<Template[]>([]);
  let loading = $state(true);

  $effect(() => {
    loading = true;
    client
      .listTemplates()
      .then((r) => (data = r))
      .catch(() => (data = []))
      .finally(() => (loading = false));
  });

  function change(e: Event) {
    const t = data.find((x) => x.id === (e.target as HTMLSelectElement).value);
    if (t) onselect(t);
  }
</script>

<select data-lockally="template-selector" aria-label="Choose a template" disabled={loading} onchange={change}>
  <option value="" disabled selected>{loading ? 'Loading templates…' : 'Choose a template…'}</option>
  {#each data as t (t.id)}
    <option value={t.id}>{t.name}</option>
  {/each}
</select>

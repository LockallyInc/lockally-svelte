<script lang="ts">
  import type { Contact } from '@lockally/ui-core';
  import { getLockally } from './context.js';

  let {
    onselect,
    placeholder = 'Search contacts…',
  }: { onselect: (c: Contact) => void; placeholder?: string } = $props();

  const client = getLockally();
  let q = $state('');
  let data = $state<Contact[]>([]);
  let loading = $state(false);
  let seq = 0;

  $effect(() => {
    const query = q.trim() || undefined;
    const mine = ++seq;
    loading = true;
    client
      .listContacts(query)
      .then((r) => {
        if (mine === seq) data = r;
      })
      .catch(() => {
        if (mine === seq) data = [];
      })
      .finally(() => {
        if (mine === seq) loading = false;
      });
  });
</script>

<div data-lockally="contact-picker">
  <input type="search" bind:value={q} aria-label="Search contacts" {placeholder} />
  <ul data-lockally="contact-list">
    {#if loading}
      <li data-lockally="loading">Loading…</li>
    {:else}
      {#each data as c (c.id)}
        <li>
          <button type="button" onclick={() => onselect(c)}>
            {c.name ? `${c.name} <${c.email}>` : c.email}
          </button>
        </li>
      {/each}
    {/if}
  </ul>
</div>

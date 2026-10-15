<script lang="ts">
  import LockallyProvider from '../lib/LockallyProvider.svelte';

  // Renders an arbitrary component inside a provider (for tests needing context).
  let { client, component: Comp, props = {} } = $props();
</script>

<LockallyProvider {client}>
  <Comp {...props} />
</LockallyProvider>

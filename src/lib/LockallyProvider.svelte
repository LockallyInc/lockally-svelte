<script lang="ts">
  import type { Snippet } from 'svelte';
  import type { GetToken, LockallyClient } from '@lockally/ui-core';
  import { setLockally } from './context.js';

  let {
    getToken,
    baseUrl,
    client,
    children,
  }: {
    getToken?: GetToken;
    baseUrl?: string;
    client?: LockallyClient;
    children: Snippet;
  } = $props();

  // Never pass a secret lk_live_ key — supply getToken (short-lived token from your
  // backend) or a baseUrl proxy.
  setLockally(client ?? { getToken, baseUrl });
</script>

{@render children()}

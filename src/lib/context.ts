import { getContext, setContext } from 'svelte';
import { LockallyClient, type LockallyAuth } from '@lockally/ui-core';

const KEY = Symbol('lockally');

/** Provide a Lockally client to descendant components (call during component init). */
export function setLockally(auth: LockallyAuth | LockallyClient): LockallyClient {
  const client = auth instanceof LockallyClient ? auth : new LockallyClient(auth);
  setContext(KEY, client);
  return client;
}

/** Access the Lockally client provided by an ancestor `<LockallyProvider>`. */
export function getLockally(): LockallyClient {
  const client = getContext<LockallyClient | undefined>(KEY);
  if (!client) {
    throw new Error('getLockally() must be used under <LockallyProvider>.');
  }
  return client;
}

import { afterEach, describe, expect, it, vi } from 'vitest';
import { cleanup, fireEvent, render } from '@testing-library/svelte';

afterEach(cleanup);
import { LockallyClient } from '@lockally/ui-core';
import Harness from './Harness.svelte';
import EmailComposer from '../lib/EmailComposer.svelte';
import ContactPicker from '../lib/ContactPicker.svelte';
import SignaturePicker from '../lib/SignaturePicker.svelte';

function clientWith(routes: Record<string, unknown>) {
  const fetchImpl = vi.fn(async (url: string) => {
    const path = url.replace('https://api.lockally.com', '');
    const key = path.startsWith('/v1/contacts') ? '/v1/contacts' : path;
    return new Response(JSON.stringify(routes[key] ?? {}), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  });
  const client = new LockallyClient({ getToken: async () => 'tok' }, fetchImpl as unknown as typeof fetch);
  return { client, fetchImpl };
}

describe('@lockally/svelte components', () => {
  it('EmailComposer sends and calls onsent', async () => {
    const { client, fetchImpl } = clientWith({
      '/v1/send': { id: 'm_1', message_id: '<x@lockally.com>', status: 'queued' },
      '/v1/templates': { data: [] },
    });
    const onsent = vi.fn();
    const { container, getByLabelText } = render(Harness, {
      props: { client, component: EmailComposer, props: { defaultFrom: 'alerts@acme.com', defaultTo: 'user@example.com', onsent } },
    });

    await fireEvent.input(getByLabelText('Body'), { target: { value: '<b>hi</b>' } });
    await fireEvent.submit(container.querySelector('form')!);
    await vi.waitFor(() => expect(onsent).toHaveBeenCalledTimes(1));

    const sendCall = fetchImpl.mock.calls.find(([u]) => String(u).endsWith('/v1/send'));
    expect(sendCall).toBeTruthy();
    const payload = JSON.parse((sendCall![1] as RequestInit).body as string);
    expect(payload.from).toBe('alerts@acme.com');
    expect(payload.to).toEqual(['user@example.com']);
    expect((sendCall![1] as RequestInit).headers).toMatchObject({
      'Idempotency-Key': expect.stringMatching(/^lk-/),
    });
  });

  it('ContactPicker lists and selects', async () => {
    const { client } = clientWith({
      '/v1/contacts': { data: [{ id: 'c1', name: 'Ada', email: 'ada@example.com' }] },
    });
    const onselect = vi.fn();
    const { findByRole } = render(Harness, {
      props: { client, component: ContactPicker, props: { onselect } },
    });
    const btn = await findByRole('button', { name: /ada@example.com/ });
    await fireEvent.click(btn);
    expect(onselect).toHaveBeenCalledWith(expect.objectContaining({ email: 'ada@example.com' }));
  });

  it('SignaturePicker is prop-driven', async () => {
    const onselect = vi.fn();
    const { getByRole } = render(SignaturePicker, {
      props: { signatures: [{ id: 's1', name: 'Default', html: '<p>Cheers</p>' }], onselect },
    });
    await fireEvent.change(getByRole('combobox'), { target: { value: 's1' } });
    expect(onselect).toHaveBeenCalledWith(expect.objectContaining({ id: 's1' }));
  });
});

# @lockally/svelte

Official [Lockally](https://lockally.com) Svelte 5 components for embedding
transactional email into your app: `EmailComposer`, `ContactPicker`,
`AttachmentUpload`, `TemplateSelector`, `SignaturePicker`.

## Install

```bash
npm install @lockally/svelte @lockally/ui-core svelte
```

## Secure setup (never ship a secret key in the browser)

A `lk_live_` / `lk_test_` key must **never** run in browser code. Provide a
`getToken()` that fetches a **short-lived token from your backend** (which holds the
secret key), or point `baseUrl` at your own proxy.

```svelte
<script lang="ts">
  import { LockallyProvider, EmailComposer } from '@lockally/svelte';

  async function getToken() {
    const res = await fetch('/api/lockally-token'); // your backend mints a short-lived token
    return (await res.json()).token;
  }
</script>

<LockallyProvider {getToken}>
  <EmailComposer
    defaultFrom="alerts@yourdomain.com"
    onsent={(r) => console.log('sent', r.id)}
    onerror={(e) => console.error(e)}
  />
</LockallyProvider>
```

## Components

| Component | Purpose |
|---|---|
| `EmailComposer` | Full compose form → `POST /v1/send`. Callback props `onsent` / `onerror`. |
| `ContactPicker` | Search contacts (`GET /v1/contacts?q=`). `onselect`. |
| `TemplateSelector` | Pick a stored template (`GET /v1/templates`). `onselect`. |
| `AttachmentUpload` | `File` → base64; `bind:value` of `Attachment[]`. |
| `SignaturePicker` | **Prop-driven** — pass your own `signatures`; `onselect`. Lockally has no public signatures API. |

Every element carries a `data-lockally="…"` hook, so you theme it with your own CSS —
no stylesheet required.

## License

MIT © Lockally

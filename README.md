# Wild Globalization v3

[![Build and Deploy Eleventy](https://github.com/adamdjbrett/wildglobalization-v3/actions/workflows/xmit-deploy.yml/badge.svg?branch=main)](https://github.com/adamdjbrett/wildglobalization-v3/actions/workflows/xmit-deploy.yml)

Eleventy-powered site for Wild Globalization.

## Stack

- Eleventy 3
- Nunjucks templates
- Pagefind search
- GitHub Actions deployment to XMIT

## Requirements

- Node.js 20+
- npm

## Local Development

```bash
npm ci
npm run dev
```

## Production Build

```bash
npm run build
```

Build output is generated in `_site`.

## Deploy

Deploys through GitHub Actions workflow `xmit-deploy.yml`.

Required repository secret:

- `XMIT_KEY`

Optional repository variable:

- `XMIT_SITE` (defaults to `wildglobalization.xmit.dev`)

You can also run the workflow manually with `workflow_dispatch` and pass a `site` override.

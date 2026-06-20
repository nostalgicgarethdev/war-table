# Free Custom Domain Setup (is-a.dev) — now using own domain

You switched to wartable.qzz.io.

This folder is kept as reference / alternative free option.

## Steps

1. Go to https://github.com/is-a-dev/register

2. Create a Pull Request to add the domain.

3. Copy the contents of `war-table.json` (edit the email first to your real email).

4. After the PR is merged:
   - Go to https://github.com/nostalgicgarethdev/war-table/settings/pages
   - Under "Custom domain", enter: `war-table.is-a.dev`
   - Save and enable HTTPS when ready.

The `site/CNAME` file ensures the domain works with our GitHub Actions deployment (which publishes the `site/` folder).

## File
- `war-table.json` — ready for the PR (update your email address before submitting)

# HANDOFF: Deploy rouxlabs.benops.dev

**Date:** 2026-05-10  
**Status:** Ready for execution  
**What:** Static Roux Labs website served via Cloudflare tunnel

---

## Summary

Everything is staged. The site files are in `~/Desktop/shared/rouxlabs/`, a Python HTTP server script (`serve.py`) listens on port 4321, and the cloudflared config already has the new ingress rule for `rouxlabs.benops.dev`.

## Execute These Commands

### 1. Create logs directory (if not exists)
```bash
mkdir -p ~/Desktop/shared/logs
```

### 2. Install the launchd plist
```bash
cp ~/Desktop/shared/rouxlabs/com.benops.rouxlabs.plist ~/Library/LaunchAgents/
launchctl load ~/Library/LaunchAgents/com.benops.rouxlabs.plist
```

### 3. Verify the local server is running
```bash
curl -s http://127.0.0.1:4321/ | head -5
```
You should see the HTML of index.html.

### 4. Restart cloudflared to pick up the new route
```bash
launchctl stop com.cloudflare.cloudflared
launchctl start com.cloudflare.cloudflared
```
Or if cloudflared runs differently on this machine:
```bash
brew services restart cloudflared
```

### 5. Add DNS CNAME in Cloudflare (if not already present)

The tunnel UUID is `ebb12bd1-8014-42b1-9c44-b0e2355e32a2`.

Add a CNAME record in Cloudflare DNS for `benops.dev`:
- **Type:** CNAME
- **Name:** rouxlabs
- **Target:** ebb12bd1-8014-42b1-9c44-b0e2355e32a2.cfargotunnel.com
- **Proxy status:** Proxied (orange cloud)

This can be done via the Cloudflare dashboard or CLI:
```bash
cloudflared tunnel route dns ebb12bd1-8014-42b1-9c44-b0e2355e32a2 rouxlabs.benops.dev
```

### 6. Verify end-to-end
```bash
curl -sI https://rouxlabs.benops.dev | head -10
```

---

## File Locations

| File | Path |
|------|------|
| Site files | `~/Desktop/shared/rouxlabs/` |
| Server script | `~/Desktop/shared/rouxlabs/serve.py` |
| Launchd plist | `~/Library/LaunchAgents/com.benops.rouxlabs.plist` |
| Cloudflared config | `~/.cloudflared/config.yml` |
| Server logs | `~/Desktop/shared/logs/rouxlabs.log` |
| Error logs | `~/Desktop/shared/logs/rouxlabs-error.log` |

## Port

- **4321** — Roux Labs HTTP server (127.0.0.1 only)

## Rollback

```bash
launchctl unload ~/Library/LaunchAgents/com.benops.rouxlabs.plist
rm ~/Library/LaunchAgents/com.benops.rouxlabs.plist
```
Then remove the `rouxlabs.benops.dev` ingress rule from `~/.cloudflared/config.yml` and restart cloudflared.

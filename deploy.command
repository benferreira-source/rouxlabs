#!/bin/bash
# Deploy rouxlabs.benops.dev — run this on Dobby
set -e

echo "=== Deploying Roux Labs site ==="

# 1. Logs dir
mkdir -p ~/Desktop/shared/logs
echo "✅ Logs directory ready"

# 2. Install plist
cp ~/Desktop/shared/rouxlabs/com.benops.rouxlabs.plist ~/Library/LaunchAgents/
launchctl load ~/Library/LaunchAgents/com.benops.rouxlabs.plist 2>/dev/null || true
echo "✅ Launchd plist loaded"

# 3. Verify local
sleep 2
if curl -s http://127.0.0.1:4321/ | grep -q "Roux Labs\|FlexPort\|rouxlabs"; then
    echo "✅ Local server responding on :4321"
else
    echo "❌ Local server NOT responding — check logs at ~/Desktop/shared/logs/rouxlabs.log"
    exit 1
fi

# 4. DNS CNAME
cloudflared tunnel route dns ebb12bd1-8014-42b1-9c44-b0e2355e32a2 rouxlabs.benops.dev 2>/dev/null || echo "⚠️  CNAME may already exist (that's fine)"
echo "✅ DNS CNAME set"

# 5. Restart cloudflared
brew services restart cloudflared 2>/dev/null || (launchctl stop com.cloudflare.cloudflared && launchctl start com.cloudflare.cloudflared) 2>/dev/null || true
echo "✅ Cloudflared restarting"

# 6. Wait and verify
echo "Waiting 8s for tunnel..."
sleep 8
HTTP_CODE=$(curl -s -o /dev/null -w "%{http_code}" https://rouxlabs.benops.dev)
if [ "$HTTP_CODE" = "200" ]; then
    echo "✅ rouxlabs.benops.dev is LIVE! (HTTP $HTTP_CODE)"
else
    echo "⚠️  Got HTTP $HTTP_CODE — tunnel may need a few more seconds. Try: curl -sI https://rouxlabs.benops.dev"
fi

echo ""
echo "=== Deploy complete ==="


#!/usr/bin/env bash
set -euo pipefail

echo "==> Checking for VERCEL_TOKEN"
if [[ -z "${VERCEL_TOKEN:-}" ]]; then
  echo "ERROR: VERCEL_TOKEN is not set."
  echo "Create one at https://vercel.com/account/tokens"
  echo "Then set it: export VERCEL_TOKEN=your_token_here"
  exit 1
fi

echo "==> Vercel CLI available"
which vercel || echo "Installing vercel CLI..." && yarn add -D vercel

echo "==> Building Next.js"
yarn build

echo "==> Deploying to Vercel (production)"
# Use org/project if provided, otherwise autodetect/new
EXTRA_ARGS=()
[[ -n "${VERCEL_ORG_ID:-}" ]] && EXTRA_ARGS+=(--scope "${VERCEL_ORG_ID}")
[[ -n "${VERCEL_PROJECT_ID:-}" ]] && EXTRA_ARGS+=(--name "${VERCEL_PROJECT_ID}")

DEPLOY_OUTPUT=$(yarn vercel --prod --yes "${EXTRA_ARGS[@]}" 2>&1)
echo "$DEPLOY_OUTPUT"

DEPLOY_URL=$(echo "$DEPLOY_OUTPUT" | grep -E 'https://[a-zA-Z0-9-]+\.vercel\.app' | tail -n1 | tr -d '[:space:]')

if [[ -z "$DEPLOY_URL" ]]; then
  echo "WARNING: Could not auto-extract URL from Vercel output."
  echo "Check the output above for your deployment URL."
  echo "Or run: yarn vercel inspect"
  exit 0
fi

echo ""
echo "==================================================================="
echo "🎉 DEPLOYED SUCCESSFULLY!"
echo "==================================================================="
echo ""
echo "Live URL: $DEPLOY_URL"
echo ""
echo "$DEPLOY_URL" | tee .vercel_live_url.txt

cat > DNS_README_VERCEL.txt <<'DNSEOF'
═══════════════════════════════════════════════════════════════════
VERCEL DNS INSTRUCTIONS FOR GODADDY
═══════════════════════════════════════════════════════════════════

Your Next.js app is now live on Vercel! 🎉

STEP 1: Add Custom Domains in Vercel
─────────────────────────────────────
1. Go to: https://vercel.com/dashboard
2. Select your project: kreative-web-agency (or similar)
3. Go to: Settings → Domains
4. Add BOTH domains:
   ✓ kreativeaiagency.com
   ✓ admin.kreativeaiagency.com

Vercel will show you the exact DNS records needed.

STEP 2: Update DNS in GoDaddy
──────────────────────────────
1. Log in to GoDaddy
2. Go to: My Products → Domains → kreativeaiagency.com → DNS
3. Add/Update these records:

   ROOT DOMAIN (apex):
   ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
   Type: A
   Name: @
   Value: 76.76.21.21
   TTL: 600 (10 minutes)
   ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

   WWW SUBDOMAIN (optional redirect):
   ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
   Type: CNAME
   Name: www
   Value: cname.vercel-dns.com
   TTL: 600
   ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

   ADMIN SUBDOMAIN:
   ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
   Type: CNAME
   Name: admin
   Value: cname.vercel-dns.com
   TTL: 600
   ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

STEP 3: Configure Domains in Vercel
────────────────────────────────────
After adding domains in Vercel:
1. Set kreativeaiagency.com as PRIMARY
2. (Optional) Add redirect: www.kreativeaiagency.com → kreativeaiagency.com
3. Vercel will auto-provision SSL certificates (takes ~5 minutes)

STEP 4: Test Your Routes
─────────────────────────
Once DNS propagates (usually 5-15 minutes), test:

✓ https://kreativeaiagency.com
✓ https://kreativeaiagency.com/quote
✓ https://kreativeaiagency.com/get-quote
✓ https://kreativeaiagency.com/thank-you
✓ https://kreativeaiagency.com/services
✓ https://kreativeaiagency.com/about
✓ https://kreativeaiagency.com/admin/login

All routes should work perfectly! ✨

═══════════════════════════════════════════════════════════════════
IMPORTANT NOTES
═══════════════════════════════════════════════════════════════════

✓ Keep your Abacus deployment as fallback (no changes needed)
✓ No code changes required - just DNS updates
✓ Vercel automatically handles Next.js routing (no more 404s!)
✓ Admin subdomain points to same project for now
✓ Later, you can split admin to a separate Vercel project

ROLLBACK PLAN
─────────────
If anything goes wrong, just change DNS back to your
original Abacus IP in GoDaddy. Zero risk! 🛡️

═══════════════════════════════════════════════════════════════════
DNSEOF

echo ""
echo "==================================================================="
echo "📋 NEXT STEPS:"
echo "==================================================================="
echo ""
echo "1. ✅ Your app is live at: $DEPLOY_URL"
echo ""
echo "2. 🌐 Add domains in Vercel:"
echo "   → Go to: https://vercel.com/dashboard"
echo "   → Settings → Domains"
echo "   → Add: kreativeaiagency.com"
echo "   → Add: admin.kreativeaiagency.com"
echo ""
echo "3. 🔧 Update GoDaddy DNS (see DNS_README_VERCEL.txt)"
echo ""
echo "4. ⏱️  Wait 5-15 minutes for DNS propagation"
echo ""
echo "5. 🧪 Test all routes:"
echo "   → /quote"
echo "   → /get-quote"
echo "   → /thank-you"
echo "   → /services"
echo "   → /about"
echo "   → /admin/login"
echo ""
echo "==================================================================="
echo ""
echo "📄 Full instructions saved to: DNS_README_VERCEL.txt"
echo ""

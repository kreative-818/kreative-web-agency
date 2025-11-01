
Vercel + GoDaddy DNS Configuration
===================================

STEP 1: Add Domains in Vercel
------------------------------
1. Go to: https://vercel.com → Your Project → Settings → Domains
2. Click "Add Domain" and add these three domains:
   
   Primary Domain:
   • kreativeaiagency.com          ← Set as PRIMARY domain
   
   WWW Redirect:
   • www.kreativeaiagency.com      ← Auto-redirects to primary
   
   Admin Portal (Later):
   • admin.kreativeaiagency.com    ← For separate admin portal

3. Vercel will show you the DNS records needed for verification.


STEP 2: Configure GoDaddy DNS
------------------------------
Go to: GoDaddy → My Products → Domains → kreativeaiagency.com → DNS

Add/Update these records:

┌─────────────────────────────────────────────────────────────┐
│ Record Type │ Name  │ Value                   │ TTL        │
├─────────────────────────────────────────────────────────────┤
│ A           │ @     │ 76.76.21.21             │ 600 (10m)  │
│ CNAME       │ www   │ cname.vercel-dns.com    │ 1 Hour     │
│ CNAME       │ admin │ cname.vercel-dns.com    │ 1 Hour     │
└─────────────────────────────────────────────────────────────┘

IMPORTANT NOTES:
• Delete any conflicting A or CNAME records for the same names
• The A record for @ points to Vercel's IP (76.76.21.21)
• CNAME records must point to cname.vercel-dns.com (NOT your project URL)
• TTL = Time To Live (how long DNS caches the record)


STEP 3: Wait for DNS Propagation
---------------------------------
• DNS changes can take 5 minutes to 48 hours (usually 15-30 minutes)
• Check status in Vercel → Settings → Domains
• You'll see "Valid Configuration" when ready


STEP 4: Test Your Deployment
-----------------------------
After DNS propagates, test these URLs:

Main Site:
✓ https://kreativeaiagency.com
✓ https://www.kreativeaiagency.com (should redirect to non-www)

Deep Routes (Critical Pages):
✓ https://kreativeaiagency.com/about
✓ https://kreativeaiagency.com/services
✓ https://kreativeaiagency.com/pricing
✓ https://kreativeaiagency.com/get-started
✓ https://kreativeaiagency.com/quote
✓ https://kreativeaiagency.com/thank-you

Admin Portal:
✓ https://kreativeaiagency.com/admin/login
✓ https://kreativeaiagency.com/admin/dashboard

API Routes (Test with Postman/curl):
✓ POST /api/quotes
✓ POST /api/leads
✓ GET /api/auth/signin


STEP 5: Verify Critical Functionality
--------------------------------------
1. Lead Capture Forms:
   • Submit a test quote from /get-started
   • Verify it appears in /admin/leads

2. Authentication:
   • Login to /admin/login with your credentials
   • Verify dashboard loads correctly

3. Stripe Checkout (Test Mode):
   • Start a test checkout flow
   • Verify Stripe redirects work correctly

4. SMS/Phone Integration:
   • Test that OpenPhone webhooks still reach Vercel
   • Verify SMS auto-replies work


STEP 6: Switch Traffic (When Ready)
------------------------------------
Current Setup:
• Abacus.AI hosting: 52.34.76.202
• Vercel hosting: 76.76.21.21

When you're confident Vercel is working:
1. Keep the Vercel DNS records (A @ → 76.76.21.21)
2. Traffic will now go to Vercel
3. You can retire Abacus deployment or keep as backup


TROUBLESHOOTING
===============

Issue: "Invalid Configuration" in Vercel
→ Double-check DNS records in GoDaddy
→ Wait 15-30 minutes for propagation
→ Use https://dnschecker.org to verify DNS changes globally

Issue: www not redirecting
→ Ensure www CNAME → cname.vercel-dns.com
→ In Vercel, ensure kreativeaiagency.com is set as PRIMARY

Issue: 404 on deep routes
→ Check vercel.json framework is set to "nextjs"
→ Verify Build Output Directory is blank (default)

Issue: API routes not working
→ Check Vercel Functions logs: Project → Logs
→ Verify environment variables are set in Vercel

Issue: Database connection failed
→ Add DATABASE_URL in Vercel → Settings → Environment Variables
→ Redeploy after adding env vars


SUPPORT RESOURCES
=================
• Vercel Docs: https://vercel.com/docs
• Vercel Domains Guide: https://vercel.com/docs/projects/domains
• DNS Checker: https://dnschecker.org
• Your Vercel Dashboard: https://vercel.com/dashboard


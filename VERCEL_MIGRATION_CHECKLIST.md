
# Vercel Migration Checklist ✅

## Pre-Migration Status

### ✅ What Stays 100% Intact
- **Authentication System**: Prisma + bcrypt + RBAC (no changes)
- **Stripe Integration**: All checkout routes + webhooks preserved
- **Quotes & Leads**: `/api/quotes`, `/api/leads` endpoints untouched
- **Client Portal**: Login, dashboard, project tracking
- **Admin Portal**: Full admin interface + middleware
- **Database**: PostgreSQL connection via `DATABASE_URL`
- **API Routes**: All 50+ API endpoints remain functional
- **Phone/SMS**: OpenPhone webhooks continue to work

### ✅ What's Already Configured
- ✅ Node version constraint: `>=18 <=20`
- ✅ Vercel CLI installed: `v48.8.0`
- ✅ Prisma postinstall: `prisma generate || true`
- ✅ Build command: `yarn build`
- ✅ Minimal `vercel.json`: `{"framework": "nextjs"}`
- ✅ Production build: **PASSED** (all routes valid)

---

## Deployment Verification

### 🧪 Test on Vercel Preview URL
Once deployed, you'll receive a URL like:
```
https://your-project-abc123.vercel.app
```

**Test these routes immediately:**

#### Homepage & Marketing Pages
- [ ] `/` - Homepage loads
- [ ] `/about` - About page
- [ ] `/services` - Services page
- [ ] `/pricing` - Pricing page
- [ ] `/portfolio` - Portfolio page

#### Lead Capture Critical Path
- [ ] `/get-started` - Main lead form
- [ ] `/quote` - Quote request form
- [ ] `/request-quote` - Alternative quote form
- [ ] `/thank-you` - Confirmation page
- [ ] Submit a test lead and verify it saves to database

#### Client Portal
- [ ] `/portal/login` - Client login page
- [ ] `/portal/dashboard` - Client dashboard (after login)

#### Admin Portal
- [ ] `/admin/login` - Admin login page loads
- [ ] `/admin/dashboard` - Admin dashboard (after login)
- [ ] `/admin/leads` - View leads
- [ ] `/admin/analytics` - Analytics page
- [ ] `/admin/pipeline` - Sales pipeline

#### API Routes (Use Postman or curl)
```bash
# Test lead submission
curl -X POST https://your-project.vercel.app/api/leads \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","phone":"5551234567"}'

# Test quote endpoint
curl -X POST https://your-project.vercel.app/api/quotes \
  -H "Content-Type: application/json" \
  -d '{"name":"Test User","email":"test@example.com"}'

# Test auth endpoint
curl https://your-project.vercel.app/api/auth/signin
```

#### Stripe Integration
- [ ] Start a test checkout (use Stripe test mode)
- [ ] Verify redirect to Stripe hosted checkout
- [ ] Complete test purchase with test card: `4242 4242 4242 4242`
- [ ] Verify webhook receives payment confirmation
- [ ] Check that purchase appears in admin dashboard

#### Phone/SMS Integration (OpenPhone)
- [ ] Send test SMS to your OpenPhone number
- [ ] Verify webhook reaches Vercel: Check `/api/sms-webhook`
- [ ] Verify auto-reply is sent back
- [ ] Check `/admin/chats` shows the conversation

---

## Vercel Project Settings

### Build & Development Settings
Go to: **Vercel Dashboard → Your Project → Settings → General**

```
Framework Preset:         Next.js
Root Directory:           (leave blank OR point to nextjs_space if monorepo)
Build Command:            (leave blank - auto-detected)
Output Directory:         (leave blank - Next.js default: .next)
Install Command:          yarn install --frozen-lockfile
Development Command:      (leave blank)
Node Version:             18.x or 20.x
```

### Environment Variables
Go to: **Vercel Dashboard → Your Project → Settings → Environment Variables**

**Required Variables** (copy from your current `.env`):
```bash
# Database
DATABASE_URL=postgresql://user:pass@host:5432/dbname

# NextAuth
NEXTAUTH_URL=https://www.kreativeaiagency.com
NEXTAUTH_SECRET=your-secret-here

# Stripe
STRIPE_PUBLIC_KEY=pk_test_...
STRIPE_SECRET_KEY=sk_test_...
STRIPE_WEBHOOK_SECRET=whsec_...

# Email (Resend)
RESEND_API_KEY=re_...

# Phone (OpenPhone)
OPENPHONE_API_KEY=your-key-here
OPENPHONE_PHONE_ID=your-phone-id

# AI (OpenAI)
OPENAI_API_KEY=sk-...

# Optional: Studio OS (add later when ready)
# STUDIO_API_URL=https://your-studio-api.com
```

**IMPORTANT**: 
- Set environment variables for **all environments**: Production, Preview, Development
- After adding env vars, **redeploy** for changes to take effect

---

## DNS Configuration Checklist

### In Vercel (Step 1)
- [ ] Go to Project → Settings → Domains
- [ ] Add domain: `kreativeaiagency.com` (set as PRIMARY)
- [ ] Add domain: `www.kreativeaiagency.com` (auto-redirect)
- [ ] (Later) Add: `admin.kreativeaiagency.com`

### In GoDaddy (Step 2)
- [ ] Delete old A record for `@` (if pointing to 52.34.76.202)
- [ ] Add A record: `@` → `76.76.21.21`
- [ ] Add/Update CNAME: `www` → `cname.vercel-dns.com`
- [ ] (Later) Add CNAME: `admin` → `cname.vercel-dns.com`

### Verification (Step 3)
- [ ] Wait 15-30 minutes for DNS propagation
- [ ] Check https://dnschecker.org/?domain=kreativeaiagency.com
- [ ] Verify Vercel shows "Valid Configuration" for both domains
- [ ] Test: https://kreativeaiagency.com (should load)
- [ ] Test: https://www.kreativeaiagency.com (should redirect to non-www)

---

## Post-Migration Testing

### Smoke Tests (Quick 5-minute check)
1. [ ] Visit homepage - loads correctly
2. [ ] Submit a quote form - saves to database
3. [ ] Login to admin - dashboard works
4. [ ] Check admin leads - new lead appears
5. [ ] Test Stripe checkout - completes successfully

### Integration Tests (Deeper validation)
1. [ ] **Lead Flow**: Submit form → Receive email → Appears in admin
2. [ ] **Payment Flow**: Start checkout → Pay with Stripe → Webhook fires → Purchase recorded
3. [ ] **Auth Flow**: Login → Protected routes work → Logout
4. [ ] **SMS Flow**: Send SMS → Webhook received → Auto-reply sent → Logged in admin
5. [ ] **Phone Flow**: Call OpenPhone → Quo.ai answers → Call logged

### Performance Tests
- [ ] Run Lighthouse audit: https://pagespeed.web.dev/
- [ ] Check Vercel Analytics: Project → Analytics
- [ ] Monitor response times: Project → Logs → Functions

---

## Rollback Plan (If Issues Occur)

### Option 1: Instant DNS Rollback
If critical issues appear after DNS switch:
1. Go to GoDaddy DNS Manager
2. Change A record `@` back to: `52.34.76.202` (Abacus IP)
3. Wait 10-15 minutes for DNS to propagate back
4. Traffic returns to Abacus hosting

### Option 2: Keep Both Running (Recommended for first 24-48h)
- Vercel deployment: https://your-project.vercel.app
- Abacus deployment: https://kreativeaiagency.com (via old DNS)
- Test Vercel thoroughly before switching DNS
- Once confident, flip DNS to Vercel

---

## Studio OS Integration (Phase 2)

### When Your AWS Studio API is Ready
Studio OS is your custom AI backend. When live:

1. **Add Environment Variable**:
   ```bash
   STUDIO_API_URL=https://your-studio-api.amazonaws.com
   ```

2. **Gradual Migration Strategy** (A/B test forms):
   ```javascript
   // Phase 1: Test with 10% of traffic
   if (Math.random() < 0.1) {
     await fetch('/api/studio/proxy', { method: 'POST', body: leadData });
   } else {
     await fetch('/api/leads', { method: 'POST', body: leadData });
   }

   // Phase 2: Increase to 50% after 1 week of testing

   // Phase 3: 100% to Studio OS after confirmed stable
   ```

3. **Monitor Studio OS Performance**:
   - Response times
   - Error rates
   - Lead capture success rate

---

## Success Metrics

### Day 1 (Deployment Day)
- [ ] Site is live on Vercel
- [ ] All pages load correctly
- [ ] Forms submit successfully
- [ ] No console errors
- [ ] Stripe test checkout works

### Week 1
- [ ] Real customer quote submissions work
- [ ] Payments process correctly
- [ ] SMS/phone webhooks stable
- [ ] Admin portal fully functional
- [ ] No reported customer issues

### Week 2+
- [ ] Performance metrics stable or improved
- [ ] No increase in error rates
- [ ] Customer satisfaction maintained
- [ ] Ready to retire Abacus fallback

---

## Common Issues & Solutions

### Issue: Build fails with Prisma error
**Solution**: 
```bash
yarn prisma generate
yarn build
```

### Issue: Environment variables not working
**Solution**: 
1. Check Vercel → Settings → Environment Variables
2. Ensure variables are set for "Production" environment
3. Redeploy after adding variables

### Issue: API routes return 404
**Solution**:
1. Verify `vercel.json` has `{"framework": "nextjs"}`
2. Check Build Output Directory is blank (default)
3. Ensure API routes are in `app/api/` or `pages/api/`

### Issue: Database connection fails
**Solution**:
1. Verify `DATABASE_URL` in Vercel environment variables
2. Check if your database allows connections from Vercel IPs
3. Test connection string manually

### Issue: Stripe webhooks not firing
**Solution**:
1. Update webhook URL in Stripe Dashboard to Vercel domain
2. Verify `STRIPE_WEBHOOK_SECRET` matches Stripe Dashboard
3. Check Vercel Function logs for webhook errors

### Issue: OpenPhone webhooks not received
**Solution**:
1. Update webhook URL in OpenPhone dashboard
2. Change from `52.34.76.202` to `kreativeaiagency.com`
3. Test with a sample SMS

---

## Timeline

### Pre-Deployment (Complete ✅)
- [x] Configure `package.json` with engines and scripts
- [x] Create minimal `vercel.json`
- [x] Run local production build
- [x] Verify all routes compile

### Deployment (Next Step 🎯)
- [ ] Authenticate Vercel CLI (need token)
- [ ] Deploy to Vercel: `vercel --prod --confirm`
- [ ] Capture deployment URL
- [ ] Test all routes on preview URL

### DNS Switch (After Testing ✅)
- [ ] Add domains in Vercel
- [ ] Update GoDaddy DNS records
- [ ] Wait for DNS propagation (15-30 min)
- [ ] Verify SSL certificate auto-issued

### Monitoring (Ongoing 📊)
- [ ] Monitor Vercel Analytics
- [ ] Check Function Logs daily
- [ ] Review error rates
- [ ] Collect customer feedback

---

## Contacts & Resources

### Vercel
- Dashboard: https://vercel.com/dashboard
- Docs: https://vercel.com/docs
- Support: https://vercel.com/support

### Domain (GoDaddy)
- DNS Manager: https://dcc.godaddy.com/manage/kreativeaiagency.com/dns

### Monitoring
- Vercel Analytics: Project → Analytics
- Function Logs: Project → Logs
- DNS Checker: https://dnschecker.org

---

## Final Notes

- **No Code Changes Needed**: Everything is ready in the codebase
- **Zero Downtime**: DNS switch is seamless once Vercel is verified
- **Rollback Available**: Can revert DNS to Abacus instantly if needed
- **Support Ready**: Vercel support is responsive for production issues

**Status**: ✅ Ready to deploy once Vercel token is provided

---

*Last Updated: November 1, 2025*


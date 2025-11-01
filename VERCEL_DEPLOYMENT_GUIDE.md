
# Vercel Deployment Guide - Quick Start

## 🚀 Deploy in 3 Steps

### Step 1: Get Your Vercel Token
1. Go to: https://vercel.com/account/tokens
2. Click "Create Token"
3. Name it: `kreative-deploy`
4. Select Scope: **Full Account**
5. Click "Create"
6. **Copy the token** (you won't see it again!)

### Step 2: Deploy to Vercel
```bash
cd /home/ubuntu/creative_web_agency/nextjs_space

# Option A: Set token as environment variable
export VERCEL_TOKEN="your_token_here"
./node_modules/.bin/vercel --prod --confirm

# Option B: Use token directly in command
./node_modules/.bin/vercel --token "your_token_here" --prod --confirm
```

### Step 3: Configure Environment Variables
After deployment, go to your Vercel dashboard:

1. Go to: **Project → Settings → Environment Variables**
2. Add all variables from your `.env` file
3. Select **Production**, **Preview**, and **Development** for each
4. Click **Save**
5. **Redeploy** from the Deployments tab

---

## 📋 Required Environment Variables

Copy these from your current `.env` file to Vercel:

```bash
# Database (CRITICAL)
DATABASE_URL=postgresql://...

# Auth (CRITICAL)
NEXTAUTH_URL=https://www.kreativeaiagency.com
NEXTAUTH_SECRET=your-secret-here

# Stripe (for payments)
STRIPE_PUBLIC_KEY=pk_test_...
STRIPE_SECRET_KEY=sk_test_...
STRIPE_WEBHOOK_SECRET=whsec_...

# Email (Resend)
RESEND_API_KEY=re_...

# Phone (OpenPhone)
OPENPHONE_API_KEY=...
OPENPHONE_PHONE_ID=...

# AI (OpenAI)
OPENAI_API_KEY=sk-...
```

---

## 🌐 DNS Configuration (After Successful Deployment)

### In Vercel Dashboard
1. Go to **Project → Settings → Domains**
2. Click **Add Domain**
3. Add: `kreativeaiagency.com` (mark as PRIMARY)
4. Add: `www.kreativeaiagency.com`

### In GoDaddy DNS Manager
1. Go to: https://dcc.godaddy.com/manage/kreativeaiagency.com/dns
2. Update these records:

| Type  | Name  | Value                    | TTL      |
|-------|-------|--------------------------|----------|
| A     | @     | 76.76.21.21              | 600      |
| CNAME | www   | cname.vercel-dns.com     | 1 Hour   |

3. **Wait 15-30 minutes** for DNS to propagate
4. Verify at: https://dnschecker.org/?domain=kreativeaiagency.com

---

## ✅ Post-Deployment Checklist

Test these URLs after DNS propagates:

- [ ] https://kreativeaiagency.com
- [ ] https://kreativeaiagency.com/about
- [ ] https://kreativeaiagency.com/services
- [ ] https://kreativeaiagency.com/pricing
- [ ] https://kreativeaiagency.com/get-started
- [ ] https://kreativeaiagency.com/quote
- [ ] https://kreativeaiagency.com/admin/login

Test critical functionality:
- [ ] Submit a quote form
- [ ] Login to admin dashboard
- [ ] Start a test Stripe checkout
- [ ] Send a test SMS (verify webhook works)

---

## 🆘 Troubleshooting

### Build fails
```bash
# Regenerate Prisma client locally
yarn prisma generate

# Try build again
yarn build
```

### Environment variables not working
1. Check they're added in Vercel dashboard
2. Ensure "Production" is selected
3. **Redeploy** after adding variables

### API routes return 404
- Verify `vercel.json` exists with `{"framework": "nextjs"}`
- Check Build Output Directory is blank

### Database connection fails
- Verify `DATABASE_URL` in Vercel
- Check database allows connections from Vercel
- Test connection string format

---

## 📞 Need Help?

**Vercel Documentation**: https://vercel.com/docs
**Support**: https://vercel.com/support

**Project Status**: ✅ Build passed, ready to deploy with token

---

*Quick Reference: See `VERCEL_MIGRATION_CHECKLIST.md` for detailed testing guide*


#!/bin/bash

# Pages that need to be dynamic (from the error logs)
pages=(
  "app/portal/login/page.tsx"
  "app/pricing/page.tsx"
  "app/pricing/success/page.tsx"
  "app/privacy/page.tsx"
  "app/quote/page.tsx"
  "app/request-quote/page.tsx"
  "app/roadmap/page.tsx"
  "app/terms/page.tsx"
  "app/about/page.tsx"
  "app/docs/page.tsx"
  "app/docs/[slug]/page.tsx"
  "app/landing/page.tsx"
  "app/login/page.tsx"
  "app/onboarding/page.tsx"
  "app/portfolio/page.tsx"
  "app/services/page.tsx"
  "app/customer-journey/page.tsx"
  "app/customer-roadmap/page.tsx"
  "app/get-quote/page.tsx"
  "app/seo/charlotte-web-design/page.tsx"
  "app/seo/how-much-does-a-website-cost/page.tsx"
  "app/seo/real-estate-website-design/page.tsx"
  "app/seo/restaurant-website-design/page.tsx"
  "app/thank-you/page.tsx"
)

for page in "${pages[@]}"; do
  if [ -f "$page" ]; then
    # Check if already has dynamic export
    if ! grep -q "export.*dynamic" "$page"; then
      # Check if it's a client component
      if grep -q "^'use client'" "$page" || grep -q '^"use client"' "$page"; then
        echo "Skipping client component: $page"
      else
        # Add dynamic export at the top (after any use directives)
        sed -i "1i export { dynamic, revalidate, fetchCache } from '@/lib/dynamic'" "$page"
        echo "✓ Added dynamic export to: $page"
      fi
    fi
  fi
done

echo "Done!"

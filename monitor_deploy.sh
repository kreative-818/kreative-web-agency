#!/bin/bash
for i in {1..15}; do
  sleep 30
  STATUS=$(./node_modules/.bin/vercel ls --token=rjSx4wsOCHmss0V2mvvE9jyJ 2>&1 | head -10)
  echo "=== Minute $((i/2)) ===" >> /tmp/vercel_monitor.log
  echo "$STATUS" >> /tmp/vercel_monitor.log
  
  if ! echo "$STATUS" | grep -q "Building"; then
    echo "✓ Deployment completed or errored!" >> /tmp/vercel_monitor.log
    break
  fi
done
echo "Final status:" >> /tmp/vercel_monitor.log
./node_modules/.bin/vercel ls --token=rjSx4wsOCHmss0V2mvvE9jyJ 2>&1 | head -10 >> /tmp/vercel_monitor.log

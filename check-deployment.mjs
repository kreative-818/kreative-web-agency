// Check deployment info
import { execSync } from 'child_process';

console.log('🔍 CHECKING DEPLOYMENT INFO\n');

// Check .env for any deployment URLs
try {
  const envFile = require('fs').readFileSync('../.env', 'utf8');
  const lines = envFile.split('\n').filter(l => l.includes('URL') || l.includes('HOST'));
  if (lines.length > 0) {
    console.log('📄 Environment variables with URL/HOST:');
    lines.forEach(l => console.log(`  ${l}`));
  }
} catch (e) {
  console.log('⚠️  No .env file found');
}

console.log('\n📦 To get the Abacus edge hostname, you need to:');
console.log('1. Go to: https://apps.abacus.ai/chatllm/?appId=appllm_engineer');
console.log('2. Find "creative_web_agency" in your apps');
console.log('3. Look for the "Deployment" column');
console.log('4. Copy the full deployment URL (e.g., something.abacusai.app)');
console.log('\nThat deployment URL is your CNAME target! 🎯');

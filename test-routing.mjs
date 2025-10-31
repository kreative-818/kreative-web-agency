// Test host-based routing logic
const testCases = [
  { host: 'kreativeaiagency.com', path: '/', expected: '/' },
  { host: 'kreativeaiagency.com', path: '/about', expected: '/about' },
  { host: 'admin.kreativeaiagency.com', path: '/', expected: '/admin' },
  { host: 'admin.kreativeaiagency.com', path: '/dashboard', expected: '/admin/dashboard' },
  { host: 'admin.kreativeaiagency.com', path: '/admin/leads', expected: '/admin/leads' },
];

console.log('🧪 HOST-BASED ROUTING TEST\n');
testCases.forEach(({ host, path, expected }) => {
  const isAdminHost = host.toLowerCase().startsWith('admin.');
  const shouldRewrite = isAdminHost && !path.startsWith('/admin');
  const result = shouldRewrite ? `/admin${path === '/' ? '' : path}` : path;
  const status = result === expected ? '✅' : '❌';
  console.log(`${status} ${host}${path} → ${result} (expected: ${expected})`);
});

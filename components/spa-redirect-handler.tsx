
'use client';

import { useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';

export function SPARedirectHandler() {
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    // Check if we were redirected from a 404
    const redirectPath = sessionStorage.getItem('spa_redirect');
    
    if (redirectPath && redirectPath !== pathname) {
      sessionStorage.removeItem('spa_redirect');
      // Use client-side navigation to the intended route
      router.push(redirectPath);
    }
    
    // Also handle hash-based redirects
    if (typeof window !== 'undefined' && window.location.hash) {
      const hashPath = window.location.hash.slice(1); // Remove the #
      if (hashPath && hashPath !== pathname) {
        // Clean up the hash and navigate
        window.history.replaceState({}, document.title, hashPath);
        router.push(hashPath);
      }
    }
  }, [pathname, router]);

  return null; // This component doesn't render anything
}

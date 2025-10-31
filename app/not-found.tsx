
'use client';

import { useEffect } from 'react';

export default function NotFound() {
  useEffect(() => {
    // For subpaths that return 404 from the server,
    // redirect to force client-side routing to take over
    if (typeof window !== 'undefined' && window.location.pathname !== '/404') {
      // Store the original path
      const targetPath = window.location.pathname;
      
      // Redirect to homepage with a hash that preserves the intended route
      // The root layout will pick this up and navigate client-side
      if (targetPath !== '/') {
        sessionStorage.setItem('spa_redirect', targetPath);
        window.location.href = '/#' + targetPath;
      }
    }
  }, []);

  return (
    <div className="flex min-h-screen items-center justify-center bg-background">
      <div className="text-center space-y-4">
        <div className="inline-flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
          <svg
            className="h-6 w-6 text-primary animate-spin"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            ></circle>
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            ></path>
          </svg>
        </div>
        <h1 className="text-2xl font-bold tracking-tight">Redirecting...</h1>
        <p className="text-muted-foreground">Please wait while we load the page.</p>
      </div>
    </div>
  );
}

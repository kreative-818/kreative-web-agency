
"use client";

import { SessionProvider } from "next-auth/react";
import { ReactNode, useEffect, useState } from "react";

export function Providers({ children }: { children: ReactNode }) {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) {
    return <>{children}</>;
  }

  return <SessionProvider>{children}</SessionProvider>;
}

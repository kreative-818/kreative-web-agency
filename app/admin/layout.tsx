// Force all admin pages to be dynamic
export const dynamic = 'force-dynamic';
export const revalidate = 0;
export const fetchCache = 'force-no-store';

export const metadata = {
  title: "Admin Dashboard | Kreative Intelligence",
  description: "Kreative Intelligence Admin Panel",
};

export default function AdminRootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // Don't wrap with AdminLayout - individual pages will handle their own layouts
  return <>{children}</>;
}

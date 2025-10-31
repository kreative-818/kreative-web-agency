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



"use client";

import { useState, useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import {
  LayoutDashboard,
  Users,
  MessageSquare,
  Target,
  BarChart3,
  LogOut,
  Menu,
  X,
  Zap,
  Phone,
  PhoneCall,
  Share2,
  Search,
  FileText,
  Sparkles,
  DollarSign,
  Briefcase,
  Bot,
  Calendar
} from "lucide-react";
import { toast } from "sonner";

const navigation = [
  { name: "Dashboard", href: "/admin", icon: LayoutDashboard },
  { name: "Visual Pipeline", href: "/admin/pipeline", icon: Target },
  { name: "Leads CRM", href: "/admin/leads", icon: Users },
  { name: "AI Conversations", href: "/admin/ai-conversations", icon: Bot },
  { name: "Clients", href: "/admin/clients", icon: Briefcase },
  { name: "Projects", href: "/admin/projects", icon: FileText },
  { name: "Call Logs", href: "/admin/call-logs", icon: PhoneCall },
  { name: "Social Media", href: "/admin/social-media", icon: Share2 },
  { name: "Social Calendar", href: "/admin/social-calendar", icon: Calendar },
  { name: "Analytics", href: "/admin/analytics", icon: BarChart3 },
  { name: "Custom Pricing", href: "/admin/custom-pricing", icon: DollarSign },
];

export function AdminLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const handleLogout = async () => {
    try {
      const response = await fetch("/api/admin/logout", {
        method: "POST",
      });

      if (response.ok) {
        toast.success("Logged out successfully");
        router.push("/admin/login");
        router.refresh();
      }
    } catch (error) {
      console.error("Logout error:", error);
      toast.error("Logout failed");
    }
  };

  return (
    <div className="min-h-screen bg-black">
      {/* Mobile sidebar backdrop */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`
          fixed top-0 left-0 z-50 h-full w-64 bg-gray-900 border-r border-gray-800
          transform transition-transform duration-200 ease-in-out
          ${sidebarOpen ? "translate-x-0" : "-translate-x-full"}
          lg:translate-x-0
        `}
      >
        <div className="flex flex-col h-full">
          {/* Logo */}
          <div className="flex items-center justify-between p-6 border-b border-gray-800">
            <Link href="/admin" className="flex items-center gap-3 group">
              <div className="relative w-10 h-10 flex-shrink-0">
                <Image
                  src="/logo-transparent.png"
                  alt="Kreative Intelligence"
                  fill
                  className="object-contain
                    drop-shadow-[0_0_8px_rgba(147,51,234,0.6)] 
                    drop-shadow-[0_0_12px_rgba(59,130,246,0.4)]
                    group-hover:drop-shadow-[0_0_12px_rgba(147,51,234,0.8)] 
                    group-hover:drop-shadow-[0_0_16px_rgba(59,130,246,0.6)]
                    transition-all duration-300"
                />
              </div>
              <div>
                <h1 className="text-white font-bold text-lg bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent">Kreative</h1>
                <p className="text-gray-400 text-xs">Admin Panel</p>
              </div>
            </Link>
            <button
              onClick={() => setSidebarOpen(false)}
              className="lg:hidden text-gray-400 hover:text-white"
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          {/* Navigation */}
          <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
            {navigation.map((item) => {
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className={`
                    flex items-center gap-3 px-4 py-3 rounded-lg transition-colors
                    ${
                      isActive
                        ? "bg-blue-600 text-white"
                        : "text-gray-400 hover:bg-gray-800 hover:text-white"
                    }
                  `}
                  onClick={() => setSidebarOpen(false)}
                >
                  <item.icon className="w-5 h-5" />
                  <span className="font-medium">{item.name}</span>
                </Link>
              );
            })}
          </nav>

          {/* Logout */}
          <div className="p-4 border-t border-gray-800">
            <Button
              onClick={handleLogout}
              variant="outline"
              className="w-full border-gray-700 text-gray-300 hover:bg-gray-800"
            >
              <LogOut className="w-4 h-4 mr-2" />
              Logout
            </Button>
          </div>
        </div>
      </aside>

      {/* Main content */}
      <div className="lg:pl-64">
        {/* Mobile header */}
        <header className="lg:hidden sticky top-0 z-30 bg-gray-900 border-b border-gray-800 px-4 py-3">
          <div className="flex items-center justify-between">
            <button
              onClick={() => setSidebarOpen(true)}
              className="text-gray-400 hover:text-white"
            >
              <Menu className="w-6 h-6" />
            </button>
            <div className="flex items-center gap-2">
              <div className="relative w-8 h-8">
                <Image
                  src="/logo-transparent.png"
                  alt="Kreative Intelligence"
                  fill
                  className="object-contain
                    drop-shadow-[0_0_6px_rgba(147,51,234,0.6)] 
                    drop-shadow-[0_0_8px_rgba(59,130,246,0.4)]"
                />
              </div>
              <span className="text-white font-bold bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent">Kreative Admin</span>
            </div>
            <div className="w-6" /> {/* Spacer for centering */}
          </div>
        </header>

        {/* Page content */}
        <main className="min-h-screen">{children}</main>
      </div>
    </div>
  );
}


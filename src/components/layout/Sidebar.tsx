"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Zap,
  Image,
  Palette,
  Settings,
  ChevronLeft,
  ChevronRight,
  Code2,
  CreditCard,
  LogOut,
  Sparkles,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useStore } from "@/store/useStore";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { getInitials } from "@/lib/utils";
import { signOut } from "@/lib/supabase";
import { useRouter } from "next/navigation";

const navItems = [
  { label: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
  { label: "Extract", href: "/extract", icon: Zap, badge: "AI" },
  { label: "Gallery", href: "/gallery", icon: Image },
  { label: "Brand Kit", href: "/brand-kit", icon: Palette },
  { label: "API", href: "/docs/api", icon: Code2 },
  { label: "Settings", href: "/settings", icon: Settings },
];

export default function Sidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const { sidebarCollapsed, toggleSidebar, user } = useStore();

  const handleSignOut = async () => {
    await signOut();
    router.push("/");
  };

  return (
    <aside
      className={cn(
        "h-screen sticky top-0 flex flex-col bg-[#0A0A15] border-r border-white/[0.06] transition-all duration-300",
        sidebarCollapsed ? "w-16" : "w-60"
      )}
    >
      {/* Logo */}
      <div className="h-16 flex items-center px-4 border-b border-white/[0.06]">
        <Link href="/dashboard" className="flex items-center gap-2.5 min-w-0">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-violet-600 to-cyan-500 flex items-center justify-center flex-shrink-0 shadow-lg shadow-violet-500/20">
            <Zap className="w-4 h-4 text-white" />
          </div>
          {!sidebarCollapsed && (
            <span className="text-white font-bold text-lg tracking-tight truncate">
              Frame<span className="gradient-text">Flow</span>
            </span>
          )}
        </Link>
      </div>

      {/* Navigation */}
      <nav className="flex-1 py-4 px-2 space-y-0.5 overflow-y-auto">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.href || pathname.startsWith(item.href + "/");
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all group",
                isActive
                  ? "bg-violet-600/20 text-violet-400 border border-violet-500/20"
                  : "text-white/50 hover:text-white hover:bg-white/5"
              )}
            >
              <Icon className={cn("w-4 h-4 flex-shrink-0", isActive ? "text-violet-400" : "")} />
              {!sidebarCollapsed && (
                <>
                  <span className="truncate">{item.label}</span>
                  {item.badge && (
                    <Badge variant="violet" className="ml-auto text-[10px] px-1.5 py-0">
                      {item.badge}
                    </Badge>
                  )}
                </>
              )}
            </Link>
          );
        })}
      </nav>

      {/* Upgrade Banner */}
      {!sidebarCollapsed && user?.subscription === "free" && (
        <div className="px-3 pb-3">
          <div className="rounded-lg bg-gradient-to-br from-violet-600/20 to-cyan-500/10 border border-violet-500/20 p-3">
            <div className="flex items-center gap-2 mb-1">
              <Sparkles className="w-3.5 h-3.5 text-violet-400" />
              <span className="text-xs font-semibold text-violet-400">Upgrade to Pro</span>
            </div>
            <p className="text-xs text-white/50 mb-2">Unlimited extractions & AI features</p>
            <Link href="/pricing">
              <Button variant="gradient" size="sm" className="w-full text-xs h-7">
                Upgrade — $12/mo
              </Button>
            </Link>
          </div>
        </div>
      )}

      {/* User & Collapse */}
      <div className="p-2 border-t border-white/[0.06] space-y-1">
        {user && (
          <div className={cn("flex items-center gap-2 px-2 py-2 rounded-lg", !sidebarCollapsed && "hover:bg-white/5 cursor-pointer")}>
            <Avatar className="w-7 h-7 flex-shrink-0">
              <AvatarImage src={user.avatar_url} />
              <AvatarFallback className="text-[11px]">{getInitials(user.name || user.email)}</AvatarFallback>
            </Avatar>
            {!sidebarCollapsed && (
              <div className="flex-1 min-w-0">
                <p className="text-xs font-medium text-white truncate">{user.name}</p>
                <p className="text-[10px] text-white/40 truncate">{user.subscription}</p>
              </div>
            )}
          </div>
        )}
        <button
          onClick={handleSignOut}
          className={cn(
            "flex items-center gap-3 w-full px-3 py-2 rounded-lg text-xs text-white/40 hover:text-red-400 hover:bg-red-500/10 transition-colors",
          )}
        >
          <LogOut className="w-4 h-4 flex-shrink-0" />
          {!sidebarCollapsed && <span>Sign Out</span>}
        </button>
        <button
          onClick={toggleSidebar}
          className="flex items-center gap-3 w-full px-3 py-2 rounded-lg text-xs text-white/30 hover:text-white hover:bg-white/5 transition-colors"
        >
          {sidebarCollapsed ? (
            <ChevronRight className="w-4 h-4" />
          ) : (
            <>
              <ChevronLeft className="w-4 h-4" />
              <span>Collapse</span>
            </>
          )}
        </button>
      </div>
    </aside>
  );
}

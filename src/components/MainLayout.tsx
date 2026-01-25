import React from "react";
import { TopNavigation } from "./TopNavigation";
import { AppSidebar } from "./AppSidebar";
import { SidebarProvider } from "./ui/sidebar";

export function MainLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen flex-col bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 font-sans text-slate-900">
      <div className="sticky top-0 z-50 w-full"><TopNavigation /></div>
      <SidebarProvider defaultOpen={true} className="flex-1 flex overflow-hidden h-[calc(100vh-64px)]">
        <div className="flex w-full h-full">
          <AppSidebar />
          <main className="flex-1 overflow-y-auto p-4 md:p-6 custom-scrollbar relative">{children}</main>
        </div>
      </SidebarProvider>
    </div>
  );
}
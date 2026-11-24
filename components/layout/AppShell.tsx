import { Suspense } from "react";
import { Sidebar } from "./Sidebar";
import { MobileNav } from "./MobileNav";
import { Header } from "./Header";

export function AppShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen lg:pl-64">
      <Suspense fallback={null}>
        <Sidebar />
      </Suspense>
      <Suspense fallback={<div className="h-[57px] border-b border-line bg-white" />}>
        <Header />
      </Suspense>
      <main className="p-4 pb-24 sm:p-6 sm:pb-24 lg:p-8">{children}</main>
      <Suspense fallback={null}>
        <MobileNav />
      </Suspense>
    </div>
  );
}
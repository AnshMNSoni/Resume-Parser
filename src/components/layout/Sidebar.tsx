'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState } from 'react';
import { Home, FileUp, Files, Users, Menu, X, Rocket } from 'lucide-react';

const navItems = [
  {
    label: 'Dashboard',
    href: '/',
    icon: <Home className="w-5 h-5" strokeWidth={1.8} />,
  },
  {
    label: 'Upload Resume',
    href: '/upload',
    icon: <FileUp className="w-5 h-5" strokeWidth={1.8} />,
  },
  {
    label: 'Bulk Upload',
    href: '/upload/bulk',
    icon: <Files className="w-5 h-5" strokeWidth={1.8} />,
  },
  {
    label: 'Candidates',
    href: '/candidates',
    icon: <Users className="w-5 h-5" strokeWidth={1.8} />,
  },
];

export function Sidebar() {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <>
      {/* Mobile menu button */}
      <button
        id="mobile-menu-toggle"
        onClick={() => setMobileOpen(!mobileOpen)}
        className="fixed top-4 right-4 z-50 md:hidden glass rounded-xl p-2.5 hover:bg-white/5 transition-all"
        aria-label="Toggle navigation"
      >
        {mobileOpen ? (
          <X className="w-5 h-5" strokeWidth={2} />
        ) : (
          <Menu className="w-5 h-5" strokeWidth={2} />
        )}
      </button>

      {/* Overlay */}
      {mobileOpen && (
        <div
          className="fixed inset-0 z-30 bg-black/60 md:hidden"
          onClick={() => setMobileOpen(false)}
        />
      )}

      <aside
        className={`fixed top-0 z-40 h-full w-64 glass-strong flex flex-col transition-transform duration-300 ease-in-out ${
          mobileOpen ? 'translate-x-0' : 'translate-x-full'
        } right-0 md:left-0 md:right-auto md:translate-x-0`}
      >
        {/* Logo */}
        <div className="p-6 pb-2">
          <Link href="/" className="flex items-center gap-3 group" onClick={() => setMobileOpen(false)}>
            <div className="w-10 h-10 rounded-xl bg-accent-emerald/20 flex items-center justify-center shadow-lg group-hover:shadow-[0_0_20px_rgba(52,211,153,0.3)] transition-shadow">
              <Rocket className="w-5 h-5 text-accent-emerald" strokeWidth={2} />
            </div>
            <div>
              <h1 className="text-lg font-bold text-white">HireLens</h1>
              <p className="text-[10px] text-dark-400 font-medium tracking-wider uppercase">AI Resume Intel</p>
            </div>
          </Link>
        </div>

        {/* Divider */}
        <div className="mx-5 my-3 h-px bg-dark-700" />

        {/* Navigation */}
        <nav className="flex-1 px-3 py-2 space-y-1">
          {navItems.map((item) => {
            const isActive =
              item.href === '/'
                ? pathname === '/'
                : pathname.startsWith(item.href);

            return (
              <Link
                key={item.href}
                href={item.href}
                id={`nav-${item.label.toLowerCase().replace(/\s+/g, '-')}`}
                onClick={() => setMobileOpen(false)}
                className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200 group relative overflow-hidden ${
                  isActive
                    ? 'text-white bg-accent-emerald/10 shadow-lg shadow-accent-emerald/5'
                    : 'text-dark-300 hover:text-dark-100 hover:bg-white/[0.03]'
                }`}
              >
                {/* Active indicator */}
                {isActive && (
                  <div className="absolute left-0 top-1/2 -translate-y-1/2 w-[3px] h-7 rounded-r-full bg-accent-emerald" />
                )}
                <span className={isActive ? 'text-accent-emerald' : 'text-dark-400 group-hover:text-dark-200 transition-colors'}>
                  {item.icon}
                </span>
                {item.label}
              </Link>
            );
          })}
        </nav>

        {/* Footer */}
        <div className="p-4">
          <div className="bg-dark-800/50 border border-white/5 rounded-xl p-4">
            <div className="flex items-center gap-2 mb-2">
              <div className="w-2 h-2 rounded-full bg-accent-emerald animate-pulse" />
              <span className="text-xs text-dark-300 font-medium">AI Engine Active</span>
            </div>
            <p className="text-[11px] text-dark-400 leading-relaxed">
              Minimal UI System
            </p>
          </div>
        </div>
      </aside>
    </>
  );
}

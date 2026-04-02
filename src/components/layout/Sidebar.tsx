'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState } from 'react';

const navItems = [
  {
    label: 'Dashboard',
    href: '/',
    icon: (
      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
      </svg>
    ),
  },
  {
    label: 'Upload Resume',
    href: '/upload',
    icon: (
      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
      </svg>
    ),
  },
  {
    label: 'Bulk Upload',
    href: '/upload/bulk',
    icon: (
      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
      </svg>
    ),
  },
  {
    label: 'Candidates',
    href: '/candidates',
    icon: (
      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
      </svg>
    ),
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
        className="fixed top-4 left-4 z-50 md:hidden glass rounded-xl p-2.5 hover:bg-white/5 transition-all"
        aria-label="Toggle navigation"
      >
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          {mobileOpen ? (
            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
          ) : (
            <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
          )}
        </svg>
      </button>

      {/* Overlay */}
      {mobileOpen && (
        <div
          className="fixed inset-0 z-30 bg-black/60 md:hidden"
          onClick={() => setMobileOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed top-0 left-0 z-40 h-full w-64 glass-strong flex flex-col transition-transform duration-300 ease-in-out ${
          mobileOpen ? 'translate-x-0' : '-translate-x-full'
        } md:translate-x-0`}
      >
        {/* Logo */}
        <div className="p-6 pb-2">
          <Link href="/" className="flex items-center gap-3 group" onClick={() => setMobileOpen(false)}>
            <div className="w-10 h-10 rounded-xl gradient-accent flex items-center justify-center shadow-lg group-hover:shadow-[0_0_20px_rgba(99,102,241,0.3)] transition-shadow">
              <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
              </svg>
            </div>
            <div>
              <h1 className="text-lg font-bold gradient-text">HireLens</h1>
              <p className="text-[10px] text-dark-400 font-medium tracking-wider uppercase">AI Resume Intel</p>
            </div>
          </Link>
        </div>

        {/* Divider */}
        <div className="mx-5 my-3 h-px bg-gradient-to-r from-transparent via-dark-600 to-transparent" />

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
                    ? 'text-white bg-gradient-to-r from-accent-blue/15 to-accent-purple/10 shadow-lg shadow-accent-blue/5'
                    : 'text-dark-300 hover:text-dark-100 hover:bg-white/[0.03]'
                }`}
              >
                {/* Active indicator */}
                {isActive && (
                  <div className="absolute left-0 top-1/2 -translate-y-1/2 w-[3px] h-7 rounded-r-full gradient-accent" />
                )}
                <span className={isActive ? 'text-accent-blue' : 'text-dark-400 group-hover:text-dark-200 transition-colors'}>
                  {item.icon}
                </span>
                {item.label}
              </Link>
            );
          })}
        </nav>

        {/* Footer */}
        <div className="p-4">
          <div className="gradient-card rounded-xl p-4">
            <div className="flex items-center gap-2 mb-2">
              <div className="w-2 h-2 rounded-full bg-accent-emerald animate-pulse" />
              <span className="text-xs text-dark-300 font-medium">AI Engine Active</span>
            </div>
            <p className="text-[11px] text-dark-400 leading-relaxed">
              Powered by Google Gemini for intelligent resume analysis.
            </p>
          </div>
        </div>
      </aside>
    </>
  );
}

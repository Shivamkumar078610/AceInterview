"use client";

import Link from "next/link";
import { useSession } from "next-auth/react";

export function Navbar() {
  const { data: session } = useSession();

  return (
    <nav className="bg-surface/80 backdrop-blur-xl fixed top-0 w-full z-50 border-b border-white/10 shadow-[0_8px_32px_0_rgba(0,0,0,0.3)] transition-all duration-500 ease-in-out">
      <div className="flex justify-between items-center px-6 py-4 max-w-7xl mx-auto md:px-12">
        {/* Logo */}
        <Link href="/" className="flex items-center group">
          <img src="/logo.png?v=2" alt="AceInterview AI" className="h-12 w-auto object-contain" />
        </Link>

        {/* Desktop Nav */}
        <div className="hidden md:flex gap-8 items-center">
          <Link
            className="text-primary font-bold border-b-2 border-primary pb-1 font-body-md text-body-md hover:bg-white/5 transition-all duration-300 px-2 rounded-t"
            href="/dashboard"
          >
            Dashboard
          </Link>
          <Link
            className="text-on-surface-variant hover:text-white transition-colors font-body-md text-body-md hover:bg-white/5 transition-all duration-300 px-2 rounded"
            href="/interview/new"
          >
            Practice
          </Link>
          <Link
            className="text-on-surface-variant hover:text-white transition-colors font-body-md text-body-md hover:bg-white/5 transition-all duration-300 px-2 rounded"
            href="/analytics"
          >
            Insights
          </Link>
          <Link
            className="text-on-surface-variant hover:text-white transition-colors font-body-md text-body-md hover:bg-white/5 transition-all duration-300 px-2 rounded"
            href="/pricing"
          >
            Pricing
          </Link>
        </div>

        {/* CTA Buttons */}
        <div className="flex gap-4">
          {session ? (
            <Link href="/dashboard" className="btn-primary">
              Dashboard
            </Link>
          ) : (
            <>
              <Link href="/login" className="hidden md:block btn-secondary flex items-center justify-center">
                Sign In
              </Link>
              <Link href="/signup" className="btn-primary flex items-center justify-center">
                Get Started
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}

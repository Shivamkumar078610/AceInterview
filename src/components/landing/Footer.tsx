"use client";

import Link from "next/link";

export function Footer() {
  return (
    <footer className="bg-surface-container-lowest/80 backdrop-blur-md w-full py-20 border-t border-white/5 flex flex-col items-center gap-6 max-w-7xl mx-auto px-6">
      <Link href="/" className="mb-4">
        <img src="/logo.png?v=2" alt="AceInterview AI" className="h-12 w-auto object-contain" />
      </Link>
      
      <div className="flex flex-wrap justify-center gap-8 mb-4">
        <Link className="text-on-surface-variant hover:text-primary transition-colors font-body-md text-sm" href="/privacy">
          Privacy Policy
        </Link>
        <Link className="text-on-surface-variant hover:text-primary transition-colors font-body-md text-sm" href="/terms">
          Terms of Service
        </Link>
        <Link className="text-on-surface-variant hover:text-primary transition-colors font-body-md text-sm" href="/ethics">
          AI Ethics
        </Link>
        <Link className="text-on-surface-variant hover:text-primary transition-colors font-body-md text-sm" href="/contact">
          Contact
        </Link>
      </div>

      <div className="text-tertiary font-body-md text-xs text-center opacity-60">
        © {new Date().getFullYear()} AceInterview AI. Engineered for Excellence.
      </div>
    </footer>
  );
}

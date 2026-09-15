'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function SiteHeader() {
  const pathname = usePathname();

  return (
    <nav className="navbar-wrapper">
      <div className="navbar-inner">
        <Link href="/" className="logo-circle" style={{ background: 'transparent', border: 'none', padding: 0 }}>
          <img src="/logo.png" alt="ProjectCortex Logo" style={{ width: '32px', height: '32px', borderRadius: '8px' }} />
        </Link>
        
        <div className="nav-links-pill">
          <Link href="/" className={pathname === '/' ? 'active' : ''}>Home</Link>
          <Link href="/#features">Features</Link>
          <Link href="/setup-guide" className={pathname === '/setup-guide' ? 'active' : ''}>Setup Guide</Link>
          <a href="https://t.me/roshhellwett" target="_blank" rel="noopener noreferrer">Pricing</a>
          <Link href="/privacy" className={pathname === '/privacy' ? 'active' : ''}>Privacy</Link>
        </div>
        
        <a href="https://t.me/roshhellwett" target="_blank" rel="noopener noreferrer" className="nav-btn">Get License</a>
      </div>
    </nav>
  );
}

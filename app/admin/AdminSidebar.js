'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { LayoutDashboard, Briefcase, FileText, User } from 'lucide-react';
import { signOut } from 'next-auth/react';

export default function AdminSidebar() {
  const pathname = usePathname();

  const navItems = [
    { label: 'Dashboard', href: '/admin', icon: LayoutDashboard },
    { label: 'Profile Settings', href: '/admin/profile', icon: User },
    { label: 'Work Experience', href: '/admin/experience', icon: Briefcase },
    { label: 'Projects', href: '/admin/projects', icon: FileText },
  ];

  return (
    <aside className="admin-sidebar">
      <div className="admin-logo">
        <h2>CMS Dashboard</h2>
      </div>
      <nav className="admin-nav">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.href;
          return (
            <Link key={item.href} href={item.href} className={`admin-nav-item ${isActive ? 'active' : ''}`}>
              <Icon size={20} />
              <span>{item.label}</span>
            </Link>
          );
        })}
      </nav>
      <div className="admin-logout">
        <button onClick={() => signOut()} className="logout-btn">Log Out</button>
      </div>
    </aside>
  );
}

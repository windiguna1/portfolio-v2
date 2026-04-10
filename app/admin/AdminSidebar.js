'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { LayoutDashboard, Briefcase, FileText, User, LogOut, Calendar, Cpu } from 'lucide-react';
import { signOut } from 'next-auth/react';

export default function AdminSidebar() {
  const pathname = usePathname();

  const navItems = [
    { label: 'Dashboard', href: '/admin', icon: LayoutDashboard },
    { label: 'Profile Settings', href: '/admin/profile', icon: User },
    { label: 'Work Experience', href: '/admin/experience', icon: Briefcase },
    { label: 'Projects', href: '/admin/projects', icon: FileText },
    { label: 'Activities', href: '/admin/activities', icon: Calendar },
    { label: 'Tech Stack', href: '/admin/techs', icon: Cpu },
  ];

  return (
    <aside className="w-64 bg-white border-r border-gray-200 flex flex-col sticky top-0 h-screen shrink-0">
      <div className="p-6 border-b border-gray-200">
        <div className="font-bold text-xl tracking-tight text-gray-900">Portfolio CMS</div>
      </div>
      
      <nav className="flex-grow py-6 px-4 flex flex-col gap-2">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.href;
          
          return (
            <Link 
              key={item.href} 
              href={item.href}
              className={`flex items-center gap-3 px-4 py-3 rounded-lg font-medium transition-all ${
                isActive 
                  ? 'bg-blue-50 text-blue-600' 
                  : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
              }`}
            >
              <Icon size={20} />
              {item.label}
            </Link>
          );
        })}
      </nav>

      <div className="p-4 border-t border-gray-200">
        <button 
          onClick={() => signOut({ callbackUrl: '/' })}
          className="flex items-center justify-center gap-2 w-full px-4 py-3 text-sm font-semibold rounded-lg text-red-600 border border-red-200 hover:bg-red-50 hover:border-red-300 transition-colors"
        >
          <LogOut size={18} />
          Sign Out
        </button>
      </div>
    </aside>
  );
}

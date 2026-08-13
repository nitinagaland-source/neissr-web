import React, { useEffect, useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { signOut } from '../../lib/auth';
import { collection, query, where, onSnapshot } from 'firebase/firestore';
import { db } from '../../lib/firebase';
import { toast } from 'sonner';
import {
  LayoutDashboard,
  Home,
  Info,
  MessageSquare,
  ClipboardList,
  TrendingUp,
  Users,
  FileText,
  Newspaper,
  Calendar,
  Award,
  Shield,
  MessageCircle,
  Image as ImageIcon,
  BookOpen,
  Star,
  Inbox,
  Settings,
  UserCog,
  LogOut,
  X,
  Building,
  GraduationCap,
  Briefcase
} from 'lucide-react';

interface AdminSidebarProps {
  mobileOpen?: boolean;
  onClose?: () => void;
}

export default function AdminSidebar({ mobileOpen = false, onClose }: AdminSidebarProps) {
  const { user, role } = useAuth();
  const navigate = useNavigate();
  const [unreadEnquiriesCount, setUnreadEnquiriesCount] = useState(0);

  useEffect(() => {
    const q = query(collection(db, 'enquiries'), where('status', '==', 'new'));
    const unsubscribe = onSnapshot(
      q,
      (snap) => {
        setUnreadEnquiriesCount(snap.size);
      },
      () => {
        // Silent error
      }
    );
    return () => unsubscribe();
  }, []);

  const handleSignOut = async () => {
    try {
      await signOut();
      toast.success('Signed out successfully.');
      navigate('/admin/login');
    } catch {
      toast.error('Failed to sign out.');
    }
  };

  const navGroups = [
    {
      items: [
        { label: 'Dashboard', href: '/admin', icon: LayoutDashboard, end: true },
      ],
    },
    {
      header: 'Page Content',
      items: [
        { label: 'Home Editor', href: '/admin/content/home', icon: Home },
        { label: 'About Editor', href: '/admin/content/about', icon: Info },
        { label: 'Messages', href: '/admin/content/messages', icon: MessageSquare },
        { label: 'Admissions', href: '/admin/content/admissions', icon: ClipboardList },
        { label: 'Placement', href: '/admin/content/placement', icon: TrendingUp },
        { label: 'Infrastructure', href: '/admin/content/infrastructure', icon: Building },
        { label: 'Academics', href: '/admin/content/academics', icon: GraduationCap },
      ],
    },
    {
      header: 'Collections',
      items: [
        { label: 'Faculty & Staff', href: '/admin/faculty', icon: Users },
        { label: 'Documents', href: '/admin/documents', icon: FileText },
        { label: 'News Articles', href: '/admin/news', icon: Newspaper },
        { label: 'Events', href: '/admin/events', icon: Calendar },
        { label: 'Achievements', href: '/admin/achievements', icon: Award },
        { label: 'Clubs', href: '/admin/clubs', icon: Shield },
        { label: 'Forums', href: '/admin/forums', icon: MessageCircle },
        { label: 'Placements Records', href: '/admin/placements', icon: Briefcase },
        { label: 'Gallery', href: '/admin/gallery', icon: ImageIcon },
        { label: 'Magazines', href: '/admin/magazines', icon: BookOpen },
        { label: 'Students Council', href: '/admin/students-council', icon: Star },
      ],
    },
    {
      header: 'Submissions',
      items: [
        {
          label: 'Enquiries',
          href: '/admin/enquiries',
          icon: Inbox,
          badge: unreadEnquiriesCount > 0 ? unreadEnquiriesCount : undefined,
        },
      ],
    },
    {
      header: 'System',
      items: [
        { label: 'Site Settings', href: '/admin/settings', icon: Settings },
        ...(role === 'super-admin'
          ? [{ label: 'Admin Users', href: '/admin/users', icon: UserCog }]
          : []),
      ],
    },
  ];

  return (
    <>
      {/* Mobile Backdrop Overlay */}
      {mobileOpen && (
        <div
          onClick={onClose}
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 md:hidden animate-in fade-in duration-200"
        />
      )}

      {/* Sidebar container */}
      <aside
        className={`fixed top-0 left-0 bottom-0 w-[260px] bg-neutral-900 text-neutral-100 flex flex-col z-50 transition-transform duration-300 md:translate-x-0 ${
          mobileOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'
        }`}
      >
        {/* Sidebar Header */}
        <div className="h-16 px-5 border-b border-neutral-800 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-[#C8102E] text-white flex items-center justify-center font-bold text-sm shadow-md">
              N
            </div>
            <div>
              <span className="font-bold text-sm tracking-wide block font-sans text-white">
                NEISSR
              </span>
              <span className="text-[10px] text-neutral-400 uppercase tracking-widest block font-mono">
                Admin Panel
              </span>
            </div>
          </div>

          <button
            onClick={onClose}
            className="md:hidden text-neutral-400 hover:text-white p-1 rounded-lg"
            title="Close Menu"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Navigation List */}
        <div className="flex-1 overflow-y-auto py-4 px-3 space-y-6 scrollbar-thin scrollbar-thumb-neutral-700">
          {navGroups.map((group, gIdx) => (
            <div key={gIdx} className="space-y-1">
              {group.header && (
                <div className="px-3 text-[10px] font-bold uppercase tracking-widest text-neutral-500 mb-1">
                  {group.header}
                </div>
              )}

              {group.items.map((item) => {
                const Icon = item.icon;
                return (
                  <NavLink
                    key={item.href}
                    to={item.href}
                    end={'end' in item ? item.end : false}
                    onClick={() => onClose && onClose()}
                    className={({ isActive }) =>
                      `flex items-center justify-between px-3 py-2 text-xs font-semibold rounded-lg transition-colors group ${
                        isActive
                          ? 'bg-[#C8102E] text-white shadow-sm'
                          : 'text-neutral-300 hover:bg-neutral-800 hover:text-white'
                      }`
                    }
                  >
                    <div className="flex items-center gap-3">
                      <Icon className="w-4 h-4 shrink-0" />
                      <span>{item.label}</span>
                    </div>

                    {item.badge !== undefined && (
                      <span className="bg-red-500 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full">
                        {item.badge}
                      </span>
                    )}
                  </NavLink>
                );
              })}
            </div>
          ))}
        </div>

        {/* Sidebar Footer User Info */}
        <div className="p-4 border-t border-neutral-800 bg-neutral-950/60 shrink-0 space-y-3">
          <div className="flex items-center justify-between text-xs">
            <div className="truncate pr-2">
              <p className="font-semibold text-white truncate">{user?.email}</p>
              <p className="text-[10px] text-neutral-400 uppercase tracking-wider">
                {role || 'Administrator'}
              </p>
            </div>
          </div>

          <button
            onClick={handleSignOut}
            className="w-full flex items-center justify-center gap-2 px-3 py-1.5 bg-neutral-800 hover:bg-red-900/40 hover:text-red-300 text-neutral-300 text-xs font-semibold rounded-lg transition-colors border border-neutral-700/60"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>Sign Out</span>
          </button>
        </div>
      </aside>
    </>
  );
}

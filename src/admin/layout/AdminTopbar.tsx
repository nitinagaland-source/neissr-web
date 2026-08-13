import React from 'react';
import * as DropdownMenu from '@radix-ui/react-dropdown-menu';
import { useAuth } from '../../context/AuthContext';
import { signOut } from '../../lib/auth';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { Menu, LogOut, User, ShieldCheck } from 'lucide-react';

interface AdminTopbarProps {
  title?: string;
  onMenuClick?: () => void;
}

export default function AdminTopbar({ title = 'Dashboard', onMenuClick }: AdminTopbarProps) {
  const { user, role } = useAuth();
  const navigate = useNavigate();

  const handleSignOut = async () => {
    try {
      await signOut();
      toast.success('Signed out.');
      navigate('/admin/login');
    } catch {
      toast.error('Failed to sign out.');
    }
  };

  const userInitial = user?.email ? user.email.charAt(0).toUpperCase() : 'A';

  return (
    <header className="bg-white border-b border-neutral-200 h-16 px-4 md:px-8 flex items-center justify-between sticky top-0 z-30 shadow-xs">
      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={onMenuClick}
          className="md:hidden text-neutral-600 hover:text-neutral-900 p-2 rounded-lg hover:bg-neutral-100 transition-colors"
          title="Open menu"
        >
          <Menu className="w-5 h-5" />
        </button>

        <h1 className="text-base md:text-lg font-bold text-neutral-900 font-sans tracking-tight">
          {title}
        </h1>
      </div>

      <div className="flex items-center gap-3">
        <DropdownMenu.Root>
          <DropdownMenu.Trigger asChild>
            <button
              className="flex items-center gap-2 p-1 pl-2 pr-3 rounded-full border border-neutral-200 hover:bg-neutral-50 transition-colors focus:outline-none"
              title="User Account"
            >
              <div className="w-7 h-7 rounded-full bg-[#003DA5] text-white flex items-center justify-center text-xs font-bold shadow-xs">
                {userInitial}
              </div>
              <span className="text-xs font-semibold text-neutral-700 hidden sm:inline truncate max-w-[140px]">
                {user?.email}
              </span>
            </button>
          </DropdownMenu.Trigger>

          <DropdownMenu.Portal>
            <DropdownMenu.Content
              align="end"
              sideOffset={8}
              className="bg-white rounded-xl border border-neutral-200 p-2 shadow-xl w-56 z-50 animate-in fade-in zoom-in-95 duration-150 space-y-1"
            >
              <div className="px-3 py-2 border-b border-neutral-100">
                <p className="text-xs font-bold text-neutral-900 truncate">{user?.email}</p>
                <div className="flex items-center gap-1 text-[10px] text-neutral-500 mt-0.5 font-medium uppercase tracking-wider">
                  <ShieldCheck className="w-3 h-3 text-[#003DA5]" />
                  {role || 'Admin'}
                </div>
              </div>

              <DropdownMenu.Item
                onClick={handleSignOut}
                className="flex items-center gap-2 px-3 py-2 text-xs font-semibold text-red-600 rounded-lg hover:bg-red-50 cursor-pointer focus:outline-none transition-colors"
              >
                <LogOut className="w-4 h-4" />
                <span>Sign Out</span>
              </DropdownMenu.Item>
            </DropdownMenu.Content>
          </DropdownMenu.Portal>
        </DropdownMenu.Root>
      </div>
    </header>
  );
}

import React, { useState } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import AdminSidebar from './AdminSidebar';
import AdminTopbar from './AdminTopbar';

export default function AdminLayout() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const location = useLocation();

  // Map path to human friendly title
  const getPageTitle = (path: string): string => {
    if (path === '/admin') return 'Dashboard';
    if (path.includes('/admin/content/home')) return 'Home Page Content Editor';
    if (path.includes('/admin/content/about')) return 'About Page Content Editor';
    if (path.includes('/admin/content/messages')) return 'Messages Content Editor';
    if (path.includes('/admin/content/admissions')) return 'Admissions Content Editor';
    if (path.includes('/admin/content/placement')) return 'Placement Records Editor';
    if (path.includes('/admin/faculty')) return 'Faculty & Staff Directory';
    if (path.includes('/admin/documents')) return 'Documents Repository';
    if (path.includes('/admin/news')) return 'News & Announcements';
    if (path.includes('/admin/events')) return 'Events Calendar';
    if (path.includes('/admin/achievements')) return 'Student & Staff Achievements';
    if (path.includes('/admin/clubs')) return 'Student Clubs';
    if (path.includes('/admin/forums')) return 'Academic Forums';
    if (path.includes('/admin/gallery')) return 'Photo Gallery';
    if (path.includes('/admin/magazines')) return 'Annual Magazines';
    if (path.includes('/admin/students-council')) return 'Students Council';
    if (path.includes('/admin/enquiries')) return 'Student Enquiries';
    if (path.includes('/admin/settings')) return 'Site Settings';
    if (path.includes('/admin/users')) return 'User Access Management';
    return 'Admin Panel';
  };

  const title = getPageTitle(location.pathname);

  return (
    <div className="min-h-screen flex bg-neutral-50 font-sans text-neutral-900 antialiased">
      <AdminSidebar mobileOpen={mobileOpen} onClose={() => setMobileOpen(false)} />

      <div className="flex-1 flex flex-col md:ml-[260px] min-w-0 transition-all">
        <AdminTopbar title={title} onMenuClick={() => setMobileOpen(true)} />
        <main className="flex-1 p-4 md:p-8 max-w-[1600px] w-full mx-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
}

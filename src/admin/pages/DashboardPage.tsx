import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { collection, getDocs, query, orderBy, limit, doc, updateDoc } from 'firebase/firestore';
import { db, isFirebaseConfigured } from '../../lib/firebase';
import { SEED_FACULTY } from '../../data/seedData';
import { Link } from 'react-router-dom';
import AdminCard from '../components/AdminCard';
import AdminTable, { Column } from '../components/AdminTable';
import StatusBadge from '../components/StatusBadge';
import { formatDate } from '../../lib/date';
import { toast } from 'sonner';
import {
  Users,
  FileText,
  Newspaper,
  Calendar,
  Inbox,
  Plus,
  Image as ImageIcon,
  Settings,
  CheckCircle2
} from 'lucide-react';

interface EnquiryRecord {
  id: string;
  fullName: string;
  phone: string;
  email: string;
  programmeInterested: string;
  sourcePage: string;
  status: string;
  createdAt: { seconds: number } | null;
}

export default function DashboardPage() {
  const { data: stats, isLoading: loadingStats } = useQuery({
    queryKey: ['admin-dashboard-stats'],
    queryFn: async () => {
      if (!isFirebaseConfigured) {
        return {
          facultyCount: SEED_FACULTY.length,
          documentsCount: 8,
          newsCount: 3,
          eventsCount: 3,
          enquiriesCount: 0,
          unreadEnquiries: 0,
        };
      }
      const [facSnap, docSnap, newsSnap, eventSnap, enqSnap] = await Promise.all([
        getDocs(collection(db, 'faculty')),
        getDocs(collection(db, 'documents')),
        getDocs(collection(db, 'news')),
        getDocs(collection(db, 'events')),
        getDocs(collection(db, 'enquiries')),
      ]);

      const unreadEnquiries = enqSnap.docs.filter(
        (d) => d.data().status === 'new'
      ).length;

      return {
        facultyCount: facSnap.size,
        documentsCount: docSnap.size,
        newsCount: newsSnap.size,
        eventsCount: eventSnap.size,
        enquiriesCount: enqSnap.size,
        unreadEnquiries,
      };
    },
  });

  const { data: recentFaculty = [], isLoading: loadingFaculty } = useQuery({
    queryKey: ['admin-dashboard-faculty'],
    queryFn: async () => {
      if (!isFirebaseConfigured) {
        return SEED_FACULTY.slice(0, 6);
      }
      const snap = await getDocs(
        query(collection(db, 'faculty'), orderBy('order', 'asc'), limit(6))
      );
      if (snap.empty) return SEED_FACULTY.slice(0, 6);
      return snap.docs.map((d) => ({ id: d.id, ...d.data() }));
    },
  });

  const {
    data: recentEnquiries = [],
    isLoading: loadingEnquiries,
    refetch: refetchEnquiries,
  } = useQuery({
    queryKey: ['admin-recent-enquiries'],
    queryFn: async () => {
      if (!isFirebaseConfigured) return [];
      const q = query(collection(db, 'enquiries'), orderBy('createdAt', 'desc'), limit(5));
      const snap = await getDocs(q);
      return snap.docs.map((d) => ({
        id: d.id,
        ...d.data(),
      })) as EnquiryRecord[];
    },
  });

  const handleMarkRead = async (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    try {
      await updateDoc(doc(db, 'enquiries', id), { status: 'read' });
      toast.success('Marked enquiry as read.');
      refetchEnquiries();
    } catch {
      toast.error('Failed to update status.');
    }
  };

  const enquiryColumns: Column<EnquiryRecord>[] = [
    {
      key: 'fullName',
      label: 'Full Name',
      render: (r) => (
        <div>
          <span className="font-bold text-neutral-900 block">{r.fullName}</span>
          <span className="text-[10px] text-neutral-500">{r.email}</span>
        </div>
      ),
    },
    {
      key: 'phone',
      label: 'Phone Number',
      render: (r) => <span>{r.phone || 'N/A'}</span>,
    },
    {
      key: 'programmeInterested',
      label: 'Programme',
      render: (r) => <span className="font-semibold text-[#003DA5]">{r.programmeInterested}</span>,
    },
    {
      key: 'createdAt',
      label: 'Submitted Date',
      render: (r) => (
        <span className="text-neutral-500">
          {r.createdAt ? formatDate(new Date(r.createdAt.seconds * 1000).toISOString()) : 'Recent'}
        </span>
      ),
    },
    {
      key: 'status',
      label: 'Status',
      render: (r) => <StatusBadge status={r.status} />,
    },
    {
      key: 'actions',
      label: 'Actions',
      render: (r) =>
        r.status === 'new' ? (
          <button
            onClick={(e) => handleMarkRead(r.id, e)}
            className="inline-flex items-center gap-1 text-[11px] font-bold text-green-700 hover:text-green-800 bg-green-50 px-2 py-1 rounded border border-green-200 transition-colors"
          >
            <CheckCircle2 className="w-3.5 h-3.5" />
            Mark Read
          </button>
        ) : (
          <span className="text-[11px] text-neutral-400 font-medium">Completed</span>
        ),
    },
  ];

  return (
    <div className="space-y-8">
      {/* Top Banner / Welcome */}
      <div className="bg-[#003DA5] text-white rounded-2xl p-6 md:p-8 shadow-md flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="space-y-1">
          <h2 className="text-xl md:text-2xl font-bold font-sans">
            Welcome to NEISSR Management Portal
          </h2>
          <p className="text-xs text-neutral-200">
            Publish academic notices, faculty updates, events, magazines, and manage student enquiries.
          </p>
        </div>

        <Link
          to="/admin/enquiries"
          className="inline-flex items-center gap-2 bg-[#C8102E] hover:bg-[#9A0C24] text-white text-xs font-bold px-4 py-2.5 rounded-xl shadow-sm transition-all shrink-0"
        >
          <Inbox className="w-4 h-4" />
          View All Enquiries{stats?.unreadEnquiries ? ` (${stats.unreadEnquiries} New)` : ''}
        </Link>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        <AdminCard
          label="Faculty Members"
          value={loadingStats ? '...' : (stats?.facultyCount ?? 0)}
          icon={Users}
          color="bg-[#003DA5]"
          href="/admin/faculty"
        />

        <AdminCard
          label="Documents"
          value={loadingStats ? '...' : (stats?.documentsCount ?? 0)}
          icon={FileText}
          color="bg-emerald-600"
          href="/admin/documents"
        />

        <AdminCard
          label="News Articles"
          value={loadingStats ? '...' : (stats?.newsCount ?? 0)}
          icon={Newspaper}
          color="bg-purple-600"
          href="/admin/news"
        />

        <AdminCard
          label="Upcoming Events"
          value={loadingStats ? '...' : (stats?.eventsCount ?? 0)}
          icon={Calendar}
          color="bg-amber-600"
          href="/admin/events"
        />

        <AdminCard
          label="Student Enquiries"
          value={loadingStats ? '...' : (stats?.enquiriesCount ?? 0)}
          icon={Inbox}
          color="bg-[#C8102E]"
          href="/admin/enquiries"
          badge={stats?.unreadEnquiries ? `${stats.unreadEnquiries} NEW` : undefined}
        />
      </div>

      {/* Quick Actions Bar */}
      <div className="bg-white rounded-xl border border-neutral-200 p-6 space-y-4 shadow-sm">
        <h3 className="text-xs font-bold uppercase tracking-wider text-neutral-500">
          Quick Actions
        </h3>

        <div className="flex flex-wrap gap-3">
          <Link
            to="/admin/news/new"
            className="inline-flex items-center gap-2 bg-neutral-100 hover:bg-neutral-200 text-neutral-800 text-xs font-bold px-4 py-2.5 rounded-xl transition-colors border border-neutral-200"
          >
            <Plus className="w-4 h-4 text-[#003DA5]" /> Publish News Article
          </Link>

          <Link
            to="/admin/documents/new"
            className="inline-flex items-center gap-2 bg-neutral-100 hover:bg-neutral-200 text-neutral-800 text-xs font-bold px-4 py-2.5 rounded-xl transition-colors border border-neutral-200"
          >
            <Plus className="w-4 h-4 text-[#003DA5]" /> Upload Document
          </Link>

          <Link
            to="/admin/faculty/new"
            className="inline-flex items-center gap-2 bg-neutral-100 hover:bg-neutral-200 text-neutral-800 text-xs font-bold px-4 py-2.5 rounded-xl transition-colors border border-neutral-200"
          >
            <Plus className="w-4 h-4 text-[#003DA5]" /> Add Faculty Member
          </Link>

          <Link
            to="/admin/gallery"
            className="inline-flex items-center gap-2 bg-neutral-100 hover:bg-neutral-200 text-neutral-800 text-xs font-bold px-4 py-2.5 rounded-xl transition-colors border border-neutral-200"
          >
            <ImageIcon className="w-4 h-4 text-[#003DA5]" /> Manage Gallery
          </Link>

          <Link
            to="/admin/settings"
            className="inline-flex items-center gap-2 bg-neutral-100 hover:bg-neutral-200 text-neutral-800 text-xs font-bold px-4 py-2.5 rounded-xl transition-colors border border-neutral-200"
          >
            <Settings className="w-4 h-4 text-neutral-600" /> Site Settings
          </Link>
        </div>
      </div>

      {/* Faculty Preview Section */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-base font-bold text-neutral-900 font-sans">
            Faculty & Staff Directory
          </h3>
          <Link
            to="/admin/faculty"
            className="text-xs font-bold text-[#003DA5] hover:underline"
          >
            Manage All Faculty →
          </Link>
        </div>

        {loadingFaculty ? (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="bg-white rounded-xl border border-neutral-200 p-4 animate-pulse space-y-2">
                <div className="w-10 h-10 rounded-full bg-neutral-200 mx-auto" />
                <div className="h-2.5 bg-neutral-200 rounded w-3/4 mx-auto" />
                <div className="h-2 bg-neutral-100 rounded w-1/2 mx-auto" />
              </div>
            ))}
          </div>
        ) : recentFaculty.length === 0 ? (
          <div className="bg-white rounded-xl border border-neutral-200 p-8 text-center text-sm text-neutral-400">
            No faculty members found.{' '}
            <Link to="/admin/faculty/new" className="text-[#003DA5] font-semibold hover:underline">
              Add the first one →
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
            {recentFaculty.map((member: any) => (
              <Link
                key={member.id}
                to={`/admin/faculty/${member.id}`}
                className="bg-white rounded-xl border border-neutral-200 p-4 text-center hover:border-[#003DA5] hover:shadow-md transition-all group space-y-2"
              >
                {member.photoUrl ? (
                  <img
                    src={member.photoUrl}
                    alt={member.fullName}
                    className="w-12 h-12 rounded-full object-cover mx-auto border-2 border-neutral-100 group-hover:border-[#003DA5] transition-colors"
                  />
                ) : (
                  <div className="w-12 h-12 rounded-full bg-[#003DA5]/10 text-[#003DA5] flex items-center justify-center mx-auto font-bold text-sm">
                    {(member.fullName || 'N')[0]}
                  </div>
                )}
                <div>
                  <p className="text-[11px] font-bold text-neutral-900 line-clamp-1 leading-tight">
                    {member.fullName}
                  </p>
                  <p className="text-[10px] text-neutral-400 line-clamp-1 mt-0.5">
                    {member.designation}
                  </p>
                </div>
                <span className={`text-[9px] font-bold uppercase px-1.5 py-0.5 rounded-full ${
                  member.status === 'published' || !member.status
                    ? 'bg-green-50 text-green-700'
                    : 'bg-neutral-100 text-neutral-500'
                }`}>
                  {member.status || 'published'}
                </span>
              </Link>
            ))}
          </div>
        )}
      </div>

      {/* Recent Enquiries Table */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-base font-bold text-neutral-900 font-sans">
            Recent Enquiries & Applications
          </h3>

          <Link
            to="/admin/enquiries"
            className="text-xs font-bold text-[#003DA5] hover:underline"
          >
            View All Enquiries &rarr;
          </Link>
        </div>

        <AdminTable
          columns={enquiryColumns}
          data={recentEnquiries}
          loading={loadingEnquiries}
          emptyMessage="No student enquiries received yet."
          getRowId={(r) => r.id}
        />
      </div>
    </div>
  );
}

import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { collection, getDocs, doc, updateDoc } from 'firebase/firestore';
import { db } from '../../lib/firebase';
import { Link, useNavigate } from 'react-router-dom';
import AdminTable, { Column } from '../components/AdminTable';
import StatusBadge from '../components/StatusBadge';
import SearchBar from '../components/SearchBar';
import ConfirmDialog from '../components/ConfirmDialog';
import { logActivity } from '../../lib/activityLog';
import { toast } from 'sonner';
import { Plus, Pencil, Archive, Shield, Users } from 'lucide-react';

interface ClubRecord {
  id: string;
  name: string;
  slug: string;
  facultyAdvisor?: string;
  studentIncharge?: string;
  imageUrl?: string;
  status: string;
}

export default function ClubsListPage() {
  const navigate = useNavigate();
  const [search, setSearch] = useState('');
  const [archiveClubItem, setArchiveClubItem] = useState<ClubRecord | null>(null);
  const [archiving, setArchiving] = useState(false);

  const {
    data: clubsList = [],
    isLoading,
    refetch,
  } = useQuery({
    queryKey: ['admin-clubs-list'],
    queryFn: async () => {
      const snap = await getDocs(collection(db, 'clubs'));
      const items = snap.docs.map((d) => ({
        id: d.id,
        ...d.data(),
      })) as ClubRecord[];
      return items;
    },
  });

  const handleArchiveConfirm = async () => {
    if (!archiveClubItem) return;
    setArchiving(true);
    try {
      await updateDoc(doc(db, 'clubs', archiveClubItem.id), { status: 'draft' });
      await logActivity('archive', 'clubs', archiveClubItem.id);
      toast.success(`Archived club "${archiveClubItem.name}".`);
      setArchiveClubItem(null);
      refetch();
    } catch {
      toast.error('Failed to archive club.');
    } finally {
      setArchiving(false);
    }
  };

  const filtered = clubsList.filter((item) =>
    item.name.toLowerCase().includes(search.toLowerCase())
  );

  const columns: Column<ClubRecord>[] = [
    {
      key: 'imageUrl',
      label: 'Logo',
      width: '60px',
      render: (r) =>
        r.imageUrl ? (
          <img
            src={r.imageUrl}
            alt={r.name}
            className="w-10 h-10 rounded-full object-cover border border-neutral-200"
          />
        ) : (
          <div className="w-10 h-10 rounded-full bg-blue-50 text-[#003DA5] border border-blue-200 flex items-center justify-center">
            <Shield className="w-5 h-5" />
          </div>
        ),
    },
    {
      key: 'name',
      label: 'Club Name',
      render: (r) => (
        <div>
          <span className="font-bold text-neutral-900 block">{r.name}</span>
          <span className="text-[11px] font-mono text-neutral-400">{r.slug}</span>
        </div>
      ),
    },
    {
      key: 'facultyAdvisor',
      label: 'Faculty Advisor',
      render: (r) => (
        <span className="text-xs font-medium text-neutral-700">
          {r.facultyAdvisor || 'N/A'}
        </span>
      ),
    },
    {
      key: 'studentIncharge',
      label: 'Student Convenor',
      render: (r) => (
        <span className="text-xs font-medium text-neutral-600">
          {r.studentIncharge || 'N/A'}
        </span>
      ),
    },
    {
      key: 'status',
      label: 'Status',
      render: (r) => <StatusBadge status={r.status || 'published'} />,
    },
    {
      key: 'actions',
      label: 'Actions',
      width: '100px',
      render: (r) => (
        <div className="flex items-center gap-1.5">
          <button
            onClick={(e) => {
              e.stopPropagation();
              navigate(`/admin/clubs/${r.id}`);
            }}
            className="p-1.5 text-neutral-600 hover:text-[#003DA5] hover:bg-neutral-100 rounded transition-colors"
            title="Edit Club"
          >
            <Pencil className="w-4 h-4" />
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              setArchiveClubItem(r);
            }}
            className="p-1.5 text-neutral-400 hover:text-red-600 hover:bg-red-50 rounded transition-colors"
            title="Archive Club"
          >
            <Archive className="w-4 h-4" />
          </button>
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold font-sans text-neutral-900">
            Student Clubs & Associations ({clubsList.length})
          </h2>
          <p className="text-xs text-neutral-500">
            Manage student-led clubs, faculty advisors, objectives, and active members.
          </p>
        </div>

        <Link
          to="/admin/clubs/new"
          className="inline-flex items-center gap-2 bg-[#C8102E] hover:bg-[#9A0C24] text-white text-xs font-bold px-4 py-2.5 rounded-xl shadow-sm transition-all shrink-0"
        >
          <Plus className="w-4 h-4" /> Add Club
        </Link>
      </div>

      <div className="flex items-center justify-between bg-white p-4 rounded-xl border border-neutral-200 shadow-sm">
        <SearchBar value={search} onChange={setSearch} placeholder="Search club name..." />
      </div>

      <AdminTable
        columns={columns}
        data={filtered}
        loading={isLoading}
        emptyMessage="No clubs registered."
        onRowClick={(r) => navigate(`/admin/clubs/${r.id}`)}
        getRowId={(r) => r.id}
      />

      <ConfirmDialog
        open={Boolean(archiveClubItem)}
        title="Archive Club"
        description={`Are you sure you want to set "${archiveClubItem?.name}" to Draft status?`}
        onConfirm={handleArchiveConfirm}
        onCancel={() => setArchiveClubItem(null)}
        loading={archiving}
        confirmLabel="Archive Club"
      />
    </div>
  );
}

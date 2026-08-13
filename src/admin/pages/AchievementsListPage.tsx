import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { collection, getDocs, doc, updateDoc } from 'firebase/firestore';
import { db } from '../../lib/firebase';
import { Link, useNavigate } from 'react-router-dom';
import AdminTable, { Column } from '../components/AdminTable';
import StatusBadge from '../components/StatusBadge';
import SearchBar from '../components/SearchBar';
import ConfirmDialog from '../components/ConfirmDialog';
import { formatDate } from '../../lib/date';
import { logActivity } from '../../lib/activityLog';
import { toast } from 'sonner';
import { Plus, Pencil, Archive, Award, Image as ImageIcon } from 'lucide-react';

interface AchievementRecord {
  id: string;
  recipientName: string;
  title: string;
  category: 'student' | 'faculty' | 'institutional';
  date: string;
  imageUrl?: string;
  status: string;
}

export default function AchievementsListPage() {
  const navigate = useNavigate();
  const [search, setSearch] = useState('');
  const [archiveAchieveItem, setArchiveAchieveItem] = useState<AchievementRecord | null>(null);
  const [archiving, setArchiving] = useState(false);

  const {
    data: achievementsList = [],
    isLoading,
    refetch,
  } = useQuery({
    queryKey: ['admin-achievements-list'],
    queryFn: async () => {
      const snap = await getDocs(collection(db, 'achievements'));
      const items = snap.docs.map((d) => ({
        id: d.id,
        ...d.data(),
      })) as AchievementRecord[];
      return items.sort((a, b) => new Date(b.date || 0).getTime() - new Date(a.date || 0).getTime());
    },
  });

  const handleArchiveConfirm = async () => {
    if (!archiveAchieveItem) return;
    setArchiving(true);
    try {
      await updateDoc(doc(db, 'achievements', archiveAchieveItem.id), { status: 'draft' });
      await logActivity('archive', 'achievements', archiveAchieveItem.id);
      toast.success(`Archived achievement.`);
      setArchiveAchieveItem(null);
      refetch();
    } catch {
      toast.error('Failed to archive achievement.');
    } finally {
      setArchiving(false);
    }
  };

  const filtered = achievementsList.filter(
    (item) =>
      item.recipientName.toLowerCase().includes(search.toLowerCase()) ||
      item.title.toLowerCase().includes(search.toLowerCase())
  );

  const columns: Column<AchievementRecord>[] = [
    {
      key: 'imageUrl',
      label: 'Photo',
      width: '60px',
      render: (r) =>
        r.imageUrl ? (
          <img
            src={r.imageUrl}
            alt={r.recipientName}
            className="w-10 h-10 rounded-lg object-cover border border-neutral-200"
          />
        ) : (
          <div className="w-10 h-10 rounded-lg bg-amber-50 text-amber-600 border border-amber-200 flex items-center justify-center">
            <Award className="w-5 h-5" />
          </div>
        ),
    },
    {
      key: 'recipientName',
      label: 'Recipient / Entity',
      render: (r) => (
        <div>
          <span className="font-bold text-neutral-900 block">{r.recipientName}</span>
          <span className="text-[11px] text-neutral-500 line-clamp-1">{r.title}</span>
        </div>
      ),
    },
    {
      key: 'category',
      label: 'Category',
      render: (r) => (
        <span className="bg-amber-50 text-amber-800 text-[10px] font-bold uppercase px-2.5 py-0.5 rounded-full border border-amber-200">
          {r.category}
        </span>
      ),
    },
    {
      key: 'date',
      label: 'Date Awarded',
      render: (r) => (
        <span className="text-neutral-500 text-xs">
          {r.date ? formatDate(r.date) : 'N/A'}
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
              navigate(`/admin/achievements/${r.id}`);
            }}
            className="p-1.5 text-neutral-600 hover:text-[#003DA5] hover:bg-neutral-100 rounded transition-colors"
            title="Edit Achievement"
          >
            <Pencil className="w-4 h-4" />
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              setArchiveAchieveItem(r);
            }}
            className="p-1.5 text-neutral-400 hover:text-red-600 hover:bg-red-50 rounded transition-colors"
            title="Archive Achievement"
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
            Student & Staff Achievements ({achievementsList.length})
          </h2>
          <p className="text-xs text-neutral-500">
            Highlight national awards, gold medals, research grants, and athletic accomplishments.
          </p>
        </div>

        <Link
          to="/admin/achievements/new"
          className="inline-flex items-center gap-2 bg-[#C8102E] hover:bg-[#9A0C24] text-white text-xs font-bold px-4 py-2.5 rounded-xl shadow-sm transition-all shrink-0"
        >
          <Plus className="w-4 h-4" /> Add Achievement
        </Link>
      </div>

      <div className="flex items-center justify-between bg-white p-4 rounded-xl border border-neutral-200 shadow-sm">
        <SearchBar
          value={search}
          onChange={setSearch}
          placeholder="Search recipient or award title..."
        />
      </div>

      <AdminTable
        columns={columns}
        data={filtered}
        loading={isLoading}
        emptyMessage="No achievements recorded."
        onRowClick={(r) => navigate(`/admin/achievements/${r.id}`)}
        getRowId={(r) => r.id}
      />

      <ConfirmDialog
        open={Boolean(archiveAchieveItem)}
        title="Archive Achievement"
        description={`Are you sure you want to set this achievement to Draft status?`}
        onConfirm={handleArchiveConfirm}
        onCancel={() => setArchiveAchieveItem(null)}
        loading={archiving}
        confirmLabel="Archive"
      />
    </div>
  );
}

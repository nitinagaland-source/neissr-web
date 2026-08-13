import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { collection, getDocs, doc, deleteDoc } from 'firebase/firestore';
import { db } from '../../lib/firebase';
import { Link, useNavigate } from 'react-router-dom';
import AdminTable, { Column } from '../components/AdminTable';
import StatusBadge from '../components/StatusBadge';
import SearchBar from '../components/SearchBar';
import ConfirmDialog from '../components/ConfirmDialog';
import { logActivity } from '../../lib/activityLog';
import { toast } from 'sonner';
import { Plus, Pencil, Trash2, MessageCircle } from 'lucide-react';

interface ForumItem {
  id: string;
  slug: string;
  title?: string;
  name?: string;
  description: string;
  category?: string;
  status?: 'published' | 'draft';
}

export default function ForumsListPage() {
  const navigate = useNavigate();
  const [search, setSearch] = useState('');
  const [deleteItem, setDeleteItem] = useState<ForumItem | null>(null);
  const [deleting, setDeleting] = useState(false);

  const {
    data: forumsList = [],
    isLoading,
    refetch,
  } = useQuery({
    queryKey: ['admin-forums-list'],
    queryFn: async () => {
      const snap = await getDocs(collection(db, 'forums'));
      const items = snap.docs.map((d) => ({
        id: d.id,
        ...d.data(),
      })) as ForumItem[];
      return items;
    },
  });

  const handleDeleteConfirm = async () => {
    if (!deleteItem) return;
    setDeleting(true);
    try {
      await deleteDoc(doc(db, 'forums', deleteItem.id));
      await logActivity('delete', 'forums', deleteItem.id);
      toast.success(`Deleted forum "${deleteItem.title || deleteItem.name}".`);
      setDeleteItem(null);
      refetch();
    } catch {
      toast.error('Failed to delete forum.');
    } finally {
      setDeleting(false);
    }
  };

  const filteredData = forumsList.filter((item) => {
    const query = search.toLowerCase();
    const title = (item.title || item.name || '').toLowerCase();
    const desc = (item.description || '').toLowerCase();
    return title.includes(query) || desc.includes(query);
  });

  const columns: Column<ForumItem>[] = [
    {
      key: 'title',
      label: 'Forum Name',
      render: (row) => (
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-[#003DA5]/10 text-[#003DA5] flex items-center justify-center font-bold text-xs">
            <MessageCircle className="w-4 h-4" />
          </div>
          <div>
            <div className="font-semibold text-neutral-900 text-xs">{row.title || row.name}</div>
            <div className="text-[10px] text-neutral-500 font-mono">/forums/{row.slug}</div>
          </div>
        </div>
      ),
    },
    {
      key: 'description',
      label: 'Description',
      render: (row) => (
        <p className="text-xs text-neutral-600 line-clamp-2 max-w-md">{row.description}</p>
      ),
    },
    {
      key: 'status',
      label: 'Status',
      render: (row) => <StatusBadge status={row.status || 'published'} />,
    },
    {
      key: 'actions',
      label: 'Actions',
      render: (row) => (
        <div className="flex items-center justify-end gap-1">
          <button
            onClick={() => navigate(`/admin/forums/${row.id}`)}
            className="p-1.5 text-neutral-500 hover:text-[#003DA5] hover:bg-neutral-100 rounded-lg transition-colors"
            title="Edit Forum"
          >
            <Pencil className="w-4 h-4" />
          </button>
          <button
            onClick={() => setDeleteItem(row)}
            className="p-1.5 text-neutral-500 hover:text-[#C8102E] hover:bg-neutral-100 rounded-lg transition-colors"
            title="Delete Forum"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-neutral-900">Forums & Dialogue Hubs</h1>
          <p className="text-xs text-neutral-500 mt-1">
            Manage specialized student dialogue groups, peace initiatives, and research circles.
          </p>
        </div>
        <Link
          to="/admin/forums/new"
          className="inline-flex items-center gap-2 px-4 py-2 bg-[#C8102E] text-white rounded-lg text-xs font-bold hover:bg-[#9A0C24] transition-colors shadow-sm shrink-0"
        >
          <Plus className="w-4 h-4" /> Create Forum
        </Link>
      </div>

      <div className="bg-white p-4 rounded-xl border border-neutral-200 shadow-sm space-y-4">
        <SearchBar
          value={search}
          onChange={setSearch}
          placeholder="Search forum title, category, description..."
        />

        <AdminTable
          columns={columns}
          data={filteredData}
          loading={isLoading}
          emptyMessage="No forums found."
        />
      </div>

      <ConfirmDialog
        open={!!deleteItem}
        title="Delete Forum"
        description={`Are you sure you want to delete "${deleteItem?.title || deleteItem?.name}"? This action cannot be undone.`}
        confirmLabel="Delete Forum"
        dangerous={true}
        loading={deleting}
        onConfirm={handleDeleteConfirm}
        onCancel={() => setDeleteItem(null)}
      />
    </div>
  );
}

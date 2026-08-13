import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { collection, getDocs, doc, updateDoc, deleteDoc } from 'firebase/firestore';
import { db } from '../../lib/firebase';
import { Link, useNavigate } from 'react-router-dom';
import AdminTable, { Column } from '../components/AdminTable';
import StatusBadge from '../components/StatusBadge';
import SearchBar from '../components/SearchBar';
import ConfirmDialog from '../components/ConfirmDialog';
import { logActivity } from '../../lib/activityLog';
import { toast } from 'sonner';
import { Plus, Pencil, Trash2, Briefcase } from 'lucide-react';

interface PlacementRecord {
  id: string;
  fullName: string;
  programme: string;
  batchYear: string;
  organisation: string;
  role: string;
  packageLPA: string;
  status: 'published' | 'draft';
}

export default function PlacementsListPage() {
  const navigate = useNavigate();
  const [search, setSearch] = useState('');
  const [deleteItem, setDeleteItem] = useState<PlacementRecord | null>(null);
  const [deleting, setDeleting] = useState(false);

  const {
    data: placementList = [],
    isLoading,
    refetch,
  } = useQuery({
    queryKey: ['admin-placements-list'],
    queryFn: async () => {
      const snap = await getDocs(collection(db, 'placements'));
      const items = snap.docs.map((d) => ({
        id: d.id,
        ...d.data(),
      })) as PlacementRecord[];
      return items;
    },
  });

  const handleDeleteConfirm = async () => {
    if (!deleteItem) return;
    setDeleting(true);
    try {
      await deleteDoc(doc(db, 'placements', deleteItem.id));
      await logActivity('delete', 'placements', deleteItem.id);
      toast.success(`Deleted placement record for ${deleteItem.fullName}.`);
      setDeleteItem(null);
      refetch();
    } catch {
      toast.error('Failed to delete placement record.');
    } finally {
      setDeleting(false);
    }
  };

  const filteredData = placementList.filter((item) => {
    const query = search.toLowerCase();
    return (
      (item.fullName || '').toLowerCase().includes(query) ||
      (item.organisation || '').toLowerCase().includes(query) ||
      (item.role || '').toLowerCase().includes(query)
    );
  });

  const columns: Column<PlacementRecord>[] = [
    {
      key: 'fullName',
      label: 'Student Name',
      render: (row) => (
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-[#003DA5]/10 text-[#003DA5] flex items-center justify-center font-bold text-xs">
            <Briefcase className="w-4 h-4" />
          </div>
          <div>
            <div className="font-semibold text-neutral-900 text-xs">{row.fullName}</div>
            <div className="text-[10px] text-neutral-500">{row.programme} ({row.batchYear})</div>
          </div>
        </div>
      ),
    },
    {
      key: 'organisation',
      label: 'Recruiting Organisation',
      render: (row) => (
        <div>
          <div className="font-medium text-xs text-neutral-900">{row.organisation}</div>
          <div className="text-[10px] text-neutral-500">{row.role}</div>
        </div>
      ),
    },
    {
      key: 'packageLPA',
      label: 'Package',
      render: (row) => <span className="font-mono text-xs font-semibold text-[#C8102E]">{row.packageLPA || 'N/A'}</span>,
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
            onClick={() => navigate(`/admin/placements/${row.id}`)}
            className="p-1.5 text-neutral-500 hover:text-[#003DA5] hover:bg-neutral-100 rounded-lg transition-colors"
            title="Edit Record"
          >
            <Pencil className="w-4 h-4" />
          </button>
          <button
            onClick={() => setDeleteItem(row)}
            className="p-1.5 text-neutral-500 hover:text-[#C8102E] hover:bg-neutral-100 rounded-lg transition-colors"
            title="Delete Record"
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
          <h1 className="text-2xl font-bold text-neutral-900">Placement Records</h1>
          <p className="text-xs text-neutral-500 mt-1">
            Manage placed alumni, recruiting partners, and graduate career statistics.
          </p>
        </div>
        <Link
          to="/admin/placements/new"
          className="inline-flex items-center gap-2 px-4 py-2 bg-[#C8102E] text-white rounded-lg text-xs font-bold hover:bg-[#9A0C24] transition-colors shadow-sm shrink-0"
        >
          <Plus className="w-4 h-4" /> Add Placement Record
        </Link>
      </div>

      <div className="bg-white p-4 rounded-xl border border-neutral-200 shadow-sm space-y-4">
        <SearchBar
          value={search}
          onChange={setSearch}
          placeholder="Search student, organisation, role..."
        />

        <AdminTable
          columns={columns}
          data={filteredData}
          loading={isLoading}
          emptyMessage="No placement records found."
        />
      </div>

      <ConfirmDialog
        open={!!deleteItem}
        title="Delete Placement Record"
        description={`Are you sure you want to delete the record for "${deleteItem?.fullName}"? This action cannot be undone.`}
        confirmLabel="Delete Record"
        dangerous={true}
        loading={deleting}
        onConfirm={handleDeleteConfirm}
        onCancel={() => setDeleteItem(null)}
      />
    </div>
  );
}

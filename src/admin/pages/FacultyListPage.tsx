import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { collection, getDocs, doc, updateDoc } from 'firebase/firestore';
import { db, isFirebaseConfigured } from '../../lib/firebase';
import { SEED_FACULTY } from '../../data/seedData';
import { Link, useNavigate } from 'react-router-dom';
import AdminTable, { Column } from '../components/AdminTable';
import StatusBadge from '../components/StatusBadge';
import SearchBar from '../components/SearchBar';
import ConfirmDialog from '../components/ConfirmDialog';
import { FacultyMember } from '../../types/neissr';
import { logActivity } from '../../lib/activityLog';
import { toast } from 'sonner';
import { Plus, Pencil, Archive, User } from 'lucide-react';

export default function FacultyListPage() {
  const navigate = useNavigate();
  const [search, setSearch] = useState('');
  const [selectedDept, setSelectedDept] = useState('All');
  const [archiveItem, setArchiveItem] = useState<FacultyMember | null>(null);
  const [archiving, setArchiving] = useState(false);

  const {
    data: facultyList = [],
    isLoading,
    refetch,
  } = useQuery({
    queryKey: ['admin-faculty-list'],
    queryFn: async () => {
      if (!isFirebaseConfigured) {
        return SEED_FACULTY.map((f) => ({ ...f })) as (FacultyMember & { id: string })[];
      }
      const snap = await getDocs(collection(db, 'faculty'));
      if (snap.empty) {
        return SEED_FACULTY.map((f) => ({ ...f })) as (FacultyMember & { id: string })[];
      }
      const items = snap.docs.map((d) => ({
        id: d.id,
        ...d.data(),
      })) as (FacultyMember & { id: string })[];
      return items.sort((a, b) => (a.order ?? 99) - (b.order ?? 99));
    },
  });

  const handleArchiveConfirm = async () => {
    if (!archiveItem) return;
    setArchiving(true);
    try {
      await updateDoc(doc(db, 'faculty', archiveItem.id), {
        status: 'draft',
      });
      await logActivity('archive', 'faculty', archiveItem.id);
      toast.success(`Archived ${archiveItem.fullName}.`);
      setArchiveItem(null);
      refetch();
    } catch {
      toast.error('Failed to archive faculty member.');
    } finally {
      setArchiving(false);
    }
  };

  const departments = ['All', 'Management', 'BSW', 'MSW-CD', 'MSW-YD', 'MSW-SED', 'MSW-PCTS', 'Non-Teaching'];

  const filteredData = facultyList.filter((item) => {
    const matchesSearch =
      item.fullName.toLowerCase().includes(search.toLowerCase()) ||
      item.designation.toLowerCase().includes(search.toLowerCase());
    const matchesDept =
      selectedDept === 'All' || item.department === selectedDept;
    return matchesSearch && matchesDept;
  });

  const columns: Column<FacultyMember & { id: string }>[] = [
    {
      key: 'photo',
      label: 'Photo',
      width: '60px',
      render: (r) =>
        r.photoUrl ? (
          <img
            src={r.photoUrl}
            alt={r.fullName}
            className="w-10 h-10 rounded-full object-cover border border-neutral-200"
          />
        ) : (
          <div className="w-10 h-10 rounded-full bg-neutral-200 text-neutral-500 flex items-center justify-center font-bold text-xs">
            <User className="w-5 h-5 stroke-[1.5]" />
          </div>
        ),
    },
    {
      key: 'fullName',
      label: 'Full Name',
      render: (r) => (
        <div>
          <span className="font-bold text-neutral-900 block">{r.fullName}</span>
          <span className="text-[11px] text-neutral-400">{r.email || 'No email specified'}</span>
        </div>
      ),
    },
    {
      key: 'designation',
      label: 'Designation',
      render: (r) => <span className="font-semibold text-neutral-700">{r.designation}</span>,
    },
    {
      key: 'department',
      label: 'Department',
      render: (r) => (
        <span className="bg-blue-50 text-[#003DA5] text-[10px] font-bold uppercase px-2.5 py-0.5 rounded-full border border-blue-200">
          {r.department}
        </span>
      ),
    },
    {
      key: 'order',
      label: 'Order',
      width: '80px',
      render: (r) => <span className="font-mono text-neutral-500">{r.order ?? 99}</span>,
    },
    {
      key: 'status',
      label: 'Status',
      width: '100px',
      render: (r) => <StatusBadge status={r.status || 'published'} />,
    },
    {
      key: 'actions',
      label: 'Actions',
      width: '120px',
      render: (r) => (
        <div className="flex items-center gap-2">
          <button
            onClick={(e) => {
              e.stopPropagation();
              navigate(`/admin/faculty/${r.id}`);
            }}
            className="p-1.5 text-neutral-600 hover:text-[#003DA5] hover:bg-neutral-100 rounded transition-colors"
            title="Edit Faculty Member"
          >
            <Pencil className="w-4 h-4" />
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              setArchiveItem(r);
            }}
            className="p-1.5 text-neutral-400 hover:text-red-600 hover:bg-red-50 rounded transition-colors"
            title="Archive Faculty Member"
          >
            <Archive className="w-4 h-4" />
          </button>
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      {/* Page Action Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold font-sans text-neutral-900">
            Faculty & Staff Directory ({facultyList.length})
          </h2>
          <p className="text-xs text-neutral-500">
            Manage teaching faculty, department heads, non-teaching staff, and academic profiles.
          </p>
        </div>

        <Link
          to="/admin/faculty/new"
          className="inline-flex items-center gap-2 bg-[#C8102E] hover:bg-[#9A0C24] text-white text-xs font-bold px-4 py-2.5 rounded-xl shadow-sm transition-all shrink-0"
        >
          <Plus className="w-4 h-4" /> Add Faculty Member
        </Link>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4 bg-white p-4 rounded-xl border border-neutral-200 shadow-sm">
        <div className="flex flex-wrap gap-1.5">
          {departments.map((dept) => (
            <button
              key={dept}
              onClick={() => setSelectedDept(dept)}
              className={`px-3 py-1 rounded-lg text-xs font-semibold transition-colors ${
                selectedDept === dept
                  ? 'bg-[#003DA5] text-white'
                  : 'bg-neutral-100 text-neutral-700 hover:bg-neutral-200'
              }`}
            >
              {dept}
            </button>
          ))}
        </div>

        <SearchBar value={search} onChange={setSearch} placeholder="Search faculty name or designation..." />
      </div>

      {/* Faculty Table */}
      <AdminTable
        columns={columns}
        data={filteredData}
        loading={isLoading}
        emptyMessage="No faculty members found."
        onRowClick={(r) => navigate(`/admin/faculty/${r.id}`)}
        getRowId={(r) => r.id}
      />

      {/* Confirm Archive Dialog */}
      <ConfirmDialog
        open={Boolean(archiveItem)}
        title="Archive Faculty Member"
        description={`Are you sure you want to set "${archiveItem?.fullName}" to Draft status? They will no longer appear on the public faculty directory.`}
        onConfirm={handleArchiveConfirm}
        onCancel={() => setArchiveItem(null)}
        loading={archiving}
        confirmLabel="Archive Member"
      />
    </div>
  );
}

import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { collection, getDocs, doc, updateDoc } from 'firebase/firestore';
import { db } from '../../lib/firebase';
import { Link, useNavigate } from 'react-router-dom';
import AdminTable, { Column } from '../components/AdminTable';
import StatusBadge from '../components/StatusBadge';
import SearchBar from '../components/SearchBar';
import Pagination from '../components/Pagination';
import ConfirmDialog from '../components/ConfirmDialog';
import { formatDate } from '../../lib/date';
import { logActivity } from '../../lib/activityLog';
import { toast } from 'sonner';
import { Plus, Pencil, Archive, FileText, Download } from 'lucide-react';

interface DocumentRecord {
  id: string;
  title: string;
  slug: string;
  category: string;
  fileUrl: string;
  fileSize?: string;
  publishedAt: string;
  status: string;
}

export default function DocumentsListPage() {
  const navigate = useNavigate();
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [archiveDocItem, setArchiveDocItem] = useState<DocumentRecord | null>(null);
  const [archiving, setArchiving] = useState(false);

  const pageSize = 20;

  const {
    data: documentsList = [],
    isLoading,
    refetch,
  } = useQuery({
    queryKey: ['admin-documents-list'],
    queryFn: async () => {
      const snap = await getDocs(collection(db, 'documents'));
      const items = snap.docs.map((d) => ({
        id: d.id,
        ...d.data(),
      })) as DocumentRecord[];
      return items.sort(
        (a, b) => new Date(b.publishedAt || 0).getTime() - new Date(a.publishedAt || 0).getTime()
      );
    },
  });

  const handleArchiveConfirm = async () => {
    if (!archiveDocItem) return;
    setArchiving(true);
    try {
      await updateDoc(doc(db, 'documents', archiveDocItem.id), { status: 'draft' });
      await logActivity('archive', 'documents', archiveDocItem.id);
      toast.success(`Archived document "${archiveDocItem.title}".`);
      setArchiveDocItem(null);
      refetch();
    } catch {
      toast.error('Failed to archive document.');
    } finally {
      setArchiving(false);
    }
  };

  const categories = [
    { id: 'all', label: 'All Categories' },
    { id: 'prospectus', label: 'Prospectus' },
    { id: 'academic-calendar', label: 'Academic Calendar' },
    { id: 'examination-manual', label: 'Examination Manual' },
    { id: 'nirf', label: 'NIRF Reports' },
    { id: 'naac', label: 'NAAC' },
    { id: 'affiliations', label: 'Affiliations' },
    { id: 'mandatory-disclosures', label: 'Mandatory Disclosures' },
    { id: 'magazines', label: 'Magazines' },
    { id: 'other', label: 'Other' },
  ];

  const filtered = documentsList.filter((doc) => {
    const matchesCategory = selectedCategory === 'all' || doc.category === selectedCategory;
    const matchesSearch = doc.title.toLowerCase().includes(search.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const totalPages = Math.ceil(filtered.length / pageSize);
  const paginatedData = filtered.slice((currentPage - 1) * pageSize, currentPage * pageSize);

  const columns: Column<DocumentRecord>[] = [
    {
      key: 'title',
      label: 'Document Title',
      render: (r) => (
        <div className="flex items-start gap-2.5">
          <FileText className="w-5 h-5 text-[#003DA5] shrink-0 mt-0.5" />
          <div>
            <span className="font-bold text-neutral-900 block">{r.title}</span>
            <span className="text-[11px] font-mono text-neutral-400">{r.slug}</span>
          </div>
        </div>
      ),
    },
    {
      key: 'category',
      label: 'Category',
      render: (r) => (
        <span className="bg-neutral-100 text-neutral-700 text-[10px] font-bold uppercase px-2.5 py-0.5 rounded-md border border-neutral-200">
          {r.category}
        </span>
      ),
    },
    {
      key: 'fileSize',
      label: 'File Size',
      render: (r) => <span className="font-mono text-xs text-neutral-500">{r.fileSize || 'PDF'}</span>,
    },
    {
      key: 'publishedAt',
      label: 'Published Date',
      render: (r) => (
        <span className="text-neutral-500 text-xs">
          {r.publishedAt ? formatDate(r.publishedAt) : 'N/A'}
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
      width: '120px',
      render: (r) => (
        <div className="flex items-center gap-1.5">
          {r.fileUrl && (
            <a
              href={r.fileUrl}
              target="_blank"
              rel="noopener noreferrer"
              onClick={(e) => e.stopPropagation()}
              className="p-1.5 text-neutral-500 hover:text-[#003DA5] hover:bg-neutral-100 rounded transition-colors"
              title="Download File"
            >
              <Download className="w-4 h-4" />
            </a>
          )}
          <button
            onClick={(e) => {
              e.stopPropagation();
              navigate(`/admin/documents/${r.id}`);
            }}
            className="p-1.5 text-neutral-600 hover:text-[#003DA5] hover:bg-neutral-100 rounded transition-colors"
            title="Edit Document"
          >
            <Pencil className="w-4 h-4" />
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              setArchiveDocItem(r);
            }}
            className="p-1.5 text-neutral-400 hover:text-red-600 hover:bg-red-50 rounded transition-colors"
            title="Archive Document"
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
            Official Documents & Resources ({documentsList.length})
          </h2>
          <p className="text-xs text-neutral-500">
            Manage official prospectuses, manuals, academic calendars, NIRF and NAAC certificates.
          </p>
        </div>

        <Link
          to="/admin/documents/new"
          className="inline-flex items-center gap-2 bg-[#C8102E] hover:bg-[#9A0C24] text-white text-xs font-bold px-4 py-2.5 rounded-xl shadow-sm transition-all shrink-0"
        >
          <Plus className="w-4 h-4" /> Upload Document
        </Link>
      </div>

      <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4 bg-white p-4 rounded-xl border border-neutral-200 shadow-sm">
        <select
          value={selectedCategory}
          onChange={(e) => {
            setSelectedCategory(e.target.value);
            setCurrentPage(1);
          }}
          className="px-3 py-2 text-xs rounded-lg border border-neutral-300 bg-white font-semibold text-neutral-700"
        >
          {categories.map((c) => (
            <option key={c.id} value={c.id}>
              {c.label}
            </option>
          ))}
        </select>

        <SearchBar
          value={search}
          onChange={(v) => {
            setSearch(v);
            setCurrentPage(1);
          }}
          placeholder="Search document title..."
        />
      </div>

      <AdminTable
        columns={columns}
        data={paginatedData}
        loading={isLoading}
        emptyMessage="No documents found."
        onRowClick={(r) => navigate(`/admin/documents/${r.id}`)}
        getRowId={(r) => r.id}
      />

      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={setCurrentPage}
      />

      <ConfirmDialog
        open={Boolean(archiveDocItem)}
        title="Archive Document"
        description={`Are you sure you want to set "${archiveDocItem?.title}" to Draft status?`}
        onConfirm={handleArchiveConfirm}
        onCancel={() => setArchiveDocItem(null)}
        loading={archiving}
        confirmLabel="Archive Document"
      />
    </div>
  );
}

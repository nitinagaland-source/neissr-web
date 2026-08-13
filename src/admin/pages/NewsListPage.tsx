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
import { Plus, Pencil, Archive, Newspaper, Image as ImageIcon } from 'lucide-react';

interface NewsRecord {
  id: string;
  title: string;
  slug: string;
  category: string;
  coverImageUrl?: string;
  publishedAt: string;
  status: string;
}

export default function NewsListPage() {
  const navigate = useNavigate();
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [archiveNewsItem, setArchiveNewsItem] = useState<NewsRecord | null>(null);
  const [archiving, setArchiving] = useState(false);

  const pageSize = 20;

  const {
    data: newsList = [],
    isLoading,
    refetch,
  } = useQuery({
    queryKey: ['admin-news-list'],
    queryFn: async () => {
      const snap = await getDocs(collection(db, 'news'));
      const items = snap.docs.map((d) => ({
        id: d.id,
        ...d.data(),
      })) as NewsRecord[];
      return items.sort(
        (a, b) => new Date(b.publishedAt || 0).getTime() - new Date(a.publishedAt || 0).getTime()
      );
    },
  });

  const handleArchiveConfirm = async () => {
    if (!archiveNewsItem) return;
    setArchiving(true);
    try {
      await updateDoc(doc(db, 'news', archiveNewsItem.id), { status: 'draft' });
      await logActivity('archive', 'news', archiveNewsItem.id);
      toast.success(`Archived news article "${archiveNewsItem.title}".`);
      setArchiveNewsItem(null);
      refetch();
    } catch {
      toast.error('Failed to archive news article.');
    } finally {
      setArchiving(false);
    }
  };

  const categories = [
    { id: 'all', label: 'All News' },
    { id: 'academic', label: 'Academic' },
    { id: 'events', label: 'Events' },
    { id: 'peace-centre', label: 'Peace Centre' },
    { id: 'fieldwork', label: 'Fieldwork' },
    { id: 'general', label: 'General' },
  ];

  const filtered = newsList.filter((item) => {
    const matchesCat = selectedCategory === 'all' || item.category === selectedCategory;
    const matchesSearch = item.title.toLowerCase().includes(search.toLowerCase());
    return matchesCat && matchesSearch;
  });

  const totalPages = Math.ceil(filtered.length / pageSize);
  const paginatedData = filtered.slice((currentPage - 1) * pageSize, currentPage * pageSize);

  const columns: Column<NewsRecord>[] = [
    {
      key: 'coverImageUrl',
      label: 'Cover',
      width: '70px',
      render: (r) =>
        r.coverImageUrl ? (
          <img
            src={r.coverImageUrl}
            alt={r.title}
            className="w-12 h-10 rounded-lg object-cover border border-neutral-200"
          />
        ) : (
          <div className="w-12 h-10 rounded-lg bg-neutral-100 border border-neutral-200 text-neutral-400 flex items-center justify-center">
            <ImageIcon className="w-4 h-4" />
          </div>
        ),
    },
    {
      key: 'title',
      label: 'Article Title',
      render: (r) => (
        <div>
          <span className="font-bold text-neutral-900 block line-clamp-1">{r.title}</span>
          <span className="text-[11px] font-mono text-neutral-400">{r.slug}</span>
        </div>
      ),
    },
    {
      key: 'category',
      label: 'Category',
      render: (r) => (
        <span className="bg-purple-50 text-purple-700 text-[10px] font-bold uppercase px-2.5 py-0.5 rounded-full border border-purple-200">
          {r.category || 'General'}
        </span>
      ),
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
      width: '100px',
      render: (r) => (
        <div className="flex items-center gap-1.5">
          <button
            onClick={(e) => {
              e.stopPropagation();
              navigate(`/admin/news/${r.id}`);
            }}
            className="p-1.5 text-neutral-600 hover:text-[#003DA5] hover:bg-neutral-100 rounded transition-colors"
            title="Edit Article"
          >
            <Pencil className="w-4 h-4" />
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              setArchiveNewsItem(r);
            }}
            className="p-1.5 text-neutral-400 hover:text-red-600 hover:bg-red-50 rounded transition-colors"
            title="Archive Article"
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
            News & Press Releases ({newsList.length})
          </h2>
          <p className="text-xs text-neutral-500">
            Publish campus notices, press releases, workshop highlights, and field exposure reports.
          </p>
        </div>

        <Link
          to="/admin/news/new"
          className="inline-flex items-center gap-2 bg-[#C8102E] hover:bg-[#9A0C24] text-white text-xs font-bold px-4 py-2.5 rounded-xl shadow-sm transition-all shrink-0"
        >
          <Plus className="w-4 h-4" /> Publish Article
        </Link>
      </div>

      <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4 bg-white p-4 rounded-xl border border-neutral-200 shadow-sm">
        <div className="flex flex-wrap gap-1.5">
          {categories.map((c) => (
            <button
              key={c.id}
              onClick={() => {
                setSelectedCategory(c.id);
                setCurrentPage(1);
              }}
              className={`px-3 py-1 rounded-lg text-xs font-semibold transition-colors ${
                selectedCategory === c.id
                  ? 'bg-[#003DA5] text-white'
                  : 'bg-neutral-100 text-neutral-700 hover:bg-neutral-200'
              }`}
            >
              {c.label}
            </button>
          ))}
        </div>

        <SearchBar
          value={search}
          onChange={(v) => {
            setSearch(v);
            setCurrentPage(1);
          }}
          placeholder="Search news title..."
        />
      </div>

      <AdminTable
        columns={columns}
        data={paginatedData}
        loading={isLoading}
        emptyMessage="No news articles found."
        onRowClick={(r) => navigate(`/admin/news/${r.id}`)}
        getRowId={(r) => r.id}
      />

      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={setCurrentPage}
      />

      <ConfirmDialog
        open={Boolean(archiveNewsItem)}
        title="Archive News Article"
        description={`Are you sure you want to set "${archiveNewsItem?.title}" to Draft status?`}
        onConfirm={handleArchiveConfirm}
        onCancel={() => setArchiveNewsItem(null)}
        loading={archiving}
        confirmLabel="Archive Article"
      />
    </div>
  );
}

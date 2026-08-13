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
import { Plus, Pencil, Archive, Calendar, MapPin } from 'lucide-react';

interface EventRecord {
  id: string;
  title: string;
  slug: string;
  eventDate: string;
  venue: string;
  organizer?: string;
  status: string;
}

export default function EventsListPage() {
  const navigate = useNavigate();
  const [search, setSearch] = useState('');
  const [filterType, setFilterType] = useState<'all' | 'upcoming' | 'past'>('all');
  const [archiveEventItem, setArchiveEventItem] = useState<EventRecord | null>(null);
  const [archiving, setArchiving] = useState(false);

  const {
    data: eventsList = [],
    isLoading,
    refetch,
  } = useQuery({
    queryKey: ['admin-events-list'],
    queryFn: async () => {
      const snap = await getDocs(collection(db, 'events'));
      const items = snap.docs.map((d) => ({
        id: d.id,
        ...d.data(),
      })) as EventRecord[];
      return items.sort(
        (a, b) => new Date(a.eventDate || 0).getTime() - new Date(b.eventDate || 0).getTime()
      );
    },
  });

  const handleArchiveConfirm = async () => {
    if (!archiveEventItem) return;
    setArchiving(true);
    try {
      await updateDoc(doc(db, 'events', archiveEventItem.id), { status: 'draft' });
      await logActivity('archive', 'events', archiveEventItem.id);
      toast.success(`Archived event "${archiveEventItem.title}".`);
      setArchiveEventItem(null);
      refetch();
    } catch {
      toast.error('Failed to archive event.');
    } finally {
      setArchiving(false);
    }
  };

  const todayStr = new Date().toISOString().split('T')[0];

  const filtered = eventsList.filter((item) => {
    const matchesSearch = item.title.toLowerCase().includes(search.toLowerCase());
    let matchesTime = true;
    if (filterType === 'upcoming') {
      matchesTime = item.eventDate >= todayStr;
    } else if (filterType === 'past') {
      matchesTime = item.eventDate < todayStr;
    }
    return matchesSearch && matchesTime;
  });

  const columns: Column<EventRecord>[] = [
    {
      key: 'title',
      label: 'Event Title',
      render: (r) => (
        <div className="flex items-start gap-2.5">
          <Calendar className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
          <div>
            <span className="font-bold text-neutral-900 block">{r.title}</span>
            <span className="text-[11px] font-mono text-neutral-400">{r.slug}</span>
          </div>
        </div>
      ),
    },
    {
      key: 'eventDate',
      label: 'Event Date',
      render: (r) => (
        <span className="font-semibold text-neutral-800 text-xs">
          {r.eventDate ? formatDate(r.eventDate) : 'TBA'}
        </span>
      ),
    },
    {
      key: 'venue',
      label: 'Venue',
      render: (r) => (
        <div className="flex items-center gap-1 text-xs text-neutral-600">
          <MapPin className="w-3.5 h-3.5 text-neutral-400 shrink-0" />
          <span>{r.venue || 'Campus Auditorium'}</span>
        </div>
      ),
    },
    {
      key: 'organizer',
      label: 'Organizer',
      render: (r) => (
        <span className="text-xs font-medium text-neutral-600">
          {r.organizer || 'NEISSR Management'}
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
              navigate(`/admin/events/${r.id}`);
            }}
            className="p-1.5 text-neutral-600 hover:text-[#003DA5] hover:bg-neutral-100 rounded transition-colors"
            title="Edit Event"
          >
            <Pencil className="w-4 h-4" />
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              setArchiveEventItem(r);
            }}
            className="p-1.5 text-neutral-400 hover:text-red-600 hover:bg-red-50 rounded transition-colors"
            title="Archive Event"
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
            Events Calendar ({eventsList.length})
          </h2>
          <p className="text-xs text-neutral-500">
            Schedule academic symposiums, peace rallies, cultural festivals, and field exposures.
          </p>
        </div>

        <Link
          to="/admin/events/new"
          className="inline-flex items-center gap-2 bg-[#C8102E] hover:bg-[#9A0C24] text-white text-xs font-bold px-4 py-2.5 rounded-xl shadow-sm transition-all shrink-0"
        >
          <Plus className="w-4 h-4" /> Create Event
        </Link>
      </div>

      <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4 bg-white p-4 rounded-xl border border-neutral-200 shadow-sm">
        <div className="flex gap-1.5">
          {(['all', 'upcoming', 'past'] as const).map((t) => (
            <button
              key={t}
              onClick={() => setFilterType(t)}
              className={`px-3 py-1 rounded-lg text-xs font-semibold capitalize transition-colors ${
                filterType === t
                  ? 'bg-[#003DA5] text-white'
                  : 'bg-neutral-100 text-neutral-700 hover:bg-neutral-200'
              }`}
            >
              {t} Events
            </button>
          ))}
        </div>

        <SearchBar
          value={search}
          onChange={setSearch}
          placeholder="Search event title or venue..."
        />
      </div>

      <AdminTable
        columns={columns}
        data={filtered}
        loading={isLoading}
        emptyMessage="No events scheduled."
        onRowClick={(r) => navigate(`/admin/events/${r.id}`)}
        getRowId={(r) => r.id}
      />

      <ConfirmDialog
        open={Boolean(archiveEventItem)}
        title="Archive Event"
        description={`Are you sure you want to set "${archiveEventItem?.title}" to Draft status?`}
        onConfirm={handleArchiveConfirm}
        onCancel={() => setArchiveEventItem(null)}
        loading={archiving}
        confirmLabel="Archive Event"
      />
    </div>
  );
}

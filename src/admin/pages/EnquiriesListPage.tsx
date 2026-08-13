import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { collection, getDocs, doc, updateDoc, deleteDoc } from 'firebase/firestore';
import { db, isFirebaseConfigured } from '../../lib/firebase';
import AdminTable, { Column } from '../components/AdminTable';
import StatusBadge from '../components/StatusBadge';
import { formatDate } from '../../lib/date';
import { toast } from 'sonner';
import {
  Inbox,
  Search,
  Mail,
  Phone,
  Calendar,
  CheckCircle2,
  Trash2,
  Eye,
  Filter,
  X,
  MessageSquare
} from 'lucide-react';

interface EnquiryRecord {
  id: string;
  fullName: string;
  phone: string;
  email: string;
  programmeInterested?: string;
  sourcePage?: string;
  message?: string;
  status: 'new' | 'read' | 'contacted' | 'resolved';
  createdAt?: any;
}

const SEED_ENQUIRIES: EnquiryRecord[] = [
  {
    id: 'enq-1',
    fullName: 'Ananya Sharma',
    phone: '9876543210',
    email: 'ananya.s@gmail.com',
    programmeInterested: 'MSW - Peace & Conflict Transformation',
    sourcePage: 'Admissions Page',
    message: 'Interested in taking admission for MSW Peace & Conflict Transformation. Kindly share details about hostel availability and fee structure.',
    status: 'new',
    createdAt: new Date(Date.now() - 3600000 * 4).toISOString(),
  },
  {
    id: 'enq-2',
    fullName: 'Kevi Lotha',
    phone: '8794123456',
    email: 'kevi.lotha@outlook.com',
    programmeInterested: 'BSW - Bachelor of Social Work',
    sourcePage: 'BSW Course Page',
    message: 'Could you please confirm the last date for submitting the BSW entrance application form for 2024-25 batch?',
    status: 'new',
    createdAt: new Date(Date.now() - 86400000).toISOString(),
  },
  {
    id: 'enq-3',
    fullName: 'Imlimenla Ao',
    phone: '9436012890',
    email: 'imlimenla.ao@yahoo.com',
    programmeInterested: 'MSW - Community Development',
    sourcePage: 'Contact Page',
    message: 'Requesting prospectus and fieldwork guidelines for MSW Community Development specialization.',
    status: 'contacted',
    createdAt: new Date(Date.now() - 86400000 * 3).toISOString(),
  },
  {
    id: 'enq-4',
    fullName: 'Tenzing Norbu',
    phone: '7005123987',
    email: 'tenzing.norbu@gmail.com',
    programmeInterested: 'MSW - Youth Development',
    sourcePage: 'Home Page',
    message: 'Interested in campus placement records for MSW graduates over the past 3 years.',
    status: 'resolved',
    createdAt: new Date(Date.now() - 86400000 * 5).toISOString(),
  },
];

export default function EnquiriesListPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [selectedEnquiry, setSelectedEnquiry] = useState<EnquiryRecord | null>(null);

  const {
    data: enquiries = [],
    isLoading,
    refetch,
  } = useQuery({
    queryKey: ['admin-enquiries-list'],
    queryFn: async () => {
      if (!isFirebaseConfigured) return SEED_ENQUIRIES;
      try {
        const snap = await getDocs(collection(db, 'enquiries'));
        if (snap.empty) return SEED_ENQUIRIES;
        return snap.docs.map((d) => ({
          id: d.id,
          ...d.data(),
        })) as EnquiryRecord[];
      } catch (e) {
        console.warn('Enquiries fetch error:', e);
        return SEED_ENQUIRIES;
      }
    },
  });

  const handleUpdateStatus = async (id: string, newStatus: EnquiryRecord['status']) => {
    try {
      if (isFirebaseConfigured) {
        await updateDoc(doc(db, 'enquiries', id), { status: newStatus });
      }
      toast.success(`Enquiry status updated to ${newStatus}`);
      if (selectedEnquiry && selectedEnquiry.id === id) {
        setSelectedEnquiry((prev) => prev ? { ...prev, status: newStatus } : null);
      }
      refetch();
    } catch {
      toast.error('Failed to update status.');
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this enquiry?')) return;
    try {
      if (isFirebaseConfigured) {
        await deleteDoc(doc(db, 'enquiries', id));
      }
      toast.success('Enquiry deleted.');
      if (selectedEnquiry?.id === id) setSelectedEnquiry(null);
      refetch();
    } catch {
      toast.error('Failed to delete enquiry.');
    }
  };

  const filteredEnquiries = enquiries.filter((item) => {
    const matchesSearch =
      item.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.phone.includes(searchTerm) ||
      (item.programmeInterested && item.programmeInterested.toLowerCase().includes(searchTerm.toLowerCase()));
    
    const matchesStatus = statusFilter === 'all' || item.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const columns: Column<EnquiryRecord>[] = [
    {
      key: 'fullName',
      label: 'Student Name',
      render: (r) => (
        <div>
          <span className="font-bold text-neutral-900 block">{r.fullName}</span>
          <span className="text-xs text-neutral-500 flex items-center gap-1 mt-0.5">
            <Mail className="w-3 h-3 text-neutral-400" /> {r.email}
          </span>
        </div>
      ),
    },
    {
      key: 'phone',
      label: 'Contact',
      render: (r) => (
        <div className="text-xs text-neutral-700">
          <div className="font-mono flex items-center gap-1">
            <Phone className="w-3 h-3 text-neutral-400" /> {r.phone}
          </div>
          {r.programmeInterested && (
            <span className="text-[10px] text-neutral-500 bg-neutral-100 px-1.5 py-0.5 rounded border border-neutral-200 block mt-1 line-clamp-1">
              {r.programmeInterested}
            </span>
          )}
        </div>
      ),
    },
    {
      key: 'createdAt',
      label: 'Submitted Date',
      render: (r) => (
        <span className="text-xs text-neutral-500 flex items-center gap-1">
          <Calendar className="w-3 h-3 text-neutral-400" />
          {formatDate(r.createdAt)}
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
      render: (r) => (
        <div className="flex items-center justify-end gap-1" onClick={(e) => e.stopPropagation()}>
          <button
            onClick={() => setSelectedEnquiry(r)}
            className="p-1.5 rounded-lg text-neutral-600 hover:text-neutral-900 hover:bg-neutral-100"
            title="View Details"
          >
            <Eye className="w-4 h-4" />
          </button>

          {r.status === 'new' && (
            <button
              onClick={() => handleUpdateStatus(r.id, 'contacted')}
              className="p-1.5 rounded-lg text-amber-600 hover:bg-amber-50"
              title="Mark as Contacted"
            >
              <CheckCircle2 className="w-4 h-4" />
            </button>
          )}

          <button
            onClick={() => handleDelete(r.id)}
            className="p-1.5 rounded-lg text-red-500 hover:text-red-700 hover:bg-red-50"
            title="Delete"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-neutral-900 flex items-center gap-2">
            <Inbox className="w-6 h-6 text-[#C8102E]" />
            Student Enquiries
          </h1>
          <p className="text-sm text-neutral-500 mt-1">
            Review and manage incoming admission requests and general contact form submissions.
          </p>
        </div>
      </div>

      {/* Filter Bar */}
      <div className="bg-white rounded-xl border border-neutral-200 p-4 shadow-sm">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="relative w-full md:w-80">
            <Search className="w-4 h-4 text-neutral-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search by name, email, phone..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-4 py-2 text-sm bg-neutral-50 border border-neutral-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#C8102E]/20 focus:border-[#C8102E]"
            />
          </div>

          <div className="flex items-center gap-2 w-full md:w-auto overflow-x-auto">
            <Filter className="w-4 h-4 text-neutral-400 shrink-0" />
            {(['all', 'new', 'read', 'contacted', 'resolved'] as const).map((st) => (
              <button
                key={st}
                onClick={() => setStatusFilter(st)}
                className={`px-3 py-1.5 text-xs font-semibold rounded-lg capitalize whitespace-nowrap transition-colors ${
                  statusFilter === st
                    ? 'bg-[#C8102E] text-white shadow-sm'
                    : 'bg-neutral-100 text-neutral-600 hover:bg-neutral-200'
                }`}
              >
                {st}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Data Table */}
      <AdminTable
        columns={columns}
        data={filteredEnquiries}
        loading={isLoading}
        emptyMessage="No student enquiries found."
        onRowClick={(r) => setSelectedEnquiry(r)}
      />

      {/* Detail Modal */}
      {selectedEnquiry && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-xl border border-neutral-200 max-w-xl w-full p-6 animate-in fade-in zoom-in-95">
            <div className="flex items-center justify-between border-b border-neutral-100 pb-4 mb-4">
              <div className="flex items-center gap-2">
                <MessageSquare className="w-5 h-5 text-[#C8102E]" />
                <h3 className="text-lg font-bold text-neutral-900">Enquiry Details</h3>
              </div>
              <button
                onClick={() => setSelectedEnquiry(null)}
                className="p-1 rounded-lg text-neutral-400 hover:text-neutral-700 hover:bg-neutral-100"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-4 text-sm">
              <div className="grid grid-cols-2 gap-4 bg-neutral-50 p-4 rounded-lg border border-neutral-100">
                <div>
                  <span className="text-xs text-neutral-500 uppercase font-semibold block">Full Name</span>
                  <span className="font-bold text-neutral-900">{selectedEnquiry.fullName}</span>
                </div>
                <div>
                  <span className="text-xs text-neutral-500 uppercase font-semibold block">Programme</span>
                  <span className="font-semibold text-neutral-800">{selectedEnquiry.programmeInterested || 'General'}</span>
                </div>
                <div>
                  <span className="text-xs text-neutral-500 uppercase font-semibold block">Email</span>
                  <span className="text-neutral-700 font-mono text-xs">{selectedEnquiry.email}</span>
                </div>
                <div>
                  <span className="text-xs text-neutral-500 uppercase font-semibold block">Phone</span>
                  <span className="text-neutral-700 font-mono text-xs">{selectedEnquiry.phone}</span>
                </div>
              </div>

              <div>
                <span className="text-xs text-neutral-500 uppercase font-semibold block mb-1">Message Content</span>
                <div className="p-4 bg-neutral-50 border border-neutral-200 rounded-lg text-neutral-800 leading-relaxed min-h-[100px]">
                  {selectedEnquiry.message || 'No additional message provided.'}
                </div>
              </div>

              <div className="flex items-center justify-between pt-2">
                <span className="text-xs text-neutral-500">
                  Source: {selectedEnquiry.sourcePage || 'Direct Website Submission'}
                </span>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handleUpdateStatus(selectedEnquiry.id, 'contacted')}
                    className="px-3 py-1.5 text-xs font-semibold bg-amber-50 text-amber-700 border border-amber-200 rounded-lg hover:bg-amber-100"
                  >
                    Mark Contacted
                  </button>
                  <button
                    onClick={() => handleUpdateStatus(selectedEnquiry.id, 'resolved')}
                    className="px-3 py-1.5 text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200 rounded-lg hover:bg-emerald-100"
                  >
                    Mark Resolved
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

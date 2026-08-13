import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { collection, getDocs, addDoc, deleteDoc, doc } from 'firebase/firestore';
import { db, isFirebaseConfigured } from '../../lib/firebase';
import FileUploader from '../components/FileUploader';
import { toast } from 'sonner';
import {
  ImageIcon,
  Plus,
  Trash2,
  X,
  Search,
  Filter
} from 'lucide-react';

interface GalleryItem {
  id: string;
  title: string;
  category: string;
  imageUrl: string;
  caption?: string;
  createdAt?: string;
}

const SEED_GALLERY: GalleryItem[] = [
  {
    id: 'gal-1',
    title: '10th Annual Convocation Ceremony 2023',
    category: 'Convocations',
    imageUrl: 'https://images.unsplash.com/photo-1523580494863-6f3031224c94?auto=format&fit=crop&q=80&w=800',
    caption: 'Graduating MSW students receiving their degrees from Nagaland University officials.',
    createdAt: new Date().toISOString(),
  },
  {
    id: 'gal-2',
    title: 'Youth Peace Rally - International Day of Peace',
    category: 'Peace Rallies',
    imageUrl: 'https://images.unsplash.com/photo-1511632765486-a01980e01a18?auto=format&fit=crop&q=80&w=800',
    caption: 'NEISSR students leading the peace movement in Chümoukedima town.',
    createdAt: new Date().toISOString(),
  },
  {
    id: 'gal-3',
    title: 'Rural Fieldwork Practicum in Mon District',
    category: 'Field Visits',
    imageUrl: 'https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?auto=format&fit=crop&q=80&w=800',
    caption: 'BSW 2nd year students performing community assessment and PRA mapping.',
    createdAt: new Date().toISOString(),
  },
];

export default function GalleryAdminPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [modalOpen, setModalOpen] = useState(false);
  const [saving, setSaving] = useState(false);

  const [newTitle, setNewTitle] = useState('');
  const [newCategory, setNewCategory] = useState('Campus Events');
  const [newImageUrl, setNewImageUrl] = useState('');
  const [newCaption, setNewCaption] = useState('');

  const { data: galleryItems = [], refetch } = useQuery({
    queryKey: ['admin-gallery-items'],
    queryFn: async () => {
      if (!isFirebaseConfigured) return SEED_GALLERY;
      try {
        const snap = await getDocs(collection(db, 'gallery'));
        if (snap.empty) return SEED_GALLERY;
        return snap.docs.map((d) => ({ id: d.id, ...d.data() })) as GalleryItem[];
      } catch {
        return SEED_GALLERY;
      }
    },
  });

  const handleAddImage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle || !newImageUrl) {
      toast.error('Please fill in title and provide/upload an image.');
      return;
    }

    setSaving(true);
    try {
      const payload = {
        title: newTitle,
        category: newCategory,
        imageUrl: newImageUrl,
        caption: newCaption,
        createdAt: new Date().toISOString(),
      };

      if (isFirebaseConfigured) {
        await addDoc(collection(db, 'gallery'), payload);
      }
      toast.success('Gallery photo added.');
      setModalOpen(false);
      setNewTitle('');
      setNewImageUrl('');
      setNewCaption('');
      refetch();
    } catch {
      toast.error('Failed to add gallery item.');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this photo?')) return;
    try {
      if (isFirebaseConfigured) {
        await deleteDoc(doc(db, 'gallery', id));
      }
      toast.success('Photo removed.');
      refetch();
    } catch {
      toast.error('Failed to delete photo.');
    }
  };

  const filtered = galleryItems.filter((g) => {
    const matchSearch = g.title.toLowerCase().includes(searchTerm.toLowerCase());
    const matchCat = categoryFilter === 'all' || g.category === categoryFilter;
    return matchSearch && matchCat;
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-neutral-900 flex items-center gap-2">
            <ImageIcon className="w-6 h-6 text-[#C8102E]" />
            Photo Gallery Management
          </h1>
          <p className="text-sm text-neutral-500 mt-1">
            Upload and organize official photos from campus events, fieldwork, and convocation ceremonies.
          </p>
        </div>

        <button
          onClick={() => setModalOpen(true)}
          className="inline-flex items-center gap-2 px-4 py-2.5 bg-[#C8102E] text-white font-semibold text-xs rounded-lg hover:bg-[#a00d24] transition-colors shadow-sm shrink-0"
        >
          <Plus className="w-4 h-4" /> Add Photo
        </button>
      </div>

      {/* Filter Bar */}
      <div className="bg-white rounded-xl border border-neutral-200 p-4 shadow-sm">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="relative w-full md:w-80">
            <Search className="w-4 h-4 text-neutral-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search gallery..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-4 py-2 text-sm bg-neutral-50 border border-neutral-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#C8102E]/20"
            />
          </div>

          <div className="flex items-center gap-2 overflow-x-auto w-full md:w-auto">
            <Filter className="w-4 h-4 text-neutral-400 shrink-0" />
            {(['all', 'Campus Events', 'Peace Rallies', 'Field Visits', 'Convocations'] as const).map((cat) => (
              <button
                key={cat}
                onClick={() => setCategoryFilter(cat)}
                className={`px-3 py-1.5 text-xs font-semibold rounded-lg capitalize whitespace-nowrap ${
                  categoryFilter === cat
                    ? 'bg-[#C8102E] text-white'
                    : 'bg-neutral-100 text-neutral-600 hover:bg-neutral-200'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Image Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {filtered.map((item) => (
          <div key={item.id} className="bg-white border border-neutral-200 rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-shadow group relative">
            <div className="aspect-video relative overflow-hidden bg-neutral-100">
              <img
                src={item.imageUrl}
                alt={item.title}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
              />
              <span className="absolute top-2 left-2 px-2 py-0.5 text-[10px] font-bold uppercase bg-black/60 text-white backdrop-blur-sm rounded">
                {item.category}
              </span>
              <button
                onClick={() => handleDelete(item.id)}
                className="absolute top-2 right-2 p-1.5 bg-red-600 text-white rounded-lg opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-700 shadow-md"
                title="Delete Photo"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
            <div className="p-4">
              <h3 className="font-bold text-neutral-900 text-sm line-clamp-1">{item.title}</h3>
              {item.caption && (
                <p className="text-xs text-neutral-500 mt-1 line-clamp-2">{item.caption}</p>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Add Photo Modal */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
          <form onSubmit={handleAddImage} className="bg-white rounded-xl shadow-xl border border-neutral-200 max-w-lg w-full p-6 space-y-4">
            <div className="flex items-center justify-between border-b border-neutral-100 pb-3">
              <h3 className="font-bold text-neutral-900 text-lg">Add New Photo</h3>
              <button
                type="button"
                onClick={() => setModalOpen(false)}
                className="p-1 text-neutral-400 hover:text-neutral-700"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-1">
              <label className="text-xs font-semibold text-neutral-700">Photo Title</label>
              <input
                type="text"
                required
                value={newTitle}
                onChange={(e) => setNewTitle(e.target.value)}
                className="w-full px-3 py-2 text-sm bg-neutral-50 border border-neutral-200 rounded-lg"
                placeholder="e.g., Peace Rally 2024"
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-semibold text-neutral-700">Category</label>
              <select
                value={newCategory}
                onChange={(e) => setNewCategory(e.target.value)}
                className="w-full px-3 py-2 text-sm bg-neutral-50 border border-neutral-200 rounded-lg"
              >
                <option value="Campus Events">Campus Events</option>
                <option value="Peace Rallies">Peace Rallies</option>
                <option value="Field Visits">Field Visits</option>
                <option value="Convocations">Convocations</option>
              </select>
            </div>

            <div className="space-y-1">
              <FileUploader
                label="Photo Image Upload"
                accept="image/*"
                maxSizeMB={5}
                storagePath="gallery"
                currentUrl={newImageUrl}
                onUploadComplete={(url) => setNewImageUrl(url)}
                onRemove={() => setNewImageUrl('')}
              />
              <div className="text-xs text-neutral-400 text-center py-1">OR</div>
              <input
                type="url"
                value={newImageUrl}
                onChange={(e) => setNewImageUrl(e.target.value)}
                placeholder="Direct Image URL (e.g. https://...)"
                className="w-full px-3 py-2 text-xs bg-neutral-50 border border-neutral-200 rounded-lg"
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-semibold text-neutral-700">Caption / Description</label>
              <textarea
                rows={2}
                value={newCaption}
                onChange={(e) => setNewCaption(e.target.value)}
                className="w-full px-3 py-2 text-sm bg-neutral-50 border border-neutral-200 rounded-lg"
                placeholder="Brief caption..."
              />
            </div>

            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setModalOpen(false)}
                className="px-4 py-2 text-xs font-semibold text-neutral-600 bg-neutral-100 rounded-lg"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={saving}
                className="px-5 py-2 text-xs font-semibold text-white bg-[#C8102E] rounded-lg hover:bg-[#a00d24]"
              >
                {saving ? 'Saving...' : 'Upload Photo'}
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}

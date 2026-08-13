import React, { useState, useEffect } from 'react';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { db, isFirebaseConfigured } from '../../lib/firebase';
import { toast } from 'sonner';
import {
  Settings,
  Building,
  Phone,
  Mail,
  MapPin,
  Globe,
  Bell,
  Save,
  Loader2
} from 'lucide-react';

interface SiteSettingsData {
  instituteName: string;
  tagline: string;
  establishedYear: string;
  affiliation: string;
  contactPhone: string;
  contactEmail: string;
  address: string;
  noticeBannerEnabled: boolean;
  noticeBannerText: string;
  noticeBannerLink: string;
  facebookUrl: string;
  youtubeUrl: string;
  instagramUrl: string;
  linkedinUrl: string;
}

export const DEFAULT_SETTINGS: SiteSettingsData = {
  instituteName: 'North East Institute of Social Sciences and Research',
  tagline: 'Educating for Peace and Development',
  establishedYear: '2014',
  affiliation: 'Affiliated to Nagaland University & Recognized by UGC',
  contactPhone: '+91 84150 24080 / +91 94368 31603',
  contactEmail: 'contact@neissr.ac.in',
  address: 'Peace Centre, 7th Mile, Chümoukedima, Nagaland 797103',
  noticeBannerEnabled: true,
  noticeBannerText: 'Admissions Open for BSW & MSW Batch 2024-25 | Apply Online',
  noticeBannerLink: '/admissions',
  facebookUrl: 'https://facebook.com/neissrofficial',
  youtubeUrl: 'https://youtube.com/@neissr',
  instagramUrl: 'https://instagram.com/neissr_official',
  linkedinUrl: 'https://linkedin.com/school/neissr',
};

export default function SiteSettingsPage() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [settings, setSettings] = useState<SiteSettingsData>(DEFAULT_SETTINGS);

  useEffect(() => {
    async function loadSettings() {
      try {
        if (isFirebaseConfigured) {
          const snap = await getDoc(doc(db, 'settings', 'general'));
          if (snap.exists()) {
            setSettings({ ...DEFAULT_SETTINGS, ...snap.data() });
          }
        } else {
          const local = localStorage.getItem('neissr_site_settings');
          if (local) {
            setSettings({ ...DEFAULT_SETTINGS, ...JSON.parse(local) });
          }
        }
      } catch (err) {
        console.warn('Failed loading settings:', err);
      } finally {
        setLoading(false);
      }
    }
    loadSettings();
  }, []);

  const handleChange = (field: keyof SiteSettingsData, value: any) => {
    setSettings((prev) => ({ ...prev, [field]: value }));
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      if (isFirebaseConfigured) {
        await setDoc(doc(db, 'settings', 'general'), settings);
      } else {
        localStorage.setItem('neissr_site_settings', JSON.stringify(settings));
      }
      toast.success('Site settings updated successfully.');
    } catch (err) {
      console.error('Error saving settings:', err);
      toast.error('Failed to save settings.');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="w-8 h-8 animate-spin text-[#C8102E]" />
      </div>
    );
  }

  return (
    <form onSubmit={handleSave} className="space-y-6 max-w-5xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-neutral-900 flex items-center gap-2">
            <Settings className="w-6 h-6 text-[#C8102E]" />
            Site Configuration & Settings
          </h1>
          <p className="text-sm text-neutral-500 mt-1">
            Manage global institution metadata, contact details, social links, and top alert banners.
          </p>
        </div>

        <button
          type="submit"
          disabled={saving}
          className="inline-flex items-center justify-center gap-2 px-5 py-2.5 bg-[#C8102E] text-white font-semibold text-sm rounded-lg hover:bg-[#a00d24] transition-colors shadow-sm disabled:opacity-50 shrink-0"
        >
          {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
          Save Changes
        </button>
      </div>

      {/* Notice Banner Card */}
      <div className="bg-white rounded-xl border border-neutral-200 p-6 shadow-sm space-y-4">
        <div className="flex items-center gap-2 text-neutral-900 font-bold border-b border-neutral-100 pb-3">
          <Bell className="w-5 h-5 text-[#C8102E]" /> Notice Banner Alert
        </div>
        <div className="space-y-4">
          <label className="flex items-center gap-3 cursor-pointer">
            <input
              type="checkbox"
              checked={settings.noticeBannerEnabled}
              onChange={(e) => handleChange('noticeBannerEnabled', e.target.checked)}
              className="w-4 h-4 text-[#C8102E] rounded border-neutral-300 focus:ring-[#C8102E]"
            />
            <span className="text-sm font-semibold text-neutral-800">
              Enable Top Announcement Banner across Website Header
            </span>
          </label>

          {settings.noticeBannerEnabled && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2">
              <div className="md:col-span-2 space-y-1">
                <label className="text-xs font-semibold text-neutral-700">Announcement Text</label>
                <input
                  type="text"
                  value={settings.noticeBannerText}
                  onChange={(e) => handleChange('noticeBannerText', e.target.value)}
                  className="w-full px-3 py-2 text-sm bg-neutral-50 border border-neutral-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#C8102E]/20 focus:border-[#C8102E]"
                  placeholder="Notice text..."
                />
              </div>
              <div className="space-y-1">
                <label className="text-xs font-semibold text-neutral-700">Action Button Link</label>
                <input
                  type="text"
                  value={settings.noticeBannerLink}
                  onChange={(e) => handleChange('noticeBannerLink', e.target.value)}
                  className="w-full px-3 py-2 text-sm bg-neutral-50 border border-neutral-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#C8102E]/20 focus:border-[#C8102E]"
                  placeholder="/admissions or https://..."
                />
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Institution Profile Card */}
      <div className="bg-white rounded-xl border border-neutral-200 p-6 shadow-sm space-y-4">
        <div className="flex items-center gap-2 text-neutral-900 font-bold border-b border-neutral-100 pb-3">
          <Building className="w-5 h-5 text-[#C8102E]" /> Institution Profile
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-1">
            <label className="text-xs font-semibold text-neutral-700">Full Institution Name</label>
            <input
              type="text"
              value={settings.instituteName}
              onChange={(e) => handleChange('instituteName', e.target.value)}
              className="w-full px-3 py-2 text-sm bg-neutral-50 border border-neutral-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#C8102E]/20"
            />
          </div>

          <div className="space-y-1">
            <label className="text-xs font-semibold text-neutral-700">Tagline / Motto</label>
            <input
              type="text"
              value={settings.tagline}
              onChange={(e) => handleChange('tagline', e.target.value)}
              className="w-full px-3 py-2 text-sm bg-neutral-50 border border-neutral-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#C8102E]/20"
            />
          </div>

          <div className="space-y-1">
            <label className="text-xs font-semibold text-neutral-700">Established Year</label>
            <input
              type="text"
              value={settings.establishedYear}
              onChange={(e) => handleChange('establishedYear', e.target.value)}
              className="w-full px-3 py-2 text-sm bg-neutral-50 border border-neutral-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#C8102E]/20"
            />
          </div>

          <div className="space-y-1">
            <label className="text-xs font-semibold text-neutral-700">Affiliation & Recognition</label>
            <input
              type="text"
              value={settings.affiliation}
              onChange={(e) => handleChange('affiliation', e.target.value)}
              className="w-full px-3 py-2 text-sm bg-neutral-50 border border-neutral-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#C8102E]/20"
            />
          </div>
        </div>
      </div>

      {/* Contact Information Card */}
      <div className="bg-white rounded-xl border border-neutral-200 p-6 shadow-sm space-y-4">
        <div className="flex items-center gap-2 text-neutral-900 font-bold border-b border-neutral-100 pb-3">
          <Phone className="w-5 h-5 text-[#C8102E]" /> Contact Information
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-1">
            <label className="text-xs font-semibold text-neutral-700">Official Contact Phone(s)</label>
            <input
              type="text"
              value={settings.contactPhone}
              onChange={(e) => handleChange('contactPhone', e.target.value)}
              className="w-full px-3 py-2 text-sm bg-neutral-50 border border-neutral-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#C8102E]/20"
            />
          </div>

          <div className="space-y-1">
            <label className="text-xs font-semibold text-neutral-700">Official Contact Email</label>
            <input
              type="email"
              value={settings.contactEmail}
              onChange={(e) => handleChange('contactEmail', e.target.value)}
              className="w-full px-3 py-2 text-sm bg-neutral-50 border border-neutral-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#C8102E]/20"
            />
          </div>

          <div className="md:col-span-2 space-y-1">
            <label className="text-xs font-semibold text-neutral-700">Campus Physical Address</label>
            <textarea
              rows={2}
              value={settings.address}
              onChange={(e) => handleChange('address', e.target.value)}
              className="w-full px-3 py-2 text-sm bg-neutral-50 border border-neutral-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#C8102E]/20"
            />
          </div>
        </div>
      </div>

      {/* Social Profiles Card */}
      <div className="bg-white rounded-xl border border-neutral-200 p-6 shadow-sm space-y-4">
        <div className="flex items-center gap-2 text-neutral-900 font-bold border-b border-neutral-100 pb-3">
          <Globe className="w-5 h-5 text-[#C8102E]" /> Social Media Profiles
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-1">
            <label className="text-xs font-semibold text-neutral-700">Facebook URL</label>
            <input
              type="url"
              value={settings.facebookUrl}
              onChange={(e) => handleChange('facebookUrl', e.target.value)}
              className="w-full px-3 py-2 text-sm bg-neutral-50 border border-neutral-200 rounded-lg"
            />
          </div>

          <div className="space-y-1">
            <label className="text-xs font-semibold text-neutral-700">YouTube Channel URL</label>
            <input
              type="url"
              value={settings.youtubeUrl}
              onChange={(e) => handleChange('youtubeUrl', e.target.value)}
              className="w-full px-3 py-2 text-sm bg-neutral-50 border border-neutral-200 rounded-lg"
            />
          </div>

          <div className="space-y-1">
            <label className="text-xs font-semibold text-neutral-700">Instagram URL</label>
            <input
              type="url"
              value={settings.instagramUrl}
              onChange={(e) => handleChange('instagramUrl', e.target.value)}
              className="w-full px-3 py-2 text-sm bg-neutral-50 border border-neutral-200 rounded-lg"
            />
          </div>

          <div className="space-y-1">
            <label className="text-xs font-semibold text-neutral-700">LinkedIn Page URL</label>
            <input
              type="url"
              value={settings.linkedinUrl}
              onChange={(e) => handleChange('linkedinUrl', e.target.value)}
              className="w-full px-3 py-2 text-sm bg-neutral-50 border border-neutral-200 rounded-lg"
            />
          </div>
        </div>
      </div>
    </form>
  );
}

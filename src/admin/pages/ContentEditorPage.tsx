import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { db, isFirebaseConfigured } from '../../lib/firebase';
import RichTextEditor from '../components/RichTextEditor';
import { toast } from 'sonner';
import {
  Save,
  Loader2,
  ExternalLink,
  Home,
  Info,
  MessageSquare,
  ClipboardList,
  TrendingUp,
  Building,
  GraduationCap
} from 'lucide-react';

interface ContentData {
  [key: string]: any;
}

const SECTION_METADATA: Record<
  string,
  { title: string; subtitle: string; icon: any; publicUrl: string }
> = {
  home: {
    title: 'Home Page Content Editor',
    subtitle: 'Manage hero section headlines, call-to-actions, and key pillar highlights.',
    icon: Home,
    publicUrl: '/',
  },
  about: {
    title: 'About Us Page Content Editor',
    subtitle: 'Edit institution vision, mission statement, history, and core values.',
    icon: Info,
    publicUrl: '/about',
  },
  messages: {
    title: 'Leadership Messages Editor',
    subtitle: 'Update official messages from the Patron, Governing Body, and Principal.',
    icon: MessageSquare,
    publicUrl: '/about/messages',
  },
  admissions: {
    title: 'Admissions Page Content Editor',
    subtitle: 'Configure admission eligibility guidelines, important dates, and links.',
    icon: ClipboardList,
    publicUrl: '/admissions',
  },
  placement: {
    title: 'Placement Records & Cell Editor',
    subtitle: 'Update career statistics, placement cell highlights, and recruiting partners.',
    icon: TrendingUp,
    publicUrl: '/placements',
  },
  infrastructure: {
    title: 'Infrastructure Page Content Editor',
    subtitle: 'Manage campus infrastructure, library, hostel, and digital research lab details.',
    icon: Building,
    publicUrl: '/infrastructure',
  },
  academics: {
    title: 'Academics Page Content Editor',
    subtitle: 'Manage academic program highlights, BSW & MSW descriptions, and affiliation info.',
    icon: GraduationCap,
    publicUrl: '/academics',
  },
};

export const DEFAULT_CONTENT: Record<string, ContentData> = {
  home: {
    heroHeadline: 'Educating for Peace, Development and Social Transformation',
    heroSubtitle: 'North East Institute of Social Sciences and Research (NEISSR) is the first indigenous social work institute in Nagaland offering specialized BSW & MSW programs.',
    heroImageUrl: 'https://images.unsplash.com/photo-1541339907198-e08756dedf3f?auto=format&fit=crop&q=80&w=2000',
    aboutImageUrl: 'https://images.unsplash.com/photo-1523050854058-8df90110c9f1?auto=format&fit=crop&q=80&w=1000',
    primaryCtaText: 'Explore Programmes',
    primaryCtaLink: '/academics',
    secondaryCtaText: 'Apply Online 2024-25',
    secondaryCtaLink: '/admissions',
    announcementTicker: 'NEISSR invites applications for BSW and MSW Batch 2024-25 | Admissions Open',
    studentsEnrolled: '450+',
    alumniNetwork: '1,200+',
    placementRate: '92%',
    campusImage1: 'https://images.unsplash.com/photo-1523240795612-9a054b0db644?auto=format&fit=crop&q=80&w=1000',
    campusCaption1: 'Cultural Day & Traditional Naga Attires',
    campusImage2: 'https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?auto=format&fit=crop&q=80&w=600',
    campusCaption2: '10-Day Rural Camp',
    campusImage3: 'https://images.unsplash.com/photo-1577896851231-70ef18881754?auto=format&fit=crop&q=80&w=600',
    campusCaption3: 'Peace Knit Festival',
    campusImage4: 'https://images.unsplash.com/photo-1427504494785-3a9ca7044f45?auto=format&fit=crop&q=80&w=800',
    campusCaption4: 'Peace Library & Digital Research Lab',
  },
  about: {
    aboutHeading: 'A Premier Institute Dedicated to Peace and Human Development',
    visionStatement: 'To be a center of excellence in social work education, research, peace building, and human development in North East India and beyond.',
    missionStatement: 'To educate and empower young minds with professional social work skills, ethical values, and conflict resolution tools to foster peaceful and self-sustaining communities.',
    historyHtml: '<p>Established in 2014 in Chümoukedima, Nagaland, NEISSR was founded to address the unique social, political, and developmental needs of North East India through specialized social work education.</p>',
  },
  messages: {
    patronName: 'Most Rev. Dr. James Thoppil',
    patronDesignation: 'Bishop of Kohima & Patron, NEISSR',
    patronMessageHtml: '<p>Welcome to NEISSR. Our vision is to empower young men and women to become agents of positive social change and ambassadors of peace across communities.</p>',
    directorName: 'Rev. Dr. C.P. Anto',
    directorDesignation: 'Principal & Founder, Youth Peace Channel',
    directorMessageHtml: '<p>At NEISSR, we integrate professional social work curriculum with practical peace-building tools, preparing graduates for meaningful careers in social change.</p>',
  },
  admissions: {
    admissionNoticeHtml: '<p>Admissions for the 2024-25 academic year are currently open for BSW (3 Years) and MSW (2 Years) with specializations in Community Development, Peace & Conflict Transformation, and Youth Development.</p>',
    eligibilitySummary: 'BSW: Passed 10+2 / Higher Secondary in any stream with minimum 45% marks. MSW: Bachelor Degree in any discipline with 45% marks.',
    importantDates: 'Application Deadline: June 30, 2024 | Entrance Interview: July 5-6, 2024 | Session Commencement: August 1, 2024',
    applicationFormUrl: 'https://neissr.ac.in/apply',
  },
  placement: {
    placementHeading: 'Empowering Graduates for Global & Regional Social Impact',
    placementRateText: '92% Placement & Higher Studies Record',
    topRecruitersText: 'UNICEF, Childline, Youth Peace Channel, Caritas India, PRADAN, Bosco Reach Out, World Vision India, Nagaland State AIDS Control Society',
    averagePackageText: '₹3.6 - ₹5.2 LPA',
    cellContactPerson: 'Dr. Toli H. Zhimomi (Placement Coordinator)',
    cellContactEmail: 'placements@neissr.ac.in',
  },
  infrastructure: {
    infraHeading: 'Campus Infrastructure & Facilities',
    infraDescription: 'NEISSR campus is equipped with modern academic and recreational facilities tailored for professional social work training.',
    libraryDescription: 'The Peace Library holds over 5,000 volumes, specialized journals in social work, peace studies, and digital research databases.',
    hostelInfo: 'Separate hostel facilities are available for men and women students with mess, security, and study spaces.',
    labDescription: 'The Digital Research Lab is equipped with 30+ computers with high-speed internet access for research and data analysis.',
  },
  academics: {
    academicsHeading: 'Academic Programmes',
    bswDescription: 'Bachelor of Social Work (BSW) is a 3-year undergraduate programme providing foundational social work theories, fieldwork exposure, and community engagement.',
    mswDescription: 'Master of Social Work (MSW) is a 2-year postgraduate programme offering specialized tracks in Community Development, Peace & Conflict Transformation, and Youth Development.',
    affiliationText: 'Affiliated to Nagaland University | Recognized by UGC',
  },
};

export default function ContentEditorPage() {
  const { '*' : subPath } = useParams();
  const section = subPath || 'home';
  const meta = SECTION_METADATA[section] || SECTION_METADATA.home;

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [data, setData] = useState<ContentData>({});

  useEffect(() => {
    async function loadContent() {
      setLoading(true);
      const defaults = DEFAULT_CONTENT[section] || DEFAULT_CONTENT.home;
      try {
        if (isFirebaseConfigured) {
          const docRef = section === 'home' ? doc(db, 'pages', 'home') : doc(db, 'content', section);
          const snap = await getDoc(docRef);
          if (snap.exists()) {
            setData({ ...defaults, ...snap.data() });
          } else {
            setData(defaults);
          }
        } else {
          const local = localStorage.getItem(`neissr_content_${section}`);
          if (local) {
            setData({ ...defaults, ...JSON.parse(local) });
          } else {
            setData(defaults);
          }
        }
      } catch (e) {
        console.warn('Failed loading content:', e);
        setData(defaults);
      } finally {
        setLoading(false);
      }
    }
    loadContent();
  }, [section]);

  const handleChange = (field: string, value: any) => {
    setData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      if (isFirebaseConfigured) {
        const docRef = section === 'home' ? doc(db, 'pages', 'home') : doc(db, 'content', section);
        await setDoc(docRef, data);
      } else {
        localStorage.setItem(`neissr_content_${section}`, JSON.stringify(data));
      }
      toast.success(`${meta.title} updated successfully.`);
    } catch (err) {
      console.error('Error saving content:', err);
      toast.error('Failed to save page content.');
    } finally {
      setSaving(false);
    }
  };

  const IconComponent = meta.icon;

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
            <IconComponent className="w-6 h-6 text-[#C8102E]" />
            {meta.title}
          </h1>
          <p className="text-sm text-neutral-500 mt-1">{meta.subtitle}</p>
        </div>

        <div className="flex items-center gap-2">
          <Link
            to={meta.publicUrl}
            target="_blank"
            className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold text-neutral-700 bg-neutral-100 hover:bg-neutral-200 rounded-lg transition-colors"
          >
            <ExternalLink className="w-3.5 h-3.5" /> Live Preview
          </Link>
          <button
            type="submit"
            disabled={saving}
            className="inline-flex items-center gap-2 px-5 py-2 bg-[#C8102E] text-white font-semibold text-xs rounded-lg hover:bg-[#a00d24] transition-colors shadow-sm disabled:opacity-50"
          >
            {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
            Save Content
          </button>
        </div>
      </div>

      {/* Dynamic Form Sections Based on Path */}
      {section === 'home' && (
        <>
          <div className="bg-white rounded-xl border border-neutral-200 p-6 shadow-sm space-y-4">
            <h3 className="font-bold text-neutral-900 text-base border-b border-neutral-100 pb-3">Hero Banner Section</h3>
            <div className="space-y-4">
              <div className="space-y-1">
                <label className="text-xs font-semibold text-neutral-700">Main Hero Headline</label>
                <input
                  type="text"
                  value={data.heroHeadline || ''}
                  onChange={(e) => handleChange('heroHeadline', e.target.value)}
                  className="w-full px-3 py-2 text-sm bg-neutral-50 border border-neutral-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#C8102E]/20"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-semibold text-neutral-700">Hero Subtitle / Description</label>
                <textarea
                  rows={3}
                  value={data.heroSubtitle || ''}
                  onChange={(e) => handleChange('heroSubtitle', e.target.value)}
                  className="w-full px-3 py-2 text-sm bg-neutral-50 border border-neutral-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#C8102E]/20"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-neutral-700">Hero Background Image URL (fallback — used only if no carousel images below)</label>
                  <input
                    type="url"
                    placeholder="https://..."
                    value={data.heroImageUrl || ''}
                    onChange={(e) => handleChange('heroImageUrl', e.target.value)}
                    className="w-full px-3 py-2 text-sm bg-neutral-50 border border-neutral-200 rounded-lg"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-neutral-700">Campus Overview Image URL ("Rooted in Nagaland")</label>
                  <input
                    type="url"
                    placeholder="https://..."
                    value={data.aboutImageUrl || ''}
                    onChange={(e) => handleChange('aboutImageUrl', e.target.value)}
                    className="w-full px-3 py-2 text-sm bg-neutral-50 border border-neutral-200 rounded-lg"
                  />
                </div>
              </div>

              {/* HERO CAROUSEL MANAGER */}
              <div className="mt-6 p-4 bg-blue-50 rounded-xl border-2 border-blue-200 space-y-3">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="text-sm font-bold text-[#003DA5]">🎠 Hero Carousel (Auto-scrolling)</h4>
                    <p className="text-[11px] text-neutral-600 mt-0.5">
                      Add multiple image URLs — they will auto-scroll on the homepage. Leave empty to use single fallback image above.
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      const current = (data as any).heroImages || [];
                      handleChange('heroImages', [...current, '']);
                    }}
                    className="px-3 py-1.5 bg-[#003DA5] hover:bg-[#002d7a] text-white text-xs font-bold rounded-lg whitespace-nowrap"
                  >
                    + Add Image
                  </button>
                </div>

                {/* Interval control */}
                <div className="flex items-center gap-3">
                  <label className="text-xs font-semibold text-neutral-700 whitespace-nowrap">
                    Slide interval:
                  </label>
                  <input
                    type="number"
                    min="2"
                    max="30"
                    value={(data as any).heroIntervalSeconds || 5}
                    onChange={(e) => handleChange('heroIntervalSeconds', parseInt(e.target.value) || 5)}
                    className="w-20 px-2 py-1 text-sm bg-white border border-blue-200 rounded"
                  />
                  <span className="text-xs text-neutral-600">seconds between slides</span>
                </div>

                {/* Image list */}
                <div className="space-y-2">
                  {((data as any).heroImages || []).length === 0 && (
                    <p className="text-xs text-neutral-500 italic py-2">
                      No carousel images yet. Click "+ Add Image" to add one.
                    </p>
                  )}
                  {((data as any).heroImages || []).map((img: string, idx: number) => (
                    <div key={idx} className="flex items-center gap-2">
                      <span className="text-xs font-bold text-[#003DA5] w-6">#{idx + 1}</span>
                      <input
                        type="url"
                        placeholder="https://... (paste image URL — use Cloudinary, ImgBB or any public image link)"
                        value={img}
                        onChange={(e) => {
                          const arr = [...((data as any).heroImages || [])];
                          arr[idx] = e.target.value;
                          handleChange('heroImages', arr);
                        }}
                        className="flex-1 px-2 py-1.5 text-xs bg-white border border-blue-200 rounded focus:border-[#003DA5] outline-none"
                      />
                      {img && (
                        <img
                          src={img}
                          alt=""
                          className="w-10 h-10 object-cover rounded border border-blue-200"
                          onError={(e) => (e.currentTarget.style.display = 'none')}
                        />
                      )}
                      <button
                        type="button"
                        onClick={() => {
                          const arr = ((data as any).heroImages || []).filter((_: any, i: number) => i !== idx);
                          handleChange('heroImages', arr);
                        }}
                        className="px-2 py-1 text-xs text-red-600 hover:bg-red-100 rounded border border-red-200"
                      >
                        Remove
                      </button>
                    </div>
                  ))}
                </div>

                <p className="text-[10px] text-blue-700">
                  💡 Tip: Upload images to Cloudinary or imgbb.com first, then paste the URLs here.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-neutral-700">Primary CTA Text</label>
                  <input
                    type="text"
                    value={data.primaryCtaText || ''}
                    onChange={(e) => handleChange('primaryCtaText', e.target.value)}
                    className="w-full px-3 py-2 text-sm bg-neutral-50 border border-neutral-200 rounded-lg"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-neutral-700">Primary CTA Link</label>
                  <input
                    type="text"
                    value={data.primaryCtaLink || ''}
                    onChange={(e) => handleChange('primaryCtaLink', e.target.value)}
                    className="w-full px-3 py-2 text-sm bg-neutral-50 border border-neutral-200 rounded-lg"
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl border border-neutral-200 p-6 shadow-sm space-y-4">
            <h3 className="font-bold text-neutral-900 text-base border-b border-neutral-100 pb-3">Pillars & Impact Counters</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-1">
                <label className="text-xs font-semibold text-neutral-700">Enrolled Students Counter</label>
                <input
                  type="text"
                  value={data.studentsEnrolled || ''}
                  onChange={(e) => handleChange('studentsEnrolled', e.target.value)}
                  className="w-full px-3 py-2 text-sm bg-neutral-50 border border-neutral-200 rounded-lg"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-semibold text-neutral-700">Alumni Network Counter</label>
                <input
                  type="text"
                  value={data.alumniNetwork || ''}
                  onChange={(e) => handleChange('alumniNetwork', e.target.value)}
                  className="w-full px-3 py-2 text-sm bg-neutral-50 border border-neutral-200 rounded-lg"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-semibold text-neutral-700">Placement Rate Counter</label>
                <input
                  type="text"
                  value={data.placementRate || ''}
                  onChange={(e) => handleChange('placementRate', e.target.value)}
                  className="w-full px-3 py-2 text-sm bg-neutral-50 border border-neutral-200 rounded-lg"
                />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl border border-neutral-200 p-6 shadow-sm space-y-4">
            <div>
              <h3 className="font-bold text-neutral-900 text-base border-b border-neutral-100 pb-2">
                Campus Life Gallery Collage (4 Photos)
              </h3>
              <p className="text-xs text-neutral-500 mt-1">
                Update the 4 photos featured in the "Life at NEISSR" showcase section on the homepage.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
              {/* Photo 1 */}
              <div className="p-4 border border-neutral-200 rounded-xl bg-neutral-50 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-neutral-800 uppercase tracking-wider">Photo 1 (Main Large Card)</span>
                  {data.campusImage1 && (
                    <img src={data.campusImage1} alt="Preview 1" className="w-12 h-12 object-cover rounded-md border" />
                  )}
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-neutral-700">Image URL</label>
                  <input
                    type="url"
                    placeholder="https://..."
                    value={data.campusImage1 || ''}
                    onChange={(e) => handleChange('campusImage1', e.target.value)}
                    className="w-full px-3 py-1.5 text-xs bg-white border border-neutral-200 rounded-lg"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-neutral-700">Caption Title</label>
                  <input
                    type="text"
                    value={data.campusCaption1 || ''}
                    onChange={(e) => handleChange('campusCaption1', e.target.value)}
                    className="w-full px-3 py-1.5 text-xs bg-white border border-neutral-200 rounded-lg"
                  />
                </div>
              </div>

              {/* Photo 2 */}
              <div className="p-4 border border-neutral-200 rounded-xl bg-neutral-50 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-neutral-800 uppercase tracking-wider">Photo 2 (Top Right Card)</span>
                  {data.campusImage2 && (
                    <img src={data.campusImage2} alt="Preview 2" className="w-12 h-12 object-cover rounded-md border" />
                  )}
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-neutral-700">Image URL</label>
                  <input
                    type="url"
                    placeholder="https://..."
                    value={data.campusImage2 || ''}
                    onChange={(e) => handleChange('campusImage2', e.target.value)}
                    className="w-full px-3 py-1.5 text-xs bg-white border border-neutral-200 rounded-lg"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-neutral-700">Caption Title</label>
                  <input
                    type="text"
                    value={data.campusCaption2 || ''}
                    onChange={(e) => handleChange('campusCaption2', e.target.value)}
                    className="w-full px-3 py-1.5 text-xs bg-white border border-neutral-200 rounded-lg"
                  />
                </div>
              </div>

              {/* Photo 3 */}
              <div className="p-4 border border-neutral-200 rounded-xl bg-neutral-50 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-neutral-800 uppercase tracking-wider">Photo 3 (Bottom Left Card)</span>
                  {data.campusImage3 && (
                    <img src={data.campusImage3} alt="Preview 3" className="w-12 h-12 object-cover rounded-md border" />
                  )}
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-neutral-700">Image URL</label>
                  <input
                    type="url"
                    placeholder="https://..."
                    value={data.campusImage3 || ''}
                    onChange={(e) => handleChange('campusImage3', e.target.value)}
                    className="w-full px-3 py-1.5 text-xs bg-white border border-neutral-200 rounded-lg"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-neutral-700">Caption Title</label>
                  <input
                    type="text"
                    value={data.campusCaption3 || ''}
                    onChange={(e) => handleChange('campusCaption3', e.target.value)}
                    className="w-full px-3 py-1.5 text-xs bg-white border border-neutral-200 rounded-lg"
                  />
                </div>
              </div>

              {/* Photo 4 */}
              <div className="p-4 border border-neutral-200 rounded-xl bg-neutral-50 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-neutral-800 uppercase tracking-wider">Photo 4 (Wide Bottom Right Card)</span>
                  {data.campusImage4 && (
                    <img src={data.campusImage4} alt="Preview 4" className="w-12 h-12 object-cover rounded-md border" />
                  )}
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-neutral-700">Image URL</label>
                  <input
                    type="url"
                    placeholder="https://..."
                    value={data.campusImage4 || ''}
                    onChange={(e) => handleChange('campusImage4', e.target.value)}
                    className="w-full px-3 py-1.5 text-xs bg-white border border-neutral-200 rounded-lg"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-neutral-700">Caption Title</label>
                  <input
                    type="text"
                    value={data.campusCaption4 || ''}
                    onChange={(e) => handleChange('campusCaption4', e.target.value)}
                    className="w-full px-3 py-1.5 text-xs bg-white border border-neutral-200 rounded-lg"
                  />
                </div>
              </div>
            </div>
          </div>
        </>
      )}

      {section === 'about' && (
        <div className="bg-white rounded-xl border border-neutral-200 p-6 shadow-sm space-y-4">
          <h3 className="font-bold text-neutral-900 text-base border-b border-neutral-100 pb-3">Institution History & Vision</h3>
          <div className="space-y-4">
            <div className="space-y-1">
              <label className="text-xs font-semibold text-neutral-700">About Heading</label>
              <input
                type="text"
                value={data.aboutHeading || ''}
                onChange={(e) => handleChange('aboutHeading', e.target.value)}
                className="w-full px-3 py-2 text-sm bg-neutral-50 border border-neutral-200 rounded-lg"
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-semibold text-neutral-700">Vision Statement</label>
              <textarea
                rows={2}
                value={data.visionStatement || ''}
                onChange={(e) => handleChange('visionStatement', e.target.value)}
                className="w-full px-3 py-2 text-sm bg-neutral-50 border border-neutral-200 rounded-lg"
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-semibold text-neutral-700">Mission Statement</label>
              <textarea
                rows={2}
                value={data.missionStatement || ''}
                onChange={(e) => handleChange('missionStatement', e.target.value)}
                className="w-full px-3 py-2 text-sm bg-neutral-50 border border-neutral-200 rounded-lg"
              />
            </div>

            <RichTextEditor
              label="Institutional History & Background"
              value={data.historyHtml || ''}
              onChange={(val) => handleChange('historyHtml', val)}
            />
          </div>
        </div>
      )}

      {section === 'messages' && (
        <div className="bg-white rounded-xl border border-neutral-200 p-6 shadow-sm space-y-6">
          <h3 className="font-bold text-neutral-900 text-base border-b border-neutral-100 pb-3">Patron & Director Messages</h3>
          <div className="space-y-6">
            <div className="space-y-3 pb-4 border-b border-neutral-200">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-neutral-700">Patron Name</label>
                  <input
                    type="text"
                    value={data.patronName || ''}
                    onChange={(e) => handleChange('patronName', e.target.value)}
                    className="w-full px-3 py-2 text-sm bg-neutral-50 border border-neutral-200 rounded-lg"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-neutral-700">Designation</label>
                  <input
                    type="text"
                    value={data.patronDesignation || ''}
                    onChange={(e) => handleChange('patronDesignation', e.target.value)}
                    className="w-full px-3 py-2 text-sm bg-neutral-50 border border-neutral-200 rounded-lg"
                  />
                </div>
              </div>
              <RichTextEditor
                label="Patron Message"
                value={data.patronMessageHtml || ''}
                onChange={(val) => handleChange('patronMessageHtml', val)}
              />
            </div>

            <div className="space-y-3">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-neutral-700">Director / Principal Name</label>
                  <input
                    type="text"
                    value={data.directorName || ''}
                    onChange={(e) => handleChange('directorName', e.target.value)}
                    className="w-full px-3 py-2 text-sm bg-neutral-50 border border-neutral-200 rounded-lg"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-neutral-700">Designation</label>
                  <input
                    type="text"
                    value={data.directorDesignation || ''}
                    onChange={(e) => handleChange('directorDesignation', e.target.value)}
                    className="w-full px-3 py-2 text-sm bg-neutral-50 border border-neutral-200 rounded-lg"
                  />
                </div>
              </div>
              <RichTextEditor
                label="Principal's Message"
                value={data.directorMessageHtml || ''}
                onChange={(val) => handleChange('directorMessageHtml', val)}
              />
            </div>
          </div>
        </div>
      )}

      {section === 'admissions' && (
        <div className="bg-white rounded-xl border border-neutral-200 p-6 shadow-sm space-y-4">
          <h3 className="font-bold text-neutral-900 text-base border-b border-neutral-100 pb-3">Admission Guidelines & Forms</h3>
          <div className="space-y-4">
            <RichTextEditor
              label="Admission Notice"
              value={data.admissionNoticeHtml || ''}
              onChange={(val) => handleChange('admissionNoticeHtml', val)}
            />

            <div className="space-y-1">
              <label className="text-xs font-semibold text-neutral-700">Eligibility Overview</label>
              <textarea
                rows={2}
                value={data.eligibilitySummary || ''}
                onChange={(e) => handleChange('eligibilitySummary', e.target.value)}
                className="w-full px-3 py-2 text-sm bg-neutral-50 border border-neutral-200 rounded-lg"
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-semibold text-neutral-700">Important Dates Schedule</label>
              <input
                type="text"
                value={data.importantDates || ''}
                onChange={(e) => handleChange('importantDates', e.target.value)}
                className="w-full px-3 py-2 text-sm bg-neutral-50 border border-neutral-200 rounded-lg"
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-semibold text-neutral-700">Online Application External Form URL</label>
              <input
                type="url"
                value={data.applicationFormUrl || ''}
                onChange={(e) => handleChange('applicationFormUrl', e.target.value)}
                className="w-full px-3 py-2 text-sm bg-neutral-50 border border-neutral-200 rounded-lg"
              />
            </div>
          </div>
        </div>
      )}

      {section === 'placement' && (
        <div className="bg-white rounded-xl border border-neutral-200 p-6 shadow-sm space-y-4">
          <h3 className="font-bold text-neutral-900 text-base border-b border-neutral-100 pb-3">Placement Statistics & Recruiters</h3>
          <div className="space-y-4">
            <div className="space-y-1">
              <label className="text-xs font-semibold text-neutral-700">Placement Cell Heading</label>
              <input
                type="text"
                value={data.placementHeading || ''}
                onChange={(e) => handleChange('placementHeading', e.target.value)}
                className="w-full px-3 py-2 text-sm bg-neutral-50 border border-neutral-200 rounded-lg"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-xs font-semibold text-neutral-700">Placement Rate Badge</label>
                <input
                  type="text"
                  value={data.placementRateText || ''}
                  onChange={(e) => handleChange('placementRateText', e.target.value)}
                  className="w-full px-3 py-2 text-sm bg-neutral-50 border border-neutral-200 rounded-lg"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-semibold text-neutral-700">Average Salary Package</label>
                <input
                  type="text"
                  value={data.averagePackageText || ''}
                  onChange={(e) => handleChange('averagePackageText', e.target.value)}
                  className="w-full px-3 py-2 text-sm bg-neutral-50 border border-neutral-200 rounded-lg"
                />
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-xs font-semibold text-neutral-700">Top Recruiting Partners & NGOs</label>
              <textarea
                rows={3}
                value={data.topRecruitersText || ''}
                onChange={(e) => handleChange('topRecruitersText', e.target.value)}
                className="w-full px-3 py-2 text-sm bg-neutral-50 border border-neutral-200 rounded-lg"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-xs font-semibold text-neutral-700">Placement Coordinator Name</label>
                <input
                  type="text"
                  value={data.cellContactPerson || ''}
                  onChange={(e) => handleChange('cellContactPerson', e.target.value)}
                  className="w-full px-3 py-2 text-sm bg-neutral-50 border border-neutral-200 rounded-lg"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-semibold text-neutral-700">Placement Cell Email</label>
                <input
                  type="email"
                  value={data.cellContactEmail || ''}
                  onChange={(e) => handleChange('cellContactEmail', e.target.value)}
                  className="w-full px-3 py-2 text-sm bg-neutral-50 border border-neutral-200 rounded-lg"
                />
              </div>
            </div>
          </div>
        </div>
      )}
      {section === 'infrastructure' && (
        <div className="bg-white rounded-xl border border-neutral-200 p-6 shadow-sm space-y-4">
          <h3 className="font-bold text-neutral-900 text-base border-b border-neutral-100 pb-3">Infrastructure & Facilities Overview</h3>
          <div className="space-y-4">
            <div className="space-y-1">
              <label className="text-xs font-semibold text-neutral-700">Page Heading</label>
              <input
                type="text"
                value={data.infraHeading || ''}
                onChange={(e) => handleChange('infraHeading', e.target.value)}
                className="w-full px-3 py-2 text-sm bg-neutral-50 border border-neutral-200 rounded-lg"
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-semibold text-neutral-700">Campus Overview Description</label>
              <textarea
                rows={3}
                value={data.infraDescription || ''}
                onChange={(e) => handleChange('infraDescription', e.target.value)}
                className="w-full px-3 py-2 text-sm bg-neutral-50 border border-neutral-200 rounded-lg"
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-semibold text-neutral-700">Peace Library Details</label>
              <textarea
                rows={3}
                value={data.libraryDescription || ''}
                onChange={(e) => handleChange('libraryDescription', e.target.value)}
                className="w-full px-3 py-2 text-sm bg-neutral-50 border border-neutral-200 rounded-lg"
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-semibold text-neutral-700">Hostel & Accommodation Information</label>
              <textarea
                rows={2}
                value={data.hostelInfo || ''}
                onChange={(e) => handleChange('hostelInfo', e.target.value)}
                className="w-full px-3 py-2 text-sm bg-neutral-50 border border-neutral-200 rounded-lg"
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-semibold text-neutral-700">Digital Research Lab & IT Facilities</label>
              <textarea
                rows={2}
                value={data.labDescription || ''}
                onChange={(e) => handleChange('labDescription', e.target.value)}
                className="w-full px-3 py-2 text-sm bg-neutral-50 border border-neutral-200 rounded-lg"
              />
            </div>
          </div>
        </div>
      )}

      {section === 'academics' && (
        <div className="bg-white rounded-xl border border-neutral-200 p-6 shadow-sm space-y-4">
          <h3 className="font-bold text-neutral-900 text-base border-b border-neutral-100 pb-3">Academics Page Highlights</h3>
          <div className="space-y-4">
            <div className="space-y-1">
              <label className="text-xs font-semibold text-neutral-700">Academics Banner Title</label>
              <input
                type="text"
                value={data.academicsHeading || ''}
                onChange={(e) => handleChange('academicsHeading', e.target.value)}
                className="w-full px-3 py-2 text-sm bg-neutral-50 border border-neutral-200 rounded-lg"
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-semibold text-neutral-700">BSW Programme Highlight</label>
              <textarea
                rows={3}
                value={data.bswDescription || ''}
                onChange={(e) => handleChange('bswDescription', e.target.value)}
                className="w-full px-3 py-2 text-sm bg-neutral-50 border border-neutral-200 rounded-lg"
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-semibold text-neutral-700">MSW Programme Highlight</label>
              <textarea
                rows={3}
                value={data.mswDescription || ''}
                onChange={(e) => handleChange('mswDescription', e.target.value)}
                className="w-full px-3 py-2 text-sm bg-neutral-50 border border-neutral-200 rounded-lg"
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-semibold text-neutral-700">University Affiliation & Recognition Text</label>
              <input
                type="text"
                value={data.affiliationText || ''}
                onChange={(e) => handleChange('affiliationText', e.target.value)}
                className="w-full px-3 py-2 text-sm bg-neutral-50 border border-neutral-200 rounded-lg"
              />
            </div>
          </div>
        </div>
      )}
    </form>
  );
}

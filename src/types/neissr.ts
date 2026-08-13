export interface FacultyMember {
  id: string;
  slug: string;
  fullName: string;
  designation: string;
  department: string;
  qualifications: string[];
  bioHtml?: string;
  email?: string;
  photoUrl?: string;
  order: number;
  status: 'published' | 'draft';
  type: 'teaching' | 'non-teaching' | 'management';
}

export interface NewsItem {
  id: string;
  slug: string;
  title: string;
  category: string;
  coverImageUrl?: string;
  bodyHtml: string;
  excerpt: string;
  publishedAt: string;
  status: 'published' | 'draft';
}

export interface EventItem {
  id: string;
  slug: string;
  title: string;
  startAt: string;
  endAt?: string;
  venue: string;
  posterUrl?: string;
  descriptionHtml: string;
  category: string;
  status: 'published' | 'draft';
}

export interface DocumentItem {
  id: string;
  title: string;
  slug: string;
  category: 'prospectus' | 'academic-calendar' | 'examination-manual' | 'nirf' | 'naac' | 'affiliations' | 'mandatory-disclosures' | 'magazines' | 'other';
  fileUrl?: string;
  fileName?: string;
  fileSize?: string;
  publishedAt: string;
  description?: string;
  status: 'published' | 'draft';
}

export interface ClubItem {
  id?: string;
  slug: string;
  name: string;
  tagline: string;
  descriptionHtml: string;
  coverImageUrl?: string;
  officeBearers: { role: string; name: string }[];
  activityLog?: { date: string; title: string; description: string }[];
  status?: 'published' | 'draft';
}

export type Achievement = AchievementItem;
export type Club = ClubItem;
export type NewsArticle = NewsItem;

export interface ForumItem {
  slug: string;
  name: string;
  tagline: string;
  descriptionHtml: string;
  officeBearers?: { role: string; name: string }[];
}

export interface AchievementItem {
  id: string;
  title: string;
  achieverName: string;
  category: string;
  year: string;
  photoUrl?: string;
  descriptionHtml: string;
  status?: 'published' | 'draft';
}

export interface PlacementStudent {
  name: string;
  photoUrl?: string;
}

export interface StudentCouncilMember {
  role: string;
  name: string;
  photoUrl?: string;
}

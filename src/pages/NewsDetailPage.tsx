import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { SEED_NEWS } from '../data/seedData';
import { formatDate } from '../lib/date';
import { ArrowLeft, Calendar, User } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { collection, getDocs } from 'firebase/firestore';
import { db, isFirebaseConfigured } from '../lib/firebase';
import { NewsArticle } from '../types/neissr';

/**
 * Convert plain-text (with newlines, bullets, dashes) into safe HTML that
 * preserves the writer's structure:
 * - Blocks separated by blank lines become paragraphs
 * - Lines starting with `-`, `*`, `•`, `‣` become bullet lists
 * - Lines starting with `1.`, `2.` etc. become numbered lists
 * - Single newlines within blocks become <br>
 * If the content already contains HTML tags, return it as-is.
 */
function renderContent(raw: string): string {
  if (!raw) return '';
  // If it already looks like HTML, trust it.
  if (/<\/?(p|div|ul|ol|li|h[1-6]|br|strong|em|a)\b/i.test(raw)) return raw;

  const blocks = raw.split(/\n\s*\n/); // blank-line separated blocks
  const html = blocks
    .map((block) => {
      const lines = block.split('\n').map((l) => l.trim()).filter(Boolean);
      if (lines.length === 0) return '';

      // Bullet list?
      const isBullet = lines.every((l) => /^[-*•‣]\s+/.test(l));
      if (isBullet) {
        const items = lines.map((l) => `<li>${l.replace(/^[-*•‣]\s+/, '')}</li>`).join('');
        return `<ul>${items}</ul>`;
      }

      // Numbered list?
      const isNumbered = lines.every((l) => /^\d+[.)]\s+/.test(l));
      if (isNumbered) {
        const items = lines.map((l) => `<li>${l.replace(/^\d+[.)]\s+/, '')}</li>`).join('');
        return `<ol>${items}</ol>`;
      }

      // Regular paragraph — preserve intra-block line breaks
      return `<p>${lines.join('<br>')}</p>`;
    })
    .join('\n');

  return html;
}

interface NewsRecord extends NewsArticle {
  contentHtml?: string;
  coverImageUrl?: string;
  author?: string;
}

export default function NewsDetailPage() {
  const { slug } = useParams<{ slug: string }>();

  const { data: news, isLoading } = useQuery<NewsRecord | undefined>({
    queryKey: ['public-news-detail', slug],
    queryFn: async () => {
      if (!isFirebaseConfigured) {
        return SEED_NEWS.find((n) => n.slug === slug || n.id === slug) as NewsRecord | undefined;
      }
      const snap = await getDocs(collection(db, 'news'));
      if (snap.empty) {
        return SEED_NEWS.find((n) => n.slug === slug || n.id === slug) as NewsRecord | undefined;
      }
      const items = snap.docs.map((d) => ({ id: d.id, ...d.data() })) as NewsRecord[];
      return (
        items.find((n) => n.slug === slug || n.id === slug) ||
        (SEED_NEWS.find((n) => n.slug === slug || n.id === slug) as NewsRecord | undefined)
      );
    },
  });

  if (isLoading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-[#003DA5] border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!news) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center gap-4">
        <p className="text-neutral-600">Article not found.</p>
        <Link to="/news" className="text-[#003DA5] font-semibold underline">Back to News</Link>
      </div>
    );
  }

  // Field mapping — supports both new (contentHtml) and legacy (bodyHtml) records
  const rawBody = news.contentHtml || news.bodyHtml || '';
  const bodyHtml = renderContent(rawBody);
  const cover = news.coverImageUrl || '';

  return (
    <div className="bg-[#FAF9F7] min-h-screen">
      {/* Hero with cover image */}
      {cover ? (
        <div className="relative w-full h-72 md:h-[420px] overflow-hidden bg-neutral-900">
          <img src={cover} alt={news.title} className="w-full h-full object-cover opacity-90" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
          <div className="absolute inset-x-0 bottom-0 max-w-5xl mx-auto px-6 md:px-12 pb-8 text-white">
            <div className="flex items-center gap-3 text-xs mb-3">
              <span className="bg-[#C8102E] text-white px-3 py-1 rounded-full font-semibold uppercase tracking-wider">
                {news.category}
              </span>
              <span className="inline-flex items-center gap-1 text-neutral-200">
                <Calendar className="w-3 h-3" /> {formatDate(news.publishedAt)}
              </span>
            </div>
            <h1 className="font-serif text-3xl md:text-5xl font-bold leading-tight max-w-4xl">
              {news.title}
            </h1>
          </div>
        </div>
      ) : (
        <div className="bg-gradient-to-r from-[#003DA5] to-[#0052CC] text-white py-14 px-6">
          <div className="max-w-5xl mx-auto">
            <div className="flex items-center gap-3 text-xs mb-3">
              <span className="bg-[#C8102E] text-white px-3 py-1 rounded-full font-semibold uppercase tracking-wider">
                {news.category}
              </span>
              <span className="inline-flex items-center gap-1 text-neutral-200">
                <Calendar className="w-3 h-3" /> {formatDate(news.publishedAt)}
              </span>
            </div>
            <h1 className="font-serif text-3xl md:text-5xl font-bold">{news.title}</h1>
          </div>
        </div>
      )}

      {/* Body */}
      <div className="max-w-4xl mx-auto px-6 md:px-8 py-10">
        <Link
          to="/news"
          className="inline-flex items-center gap-1 text-sm font-semibold text-neutral-600 hover:text-[#003DA5] mb-6"
        >
          <ArrowLeft className="w-4 h-4" /> Back to News
        </Link>

        {news.author && (
          <div className="flex items-center gap-2 text-sm text-neutral-500 mb-6">
            <User className="w-4 h-4" />
            <span>By {news.author}</span>
          </div>
        )}

        {news.excerpt && (
          <p className="text-lg md:text-xl text-neutral-700 leading-relaxed italic mb-8 pb-6 border-b border-neutral-200">
            {news.excerpt}
          </p>
        )}

        <article
          className="prose prose-lg max-w-none text-neutral-800 leading-relaxed
            prose-headings:font-serif prose-headings:text-[#003DA5] prose-headings:font-bold
            prose-h2:text-2xl prose-h2:mt-8 prose-h2:mb-4
            prose-h3:text-xl prose-h3:mt-6 prose-h3:mb-3
            prose-p:mb-5 prose-p:leading-relaxed
            prose-ul:my-4 prose-ol:my-4 prose-li:mb-1.5 prose-li:text-neutral-700
            prose-strong:text-neutral-900 prose-strong:font-bold
            prose-a:text-[#003DA5] prose-a:underline"
          dangerouslySetInnerHTML={{ __html: bodyHtml }}
        />
      </div>
    </div>
  );
}

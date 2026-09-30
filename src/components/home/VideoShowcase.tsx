import React from 'react';
import { Instagram } from 'lucide-react';

type ShowcaseVideo = {
  title?: string;
  sourceType?: 'upload' | 'instagram';
  videoUrl?: string;
  instagramUrl?: string;
  featured?: boolean;
};

type Props = {
  videos?: ShowcaseVideo[];
  title?: string;
  subtitle?: string;
};

function getInstagramEmbedUrl(url?: string) {
  if (!url) return '';

  const clean = url.split('?')[0].replace(/\/+$/, '');

  if (
    clean.includes('instagram.com/reel/') ||
    clean.includes('instagram.com/p/') ||
    clean.includes('instagram.com/tv/')
  ) {
    return `${clean}/embed/`;
  }

  return clean;
}

function VideoCard({
  video,
  className = '',
}: {
  video: ShowcaseVideo;
  className?: string;
}) {
  const isInstagram = video.sourceType === 'instagram';
  const embedUrl = getInstagramEmbedUrl(video.instagramUrl);

  return (
    <div
      className={`relative overflow-hidden rounded-[28px] bg-neutral-950 border border-neutral-200 shadow-[0_25px_70px_rgba(0,0,0,0.18)] ${className}`}
    >
      <div className="absolute inset-0 pointer-events-none ring-1 ring-inset ring-white/20 rounded-[28px] z-20" />

      <div className="h-full flex flex-col bg-black">
        <div className="relative flex-1 min-h-0 overflow-hidden">
          {isInstagram && embedUrl ? (
            <iframe
              src={embedUrl}
              title={video.title || 'NEISSR Instagram Reel'}
              className="absolute inset-0 w-full h-full bg-white"
              frameBorder="0"
              scrolling="no"
              loading="lazy"
              allow="autoplay; clipboard-write; encrypted-media; picture-in-picture; web-share"
              allowFullScreen
            />
          ) : video.videoUrl ? (
            <video
              src={video.videoUrl}
              controls
              playsInline
              preload="metadata"
              className="absolute inset-0 w-full h-full object-cover bg-black"
            />
          ) : (
            <div className="absolute inset-0 flex items-center justify-center text-white/60 text-sm">
              Video unavailable
            </div>
          )}
        </div>

        {(video.title || (isInstagram && video.instagramUrl)) && (
          <div className="relative z-30 bg-white px-4 py-3 border-t border-neutral-200">
            {video.title && (
              <div className="text-sm font-semibold text-neutral-900 line-clamp-1">
                {video.title}
              </div>
            )}

            {isInstagram && video.instagramUrl && (
              <a
                href={video.instagramUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-1 inline-flex items-center gap-1.5 text-[11px] font-bold text-[#C8102E] hover:underline"
              >
                <Instagram className="w-3.5 h-3.5" />
                View on Instagram
              </a>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

export default function VideoShowcase({
  videos = [],
  title = 'NEISSR in Motion',
  subtitle = 'Stories, experiences and moments from the NEISSR community.',
}: Props) {
  const validVideos = videos.filter(
    (video) =>
      (video.sourceType === 'instagram' && video.instagramUrl) ||
      (video.sourceType !== 'instagram' && video.videoUrl)
  );

  if (validVideos.length === 0) return null;

  const featured =
    validVideos.find((video) => video.featured) || validVideos[0];

  const others = validVideos.filter((video) => video !== featured);

  const desktopVideos = [
    others[0],
    others[1],
    featured,
    others[2],
    others[3],
  ].filter(Boolean) as ShowcaseVideo[];

  const desktopPositions = [
    'left-[2%] top-[120px] w-[210px] h-[350px] -rotate-[10deg] z-10',
    'left-[20%] top-[75px] w-[245px] h-[405px] -rotate-[5deg] z-20',
    'left-1/2 -translate-x-1/2 top-[15px] w-[300px] h-[500px] z-40',
    'right-[20%] top-[75px] w-[245px] h-[405px] rotate-[5deg] z-20',
    'right-[2%] top-[120px] w-[210px] h-[350px] rotate-[10deg] z-10',
  ];

  return (
    <section className="relative py-20 md:py-24 bg-white overflow-hidden border-t border-neutral-100">
      <div className="max-w-[1440px] mx-auto px-4 md:px-8">
        <div className="text-center max-w-3xl mx-auto">
          <div className="text-xs font-semibold text-[#C8102E] uppercase tracking-[0.18em]">
            Stories From NEISSR
          </div>

          <h2 className="font-serif text-3xl md:text-5xl font-bold text-neutral-900 mt-2">
            {title}
          </h2>

          {subtitle && (
            <p className="text-neutral-500 text-sm md:text-base mt-4 leading-relaxed">
              {subtitle}
            </p>
          )}
        </div>

        {/* Desktop curved five-card presentation */}
        <div className="hidden md:block relative h-[565px] mt-10 lg:mt-14 [perspective:1400px]">
          <div className="absolute left-1/2 -translate-x-1/2 bottom-3 w-[72%] h-16 bg-black/10 blur-3xl rounded-full" />

          {desktopVideos.map((video, index) => (
            <VideoCard
              key={`${video.videoUrl || video.instagramUrl}-${index}`}
              video={video}
              className={`absolute transition-all duration-500 hover:rotate-0 hover:-translate-y-3 hover:z-50 ${desktopPositions[index]}`}
            />
          ))}
        </div>

        {/* Mobile */}
        <div className="md:hidden mt-10 -mx-4">
          <div className="flex gap-4 overflow-x-auto snap-x snap-mandatory px-4 pb-6 scrollbar-hide">
            {[featured, ...others].map((video, index) => (
              <VideoCard
                key={`${video.videoUrl || video.instagramUrl}-${index}`}
                video={video}
                className="shrink-0 w-[78vw] max-w-[320px] h-[470px] snap-center"
              />
            ))}
          </div>

          <p className="text-center text-[11px] text-neutral-400 mt-1">
            Swipe to explore more videos
          </p>
        </div>
      </div>
    </section>
  );
}

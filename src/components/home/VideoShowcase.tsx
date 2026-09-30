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
              Coming Soon
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
      video.sourceType === 'instagram'
        ? Boolean(video.instagramUrl)
        : Boolean(video.videoUrl)
  );

  const featuredIndex = validVideos.findIndex((video) => video.featured);
  const featured =
    featuredIndex >= 0
      ? validVideos[featuredIndex]
      : (validVideos[0] ?? {});

  const others = validVideos.filter(
    (_, index) => index !== (featuredIndex >= 0 ? featuredIndex : 0)
  );

  const desktopVideos: ShowcaseVideo[] = [
    others[0] ?? {},
    others[1] ?? {},
    others[2] ?? {},
    featured,
    others[3] ?? {},
    others[4] ?? {},
    others[5] ?? {},
  ];

  const mobileVideos: ShowcaseVideo[] = [featured, ...others].slice(0, 7);

  while (mobileVideos.length < 7) {
    mobileVideos.push({});
  }

  const desktopPositions = [
    'w-[190px] h-[330px] -rotate-[12deg] translate-y-3 z-10',
    'w-[170px] h-[290px] -rotate-[8deg] translate-y-7 -ml-7 z-20',
    'w-[150px] h-[250px] -rotate-[4deg] translate-y-10 -ml-6 z-30',
    'w-[155px] h-[245px] -ml-5 z-40',
    'w-[150px] h-[250px] rotate-[4deg] translate-y-10 -ml-5 z-30',
    'w-[170px] h-[290px] rotate-[8deg] translate-y-7 -ml-6 z-20',
    'w-[190px] h-[330px] rotate-[12deg] translate-y-3 -ml-7 z-10',
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
        <div className="hidden md:flex relative h-[390px] max-w-[1100px] mx-auto mt-8 lg:mt-10 items-end justify-center [perspective:1400px]">
          <div className="absolute left-1/2 -translate-x-1/2 bottom-3 w-[72%] h-16 bg-black/10 blur-3xl rounded-full" />

          {desktopVideos.map((video, index) => (
            <VideoCard
              key={`${video.videoUrl || video.instagramUrl}-${index}`}
              video={video}
              className={`shrink-0 transition-all duration-500 hover:rotate-0 hover:-translate-y-3 hover:z-50 ${desktopPositions[index]}`}
            />
          ))}
        </div>

        {/* Mobile */}
        <div className="md:hidden mt-10 -mx-4">
          <div className="flex gap-4 overflow-x-auto snap-x snap-mandatory px-4 pb-6 scrollbar-hide">
            {mobileVideos.map((video, index) => (
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

import React from 'react';

export interface UniversalVideoPlayerProps {
  videoPath?: string | null;
  videoUrl?: string | null;
  src?: string | null;
  poster?: string | null;
  className?: string;
  controls?: boolean;
  autoPlay?: boolean;
  loop?: boolean;
  muted?: boolean;
}

export const UniversalVideoPlayer: React.FC<UniversalVideoPlayerProps> = ({
  videoPath,
  videoUrl,
  src,
  poster,
  className = '',
  controls = true,
  autoPlay = false,
  loop = false,
  muted = false,
}) => {
  // MEDIA PRIORITY: Uploaded Video (videoPath) MUST take priority over external Video URL (videoUrl)
  const activeSrc = videoPath || videoUrl || src;

  if (!activeSrc) {
    return null;
  }

  // 1. YouTube check
  const ytMatch = activeSrc.match(/(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|watch\?.+&v=))([\w-]{11})/i);
  if (ytMatch && ytMatch[1]) {
    const videoId = ytMatch[1];
    const embedUrl = `https://www.youtube-nocookie.com/embed/${videoId}?autoplay=${autoPlay ? 1 : 0}&mute=${muted ? 1 : 0}&loop=${loop ? 1 : 0}&rel=0`;
    return (
      <div className={`relative w-full aspect-video rounded-3xl overflow-hidden bg-black shadow-lg ${className}`}>
        <iframe
          src={embedUrl}
          title="YouTube video player"
          className="absolute top-0 left-0 w-full h-full border-0"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
          allowFullScreen
        />
      </div>
    );
  }

  // 2. Vimeo check
  const vimeoMatch = activeSrc.match(/(?:vimeo\.com\/|player\.vimeo\.com\/video\/)([0-9]+)/i);
  if (vimeoMatch && vimeoMatch[1]) {
    const videoId = vimeoMatch[1];
    const embedUrl = `https://player.vimeo.com/video/${videoId}?autoplay=${autoPlay ? 1 : 0}&muted=${muted ? 1 : 0}&loop=${loop ? 1 : 0}`;
    return (
      <div className={`relative w-full aspect-video rounded-3xl overflow-hidden bg-black shadow-lg ${className}`}>
        <iframe
          src={embedUrl}
          title="Vimeo video player"
          className="absolute top-0 left-0 w-full h-full border-0"
          allow="autoplay; fullscreen; picture-in-picture"
          allowFullScreen
        />
      </div>
    );
  }

  // 3. Direct MP4/WebM/MOV or Local Storage file path
  return (
    <div className={`relative w-full overflow-hidden rounded-3xl bg-black ${className}`}>
      <video
        src={activeSrc}
        controls={controls}
        autoPlay={autoPlay}
        loop={loop}
        muted={muted}
        playsInline
        poster={poster || undefined}
        className="w-full h-full object-cover max-h-[600px]"
      />
    </div>
  );
};


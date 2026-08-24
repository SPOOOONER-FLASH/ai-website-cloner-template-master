import type { VideoRef } from "@/data/types";
import { cn } from "@/lib/utils";

/**
 * Plays a product video, whether it is a file this site serves or one hosted on YouTube
 * or Vimeo.
 *
 * The two are told apart by URL rather than by a flag in the content, so whoever fills
 * the field in the CMS pastes what they have and does not have to know which kind it is.
 */

/** Returns the video id when the URL is a YouTube link, otherwise null. */
function youTubeId(url: string): string | null {
  const match = url.match(
    /(?:youtube\.com\/(?:watch\?(?:.*&)?v=|embed\/|shorts\/)|youtu\.be\/)([\w-]{11})/,
  );
  return match ? match[1] : null;
}

/** Returns the video id when the URL is a Vimeo link, otherwise null. */
function vimeoId(url: string): string | null {
  const match = url.match(/vimeo\.com\/(?:video\/)?(\d+)/);
  return match ? match[1] : null;
}

export function ProductVideo({ video, className }: { video: VideoRef; className?: string }) {
  const yt = youTubeId(video.src);
  const vimeo = vimeoId(video.src);

  if (yt || vimeo) {
    /*
      Privacy-preserving embeds. youtube-nocookie and Vimeo's dnt=1 both stop the
      provider writing identifiers before the visitor presses play, which keeps an
      embedded product clip from quietly becoming a consent-banner problem.
    */
    const src = yt
      ? `https://www.youtube-nocookie.com/embed/${yt}?rel=0`
      : `https://player.vimeo.com/video/${vimeo}?dnt=1`;

    return (
      <div className={cn("relative aspect-video w-full bg-surface-alt", className)}>
        <iframe
          src={src}
          title={video.label}
          loading="lazy"
          allow="accelerometer; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
          className="absolute inset-0 h-full w-full border-0"
        />
      </div>
    );
  }

  /*
    Self-hosted. `preload="none"` because a catalogue page can carry several of these and
    the browser would otherwise start fetching every one before the visitor asks for any;
    the poster is what they see until then.
  */
  return (
    <video
      controls
      preload="none"
      poster={video.poster?.src}
      aria-label={video.label}
      className={cn("aspect-video w-full bg-surface-alt", className)}
    >
      <source src={video.src} />
      {/* Reached only when the browser cannot play the file at all. */}
      <a href={video.src}>Download the video</a>
    </video>
  );
}

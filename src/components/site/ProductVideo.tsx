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
    Self-hosted.

    ---------------------------------------------------------------------------
    `preload="metadata"`, NOT `"none"` — CHANGED 2026-09-14

    It was `"none"`, and the reason given was that "a catalogue page can carry several of
    these". That is no longer true and has not been for a while: every one of the 192
    products with a clip has exactly one.

    What is true is that Search Console reports all 30 video pages it has looked at so far
    under 「视频不在观看页面上」— Google could not find a video on the page it was told
    the video was on. With `preload="none"` the element exists but has no media at all:
    no duration, no dimensions, no first frame, nothing a renderer can recognise as a
    playing video. `"metadata"` fetches the file header only — a few kilobytes, not the
    clip — which is what gives the player something to be.

    ⚠ Honest about the limit of this: Google does not say which of its checks failed, so
    this is the most likely cause rather than a proven one. The other two candidates were
    checked and ruled out first — 27 of the 28 flagged files are present and served (the
    28th is a pre-rename URL Google still holds, `033-panic-exit-device.mp4`, which is now
    `-trim`), and the player is in the main column rather than behind a tab or a details
    element. Nor is it the server: the deployed mp4 answers with `Content-Type: video/mp4`
    and `Accept-Ranges: bytes`, and a Range request returns `206 Partial Content` with the
    right `content-range` — which is exactly how Google fetches video.
    If the report does not clear after a re-crawl, the next thing to try is
    lifting the VideoObject out of the Product's `subjectOf` into its own top-level node.

    `type` is stated so the browser and the crawler can identify the media without
    fetching it first. It was missing entirely.
  */
  const mimeType = video.src.endsWith(".webm")
    ? "video/webm"
    : video.src.endsWith(".ogv")
      ? "video/ogg"
      : "video/mp4";

  return (
    <video
      controls
      preload="metadata"
      poster={video.poster?.src}
      aria-label={video.label}
      className={cn("aspect-video w-full bg-surface-alt", className)}
    >
      <source src={video.src} type={mimeType} />
      {/* Reached only when the browser cannot play the file at all. */}
      <a href={video.src}>Download the video</a>
    </video>
  );
}

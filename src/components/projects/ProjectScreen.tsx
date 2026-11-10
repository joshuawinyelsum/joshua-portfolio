import { Project } from '../../types';
import { getProjectCover, projectLive } from '../../data/projectMedia';
import { LivePreview } from './LivePreview';
import { MacBrowserFrame } from './MacBrowserFrame';

export type PreviewKind = 'live' | 'screenshot' | 'none';

/** What can honestly be shown for a project. */
export function getPreviewKind(project: Project): PreviewKind {
  if (projectLive[project.id]?.embeddable) return 'live';
  if (getProjectCover(project.id)) return 'screenshot';
  return 'none';
}

/** Host and path as a visitor would recognise it: "mabia-ai.vercel.app/login". */
const displayAddress = (url: string) => {
  try {
    const { host, pathname } = new URL(url);
    return host + (pathname === '/' ? '' : pathname.replace(/\/$/, ''));
  } catch {
    return url;
  }
};

// Live embeds are laid out at this desktop viewport (see LivePreview).
const LIVE_RATIO = 1280 / 800;

interface ProjectScreenProps {
  project: Project;
  eager?: boolean;
}

/**
 * The project shown in the browser frame: a live embed where the deployment
 * allows it, otherwise a genuine screenshot at its own aspect ratio. Returns
 * nothing when neither exists; callers decide how to present a project with
 * no visual.
 */
export function ProjectScreen({ project, eager = false }: ProjectScreenProps) {
  const kind = getPreviewKind(project);
  const cover = getProjectCover(project.id);
  const live = projectLive[project.id];

  if (kind === 'none') return null;

  // The address only ever shows a real, clickable URL. Projects without a
  // public deployment show their name and no link.
  const address = project.liveUrl ? displayAddress(project.liveUrl) : project.title;
  const ratio = kind === 'live' ? LIVE_RATIO : cover ? cover.width / cover.height : undefined;

  return (
    <MacBrowserFrame address={address} href={project.liveUrl} ratio={ratio}>
      {kind === 'live' && live ? (
        <LivePreview url={live.url} title={project.title} poster={cover} />
      ) : (
        cover && (
          <img
            src={cover.src}
            alt={cover.alt}
            width={cover.width}
            height={cover.height}
            loading={eager ? 'eager' : 'lazy'}
            decoding="async"
          />
        )
      )}
    </MacBrowserFrame>
  );
}

/** One line under the window saying what the visitor is looking at. */
export function PreviewNote({ project }: { project: Project }) {
  const kind = getPreviewKind(project);
  if (kind === 'none') return null;

  return (
    <p className={`preview-note ${kind === 'live' ? 'preview-note--live' : ''}`}>
      <span className="preview-note__dot" aria-hidden="true" />
      {kind === 'live' ? 'Live preview' : 'Screenshot'}
    </p>
  );
}

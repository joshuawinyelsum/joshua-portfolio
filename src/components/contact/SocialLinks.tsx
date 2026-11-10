import { socialLinks } from '../../data/social';
import { SocialIcon } from '../ui/SocialIcon';

/**
 * Social profiles as individual platform glyphs: same size, same stroke,
 * no frames and no shared container. Each keeps its real destination.
 */
export function SocialLinks() {
  return (
    <ul className="-ml-2.5 flex flex-wrap gap-1">
      {socialLinks.map((link) => (
        <li key={link.platform}>
          <a
            href={link.url}
            target="_blank"
            rel="noopener noreferrer"
            className="social-icon"
            aria-label={`${link.platform} (${link.handle})`}
            title={link.platform}
          >
            <SocialIcon platform={link.platform} />
          </a>
        </li>
      ))}
    </ul>
  );
}

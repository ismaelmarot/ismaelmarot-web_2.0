import { Link } from 'react-router-dom';
import {
  StyledProjectDetail,
  StyledDetailActionBar,
  StyledDetailTextButton,
  StyledDetailIconButton,
  StyledDetailHeader,
  StyledDetailIconFrame,
  StyledDetailIcon,
  StyledDetailIconFallback,
  StyledDetailHeading,
  StyledDetailName,
  StyledDetailMeta,
  StyledDetailRule,
  StyledDetailBody,
  StyledDetailPlatforms,
  StyledDetailPlatform,
  StyledDetailDescription,
  StyledDetailLinks,
  StyledDetailLink,
  StyledDetailSection,
  StyledDetailSectionTitle,
  StyledGalleryFrame,
  StyledGalleryControl,
  StyledGallery,
  StyledGalleryItem,
  StyledGalleryImage,
  StyledInfoGrid,
  StyledInfoGroup,
  StyledInfoTerm,
  StyledInfoValue,
  StyledInfoInline,
  StyledViewports,
  StyledViewport,
  StyledVersionList,
  StyledVersion,
  StyledVersionName,
  StyledVersionDate,
  StyledDetailNote,
} from './ProjectDetail.styles';
import { useProjectShare } from './useProjectShare';
import { useProjectDetail } from './useProjectDetail';
import { useGalleryCarousel } from './useGalleryCarousel';
import { useGalleryViewer } from './useGalleryViewer';
import { ProjectGalleryViewer } from './ProjectGalleryViewer';
import { StyledGalleryThumb } from './ProjectGalleryViewer.styles';
import { Icon } from '@/components/ui/Icon';
import type { IconName } from '@/components/ui/Icon';
import { formatDate, formatBytes, formatKilobytes, formatProjectName } from '@/utils/helpers';
import { DEFAULT_APP_LANGUAGES } from '@/types/project';
import type { Project, ProjectPlatform, ProjectViewport } from '@/types/project';

export const PLATFORM_ICONS: Record<ProjectPlatform, IconName> = {
  web: 'globe',
  // The apple mark read as the manufacturer rather than the form factor, next to a
  // desktop tower. A notebook outline pairs with it and stays legible at 18px.
  mac: 'laptop',
  pc: 'pc',
};

/** Hard cap on the gallery: the data is already capped, and this guarantees it. */
const MAX_SCREENSHOTS = 6;

const VIEWPORT_ICONS: Record<ProjectViewport, IconName> = {
  desktop: 'desktop',
  tablet: 'tablet',
  mobile: 'mobile',
};

const SHARE_MESSAGES: Record<string, string> = {
  shared: 'Compartido',
  copied: 'Enlace copiado',
  failed: 'No se pudo compartir',
};

export interface ProjectDetailProps {
  project: Project;
  shareUrl: string;
}

export const ProjectDetail = ({ project, shareUrl }: ProjectDetailProps) => {
  const { status, share } = useProjectShare(shareUrl);
  const { hasIconError, handleIconError } = useProjectDetail(project.iconUrl);
  const platforms = project.platforms ?? [];
  const viewports = project.viewports ?? [];
  const categories = project.categories ?? [];
  const versions = project.versions ?? [];
  const screenshots = project.screenshotUrls.slice(0, MAX_SCREENSHOTS);
  const { trackRef: galleryRef, canScrollPrev, canScrollNext, scrollByItem, refreshControls } =
    useGalleryCarousel(screenshots.length);
  const {
    activeIndex,
    open: openViewer,
    close: closeViewer,
    showNext,
    showPrevious,
  } = useGalleryViewer(screenshots.length);
  const showIcon = Boolean(project.iconUrl) && !hasIconError;

  const sizeValue = project.appSizeBytes
    ? formatBytes(project.appSizeBytes)
    : project.sizeKb
      ? formatKilobytes(project.sizeKb)
      : undefined;
  const sizeLabel = project.appSizeBytes
    ? 'App size'
    : project.sizeKb
      ? 'Repository size'
      : undefined;

  // GitHub cannot report which languages an app ships with, so an undeclared project
  // falls back to the shared bilingual default instead of showing nothing.
  const appLanguages = project.languages?.length ? project.languages : DEFAULT_APP_LANGUAGES;

  const appHref = project.demoUrl ?? project.downloadUrl;
  const appLinkLabel = project.demoUrl ? 'Open the web app' : 'Download the app';

  return (
    <StyledProjectDetail>
      <StyledDetailActionBar>
        {/* Icon only, so the accessible name has to come from aria-label: the chevron is
            decorative and the visible text is gone. */}
        <StyledDetailIconButton
          as={Link}
          to="/projects"
          aria-label="Back to projects"
          data-testid="detail-back"
        >
          <Icon name="chevronLeft" size={16} aria-hidden="true" />
        </StyledDetailIconButton>

        <StyledDetailTextButton
          type="button"
          onClick={share}
          data-testid="detail-share"
          aria-describedby={status === 'idle' ? undefined : 'detail-share-status'}
        >
          <Icon name="share" size={16} aria-hidden="true" />
          <span>Share</span>
        </StyledDetailTextButton>
      </StyledDetailActionBar>

      <p id="detail-share-status" role="status" aria-live="polite">
        {SHARE_MESSAGES[status] ?? ''}
      </p>

      <StyledDetailHeader>
        <StyledDetailIconFrame data-testid="detail-icon-frame">
          {showIcon ? (
            <StyledDetailIcon
              src={project.iconUrl}
              alt={`${project.name} icon`}
              decoding="async"
              onError={handleIconError}
            />
          ) : (
            <StyledDetailIconFallback data-testid="detail-icon-fallback" aria-hidden="true">
              <Icon name="folder" size={32} />
            </StyledDetailIconFallback>
          )}
        </StyledDetailIconFrame>

        <StyledDetailHeading>
          <StyledDetailName>{formatProjectName(project.name)}</StyledDetailName>
          {categories.length > 0 && (
            <StyledDetailMeta data-testid="detail-categories">
              {categories.map((category, index) => (
                <span key={category}>
                  {index > 0 && ', '}
                  {category}
                </span>
              ))}
            </StyledDetailMeta>
          )}
        </StyledDetailHeading>
      </StyledDetailHeader>

      <StyledDetailRule />

      <StyledDetailBody>
        <StyledDetailDescription>{project.description}</StyledDetailDescription>

        <StyledDetailLinks>
          <StyledDetailLink
            href={project.githubUrl}
            target="_blank"
            rel="noopener noreferrer"
            data-testid="detail-repo-link"
          >
            <Icon name="github" size={16} aria-hidden="true" />
            <span>View repository</span>
          </StyledDetailLink>

          {appHref && (
            <StyledDetailLink
              href={appHref}
              target="_blank"
              rel="noopener noreferrer"
              data-testid="detail-app-link"
            >
              <Icon name="externalLink" size={16} aria-hidden="true" />
              <span>{appLinkLabel}</span>
            </StyledDetailLink>
          )}
        </StyledDetailLinks>
      </StyledDetailBody>

      {screenshots.length > 0 && (
        <StyledDetailSection aria-label="Screenshots">
          <StyledGalleryFrame>
            {canScrollPrev && (
              <StyledGalleryControl
                type="button"
                $position="prev"
                onClick={() => scrollByItem(-1)}
                aria-label="Previous screenshots"
                data-testid="gallery-prev"
              >
                <Icon name="chevronLeft" size={20} aria-hidden="true" />
              </StyledGalleryControl>
            )}

            <StyledGallery ref={galleryRef} tabIndex={0} data-testid="detail-gallery">
              {screenshots.map((url, index) => (
                <StyledGalleryItem key={url}>
                  {/* A button rather than a click handler on the image: the image then
                      stops being the accessible name, and the control can say what it does. */}
                  <StyledGalleryThumb
                    type="button"
                    onClick={() => openViewer(index)}
                    aria-label={`View ${project.name} screenshot ${index + 1} full screen`}
                  >
                    <StyledGalleryImage
                      src={url}
                      alt=""
                      loading="lazy"
                      decoding="async"
                      onLoad={refreshControls}
                    />
                  </StyledGalleryThumb>
                </StyledGalleryItem>
              ))}
            </StyledGallery>

            {canScrollNext && (
              <StyledGalleryControl
                type="button"
                $position="next"
                onClick={() => scrollByItem(1)}
                aria-label="Next screenshots"
                data-testid="gallery-next"
              >
                <Icon name="chevronRight" size={20} aria-hidden="true" />
              </StyledGalleryControl>
            )}
          </StyledGalleryFrame>
        </StyledDetailSection>
      )}

      {screenshots.length > 0 && (
        <ProjectGalleryViewer
          screenshots={screenshots}
          projectName={project.name}
          activeIndex={activeIndex}
          onClose={closeViewer}
          onNext={showNext}
          onPrevious={showPrevious}
        />
      )}

      <StyledDetailRule />

      <StyledDetailSection aria-labelledby="detail-info-title">
        <StyledDetailSectionTitle id="detail-info-title">Information</StyledDetailSectionTitle>

        <StyledInfoGrid>
          {platforms.length > 0 && (
            <StyledInfoGroup>
              <StyledInfoTerm id="detail-platforms-label">Available on</StyledInfoTerm>
              <StyledInfoValue>
                {/* aria-labelledby rather than aria-label so the accessible name is the
                    text that is actually on screen. */}
                <StyledDetailPlatforms aria-labelledby="detail-platforms-label">
                  {platforms.map((platform) => (
                    <StyledDetailPlatform key={platform}>
                      <Icon name={PLATFORM_ICONS[platform]} size={18} aria-hidden="true" />
                      <span>{platform}</span>
                    </StyledDetailPlatform>
                  ))}
                </StyledDetailPlatforms>
              </StyledInfoValue>
            </StyledInfoGroup>
          )}

          <StyledInfoGroup>
            <StyledInfoTerm>Categories</StyledInfoTerm>
            <StyledInfoValue>
              {categories.length > 0 ? (
                <StyledInfoInline data-testid="detail-categories-list">
                  {categories.map((category, index) => (
                    <span key={category}>
                      {index > 0 && ', '}
                      {category}
                    </span>
                  ))}
                </StyledInfoInline>
              ) : (
                <span>Not categorised</span>
              )}
            </StyledInfoValue>
          </StyledInfoGroup>

          <StyledInfoGroup>
            <StyledInfoTerm>Language</StyledInfoTerm>
            <StyledInfoValue data-testid="detail-language">{appLanguages.join(', ')}</StyledInfoValue>
          </StyledInfoGroup>

          {sizeValue && sizeLabel && (
            <StyledInfoGroup>
              <StyledInfoTerm>Size</StyledInfoTerm>
              <StyledInfoValue data-testid="detail-size">
                {sizeValue}
                <span> ({sizeLabel})</span>
              </StyledInfoValue>
            </StyledInfoGroup>
          )}

          {viewports.length > 0 && (
            <StyledInfoGroup>
              <StyledInfoTerm>Supported viewports</StyledInfoTerm>
              <StyledInfoValue>
                <StyledViewports aria-label="Supported viewports">
                  {viewports.map((viewport) => (
                    <StyledViewport key={viewport}>
                      <Icon name={VIEWPORT_ICONS[viewport]} size={18} aria-hidden="true" />
                      <span>{viewport}</span>
                    </StyledViewport>
                  ))}
                </StyledViewports>
              </StyledInfoValue>
            </StyledInfoGroup>
          )}

          {project.technologies.length > 0 && (
            <StyledInfoGroup>
              <StyledInfoTerm>Built with</StyledInfoTerm>
              <StyledInfoValue data-testid="detail-built-with">
                {project.technologies.join(', ')}
              </StyledInfoValue>
            </StyledInfoGroup>
          )}
        </StyledInfoGrid>
      </StyledDetailSection>

      <StyledDetailSection aria-labelledby="detail-versions-title">
        <StyledDetailSectionTitle id="detail-versions-title">Version history</StyledDetailSectionTitle>
        {versions.length > 0 ? (
          <StyledVersionList aria-label="Published versions">
            {versions.map((version) => (
              <StyledVersion key={version.version}>
                <StyledVersionName>{version.version}</StyledVersionName>
                {version.date && (
                  // Release timestamps come from GitHub in UTC; formatting in the
                  // visitor's timezone would show a different day to each visitor.
                  <StyledVersionDate>{formatDate(version.date, { timeZone: 'UTC' })}</StyledVersionDate>
                )}
                <StyledDetailLink
                  href={version.url}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  View release
                </StyledDetailLink>
              </StyledVersion>
            ))}
          </StyledVersionList>
        ) : (
          <StyledDetailNote>
            {formatProjectName(project.name)} does not publish formal versions.
          </StyledDetailNote>
        )}
      </StyledDetailSection>
    </StyledProjectDetail>
  );
};
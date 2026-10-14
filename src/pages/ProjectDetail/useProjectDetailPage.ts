import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import projectsData from '@/data/projects.json';
import { withEditorialMetadata } from '@/data/project-metadata';
import { sortProjectsByDisplayOrder } from '@/types/project';
import type { Project } from '@/types/project';

const projects = sortProjectsByDisplayOrder(projectsData as Project[]).map(
  withEditorialMetadata
);

export interface UseProjectDetailPageReturn {
  /** The project named by the route's id, or undefined when no project carries it. */
  project: Project | undefined;
  /** The URL to share, empty until the component has mounted. */
  shareUrl: string;
}

/**
 * Everything `/projects/:id` needs: the project the id names, and the URL to offer when sharing it.
 *
 * Two things live here rather than in the component. The lookup, because the sorted and
 * metadata-attached list is built once at module scope and must not be rebuilt per render — it is the
 * same list `ProjectsPage` builds, and two copies of it would be two places to keep in step. And the
 * share URL, because reading `window.location.href` during render is a side effect and this component
 * has to wait for the mount to take it.
 */
export function useProjectDetailPage(): UseProjectDetailPageReturn {
  const { id } = useParams<{ id: string }>();
  const [shareUrl, setShareUrl] = useState('');

  useEffect(() => {
    if (typeof window !== 'undefined') setShareUrl(window.location.href);
  }, []);

  return {
    project: projects.find((item) => item.id === id),
    shareUrl,
  };
}
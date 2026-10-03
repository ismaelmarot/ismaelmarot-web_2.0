import { createBrowserRouter } from 'react-router-dom';
import { Layout } from '@/components/layout/Layout';
import { IndexPage } from '@/pages/Index';
import { AboutPage } from '@/pages/About';
import { ProjectsPage } from '@/pages/Projects';
import { ProjectDetailPage } from '@/pages/ProjectDetail';
import { TechnologiesPage } from '@/pages/Technologies';
import { ContactPage } from '@/pages/Contact';
import { NotFoundPage } from '@/pages/NotFound';

export const router = createBrowserRouter(
  [
    {
      path: '/',
      element: <Layout />,
      children: [
        {
          index: true,
          element: <IndexPage />,
        },
        {
          path: 'about',
          element: <AboutPage />,
        },
        {
          path: 'projects',
          element: <ProjectsPage />,
        },
        {
          path: 'projects/:id',
          element: <ProjectDetailPage />,
        },
        {
          path: 'technologies',
          element: <TechnologiesPage />,
        },
        {
          path: 'contact',
          element: <ContactPage />,
        },
        {
          path: '*',
          element: <NotFoundPage />,
        },
      ],
    },
  ],
  // The site is served from a subpath on GitHub Pages; without this every
  // route resolves to the catch-all 404 page.
  { basename: import.meta.env.BASE_URL }
);

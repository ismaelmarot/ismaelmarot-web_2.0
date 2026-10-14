import { createBrowserRouter } from 'react-router-dom';
import { Layout } from '@/components/layout/Layout';
import { HomePage } from '@/pages/Home';
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
          element: <HomePage />,
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
  // GitHub Pages serves this site from the account root, so BASE_URL is '/'. This used to read "served
  // from a subpath", which was true when the site published under /ismaelmarot-web_2.0 and stopped
  // being true in a41bd75, and the comment outlived the fact it described.
  //
  // basename still has to be declared even at the root. The router matches '/' against this value, and
  // a deep load of /projects resolves to the catch-all 404 without it. `tests/e2e/routes.spec.ts` is what
  // would catch that going wrong, since it asserts the URL after every route loads rather than only that
  // the page rendered.
  { basename: import.meta.env.BASE_URL }
);

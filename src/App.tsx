import { RouterProvider } from 'react-router-dom';
import { ReducedMotionProvider } from '@/hooks/useReducedMotion';
import { router } from '@/router';

export default function App() {
  return (
    <ReducedMotionProvider>
      <RouterProvider router={router} />
    </ReducedMotionProvider>
  );
}

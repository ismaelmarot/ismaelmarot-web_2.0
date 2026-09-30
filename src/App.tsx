import { ReducedMotionProvider } from '@/hooks/useReducedMotion';
import IndexPage from '@/pages/Index';

export default function App() {
  return (
    <ReducedMotionProvider>
      <IndexPage />
    </ReducedMotionProvider>
  );
}
import { useCallback, useEffect, useState } from 'react';

export interface UseProjectDetailReturn {
  hasIconError: boolean;
  handleIconError: () => void;
}

export function useProjectDetail(iconUrl?: string): UseProjectDetailReturn {
  const [hasIconError, setHasIconError] = useState(false);

  useEffect(() => {
    setHasIconError(false);
  }, [iconUrl]);

  const handleIconError = useCallback(() => {
    setHasIconError(true);
  }, []);

  return { hasIconError, handleIconError };
}
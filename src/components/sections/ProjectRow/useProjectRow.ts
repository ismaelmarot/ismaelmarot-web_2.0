import { useCallback, useEffect, useState } from 'react';

export interface UseProjectRowReturn {
  hasIconError: boolean;
  handleIconError: () => void;
}

export function useProjectRow(iconUrl?: string): UseProjectRowReturn {
  const [hasIconError, setHasIconError] = useState(false);

  useEffect(() => {
    setHasIconError(false);
  }, [iconUrl]);

  const handleIconError = useCallback(() => {
    setHasIconError(true);
  }, []);

  return {
    hasIconError,
    handleIconError,
  };
}
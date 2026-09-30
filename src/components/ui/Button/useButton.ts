import { useCallback, useState } from 'react';

export function useButton() {
  const [isPressed, setIsPressed] = useState(false);

  const handleMouseDown = useCallback(() => {
    setIsPressed(true);
  }, []);

  const handleMouseUp = useCallback(() => {
    setIsPressed(false);
  }, []);

  const handleMouseLeave = useCallback(() => {
    setIsPressed(false);
  }, []);

  const handleKeyDown = useCallback((event: React.KeyboardEvent) => {
    if (event.key === ' ' || event.key === 'Enter') {
      setIsPressed(true);
    }
  }, []);

  const handleKeyUp = useCallback((event: React.KeyboardEvent) => {
    if (event.key === ' ' || event.key === 'Enter') {
      setIsPressed(false);
    }
  }, []);

  return {
    isPressed,
    handlers: {
      onMouseDown: handleMouseDown,
      onMouseUp: handleMouseUp,
      onMouseLeave: handleMouseLeave,
      onKeyDown: handleKeyDown,
      onKeyUp: handleKeyUp,
    },
  };
}
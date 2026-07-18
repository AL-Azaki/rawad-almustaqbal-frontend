import { useState, useCallback } from 'react';

/**
 * A custom hook to manage disclosure state (open, close, toggle).
 * Replaces duplicated `const [isOpen, setIsOpen] = useState(false)` across components.
 * 
 * @param initialState - The initial state of the disclosure (default: false)
 */
export function useDisclosure(initialState = false) {
  const [isOpen, setIsOpen] = useState(initialState);

  const open = useCallback(() => setIsOpen(true), []);
  const close = useCallback(() => setIsOpen(false), []);
  const toggle = useCallback(() => setIsOpen((prev) => !prev), []);

  return { isOpen, open, close, toggle };
}

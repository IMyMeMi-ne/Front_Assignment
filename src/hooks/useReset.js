import { useCallback } from 'react';

export default function useReset(
  initialFirstItems,
  initialSecondItems,
  initialThirdItems,
  initialFourthItems,
  setFirstItems,
  setSecondItems,
  setThirdItems,
  setFourthItems,
  setSelectedItems,
  setDraggingItems
) {
  const reset = useCallback(() => {
    setFirstItems(initialFirstItems);
    setSecondItems(initialSecondItems);
    setThirdItems(initialThirdItems);
    setFourthItems(initialFourthItems);
    setSelectedItems([]);
    setDraggingItems(null);
  }, [
    initialFirstItems,
    initialSecondItems,
    initialThirdItems,
    initialFourthItems,
    setFirstItems,
    setSecondItems,
    setThirdItems,
    setFourthItems,
    setSelectedItems,
    setDraggingItems,
  ]);

  return reset;
}

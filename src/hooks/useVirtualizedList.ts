import { useRef } from 'react';
import { FixedSizeList } from 'react-window';

export function useVirtualizedList<T>(items: T[], itemHeight: number) {
  const listRef = useRef<FixedSizeList>(null);
  
  const getItemSize = () => itemHeight;
  
  const scrollToItem = (index: number, align: 'start' | 'center' | 'end' = 'start') => {
    listRef.current?.scrollToItem(index, align);
  };

  return {
    listRef,
    itemCount: items.length,
    getItemSize,
    scrollToItem
  };
}
import { useInView } from 'react-intersection-observer';
import { useState, useEffect } from 'react';

export function useLazyLoading<T>(items: T[], pageSize: number = 10) {
  const [visibleItems, setVisibleItems] = useState<T[]>([]);
  const [page, setPage] = useState(1);
  const { ref, inView } = useInView({
    threshold: 0.1
  });

  useEffect(() => {
    if (inView) {
      const nextItems = items.slice(0, page * pageSize);
      setVisibleItems(nextItems);
      setPage(prev => prev + 1);
    }
  }, [inView, items, page, pageSize]);

  return {
    visibleItems,
    loadMoreRef: ref,
    hasMore: visibleItems.length < items.length
  };
}
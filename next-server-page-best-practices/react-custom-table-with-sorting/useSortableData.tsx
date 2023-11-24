import { useMemo, useState } from "react";

export type SortDirection = 'ascending' | 'descending';

export type SortConfig = {
  key: string;
  direction: SortDirection;
} | null;

export const useSortableData = <T,>(items: T[], config = null) => {
  const [sortConfig, setSortConfig] = useState<SortConfig>(config);

  const sortedItems = useMemo(() => {
    let sortableItems = [...items];
    if (sortConfig !== null) {
      sortableItems.sort((a, b) => {
        if (a[sortConfig.key] < b[sortConfig.key]) {
          return sortConfig.direction === "ascending" ? -1 : 1;
        }
        if (a[sortConfig.key] > b[sortConfig.key]) {
          return sortConfig.direction === "ascending" ? 1 : -1;
        }
        return 0;
      });
    }
    return sortableItems;
  }, [items, sortConfig]);

  const requestSort = (key: string | undefined) => {
    if (key) {
      let direction: SortDirection = "ascending";
      if (
        sortConfig &&
        sortConfig.key === key &&
        sortConfig.direction === "ascending"
      ) {
        direction = "descending";
      }
      setSortConfig({ key, direction });
    }
  };

  const getClassNamesFor = (name: string | undefined): SortDirection | undefined => {
    if (!sortConfig) {
      return undefined;
    }
    if (!name) {
      return undefined;
    }
    return sortConfig.key === name ? sortConfig.direction : undefined;
  };


  return { items: sortedItems, requestSort, sortConfig, getClassNamesFor };
};

"use client"
import React, { useState } from 'react'
import {
  ReadonlyURLSearchParams,
  usePathname,
  useRouter,
  useSearchParams,
} from "next/navigation";
import { Button } from '@/components/ui/buttons/Button';

export const Filters: React.FC<{ totalResults: number, filters: any }> = ({ totalResults, filters }) => {
  const searchParams: ReadonlyURLSearchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();
  const [itemsPerPage, setItemsPerPage] = useState(filters.size || 50);
  const [currentPage, setCurrentPage] = useState(filters.page || 1);
  // const itemOrderList: SearchRequestSortOrder[] = [
  //   SearchRequestSortOrder.ASC,
  //   SearchRequestSortOrder.DESC,
  // ];
  
  const [sortBy, setSortBy] = useState(filters.sortBy || "");

  const onUpdateFilter = (
    page: number = 1,
    itemsPerPageParams: number,
    sortByVal: string
    // sortByVal: SearchRequestSortOrder | string
  ): void => {
    const newParams: URLSearchParams = new URLSearchParams(
      searchParams.toString()
    );

    newParams.set("page", page.toString());
    newParams.set("size", itemsPerPage.toString());
    newParams.set("sortBy", sortByVal.toString());

    const url: string = `${pathname}/?${newParams.toString()}`;

    router.push(url);
  };

  const updatePageFilter = (page: number) => {
    setCurrentPage(page);
    onUpdateFilter(page, itemsPerPage, sortBy);
  }

  const updateSortFilter = (sort: string) => {
    setSortBy(sort);
    onUpdateFilter(currentPage, itemsPerPage, sort);
  };


  return (
    <div>
      <h4>Page {currentPage}</h4>
      <div>
        <Button style="fill-dark-blue" onClick={() => updatePageFilter(1)}>
          1
        </Button>
        <Button style="fill-dark-blue" onClick={() => updatePageFilter(2)}>
          2
        </Button>
        <Button style="fill-dark-blue" onClick={() => updatePageFilter(3)}>
          3
        </Button>
      </div>
      <h4 className="mt-4">Tri par {sortBy}</h4>
      <div>
        <Button style="fill-dark-blue" onClick={() => updateSortFilter("name")}>
          name
        </Button>
        <Button
          style="fill-dark-blue"
          onClick={() => updateSortFilter("supplier")}
        >
          supplier
        </Button>
      </div>
    </div>
  );
}

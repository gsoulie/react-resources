import React from 'react'
import { TestPageClient } from './client';
import { redirect } from 'next/navigation';
import { predicateBy } from '@/helpers/utils/utils.service';

export const isEmpty = (val: any) => val == null || !(Object.keys(val) || val).length;

const dummy = [
  {
    id: 1,
    name: "tube acier 32mm",
    supplier: 'Belinor',
    page: 1
  },
  {
    id: 2,
    name: "coude pvc",
    supplier: 'PUM',
    page: 2
  },
  {
    id: 3,
    name: "tube acier galvanisé",
    supplier: "Arcelor",
    page: 1
  },
  {
    id: 4,
    name: "écrou laiton",
    supplier: 'GBC',
    page: 3
  },
];

export type DataParams = {
	token?: string | null,
	page?: number,
	size?: number,
	sortBy?: string,
  total?: number,
  items: {id: number, name: string, supplier:string, page: number}[]
}

const TestPage = async ({
  params,
  searchParams,
}: {
  params: { id: number };
  searchParams?: { [key: string]: string | string[] | undefined };
  }) => {
    console.log("params :", params);
    console.log("searchParams :", searchParams);
    if (
      isEmpty(searchParams?.page) ||
      isEmpty(searchParams?.size) ||
      isEmpty(searchParams?.sortBy)
    ) {
      const destination: string = `/test/search?page=1&size=10&sortBy=supplier`;

      return redirect(destination);
    }

    const apiEndpoint: string = "gecet.api"; //process.env.NEXT_PUBLIC_API_URL;
    // const cookieStore = cookies();
    // const token: string = cookieStore.get('token')?.value;

  // APPEL HTTP
  //searchParams : { page: '1', size: '10', sortBy: 'supplier' }
  const fetchData = () => {
    console.log("filtering param page", searchParams?.page);
    console.log("filtering param sort", searchParams?.sortBy);
    
      let response: {
        total: number;
        items: { id: number; name: string; supplier: string; page: number }[];
      } = { total: 0, items: [] };
      
      let res = dummy.filter(d => d.page === Number(searchParams?.page ?? 1))
        
      if (searchParams?.sortBy) {
        res = res.sort(predicateBy(searchParams?.sortBy.toString()));
      }
      
      response.total = res.length;
      response.items = res;
      return response;
    }
  
    const httpResponse = fetchData();

    const data: DataParams = {
      token: /*token | */ null,
      total: httpResponse.total,
      page: Number(searchParams?.page ?? 1),
      size: Number(searchParams?.size ?? 50),
      sortBy: String(searchParams?.sortBy),
      items: httpResponse.items,
      //categories: httpResponseData?.categories || null
    };

    return (
      <>
        <TestPageClient apiEndpoint={apiEndpoint} data={data} />
      </>
    );
  };

export default TestPage;

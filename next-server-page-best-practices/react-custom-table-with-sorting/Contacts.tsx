import { Contact } from "@/helpers/models/users.model";
import { routes } from "@/helpers/routes";
import { Texts } from "@/helpers/texts/texts"
import { getApiUrl } from "@/helpers/utils/utils.service";
import { useEffect, useMemo, useState } from "react";
import { Table } from "react-bootstrap";
import ArrowUp from '@/assets/icons/chevronH.svg';
import ArrowDown from "@/assets/icons/chevronB.svg";
import { Button } from "@/components/ui/buttons/Button";

export type Contact = {
  id: number;
  name: string;
  lastName: string;
  email: string;
  phone: string;
};

const dummyContacts: Contact[] = [
  {
    id: 1,
    name: "PERSON",
    lastName: "Jen",
    email: "j.person@gmail.com",
    phone: "06 06 06 06",
  },
  {
    id: 2,
    name: "DOE",
    lastName: "John",
    email: "j.doe@gmail.com",
    phone: "06 05 04 03",
  },
  {
    id: 3,
    name: "ABE",
    lastName: "Martin",
    email: "m.abe@gmail.com",
    phone: "07 04 32 10",
  },
  {
    id: 4,
    name: "GADOT",
    lastName: "Ben",
    email: "b.gadot@gmail.com",
    phone: "07 04 32 12",
  },
];


export type SortDirection = 'ascending' | 'descending';
export type SortConfig = {
  key: string;
  direction: SortDirection;
} | null;

function useSortableData<T>(items: T[], config = null) {
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

  const requestSort = (key: string) => {
    let direction: SortDirection = "ascending";
    if (
      sortConfig &&
      sortConfig.key === key &&
      sortConfig.direction === "ascending"
    ) {
      direction = "descending";
    }
    setSortConfig({ key, direction });
  };

  return { items: sortedItems, requestSort, sortConfig };
};

export const Contacts = () => {

  const { items, requestSort, sortConfig } = useSortableData<Contact>(dummyContacts);
  
  const getClassNamesFor = (name: string): SortDirection | undefined => {
    if (!sortConfig) {
      return undefined;
    }
    return sortConfig.key === name ? sortConfig.direction : undefined;
  };

  return (
    <div>
        <Table hover className="mt-4">
          <thead>
            <tr>
              <th className="small-text-grey">
                <button
                  className="btn-table-sort"
                  type="button"
                  onClick={() => requestSort("name")}
                >
                  Name
                </button>
                {getClassNamesFor("name") === "ascending" && (
                  <ArrowDown stroke="#555" />
                )}
                {getClassNamesFor("name") === "descending" && (
                  <ArrowUp stroke="#555" />
                )}
              </th>
              <th className="small-text-grey">
                <button
                  className="btn-table-sort"
                  type="button"
                  onClick={() => requestSort("lastName")}
                >
                  Lastname
                </button>
                {getClassNamesFor("lastName") === "ascending" && (
                  <ArrowDown stroke="#555" />
                )}
                {getClassNamesFor("lastName") === "descending" && (
                  <ArrowUp stroke="#555" />
                )}
              </th>
              <th className="small-text-grey">
                <button
                  className="btn-table-sort"
                  type="button"
                  onClick={() => requestSort("email")}
                >
                  Email
                </button>
              </th>
              <th className="small-text-grey">
                <button
                  className="btn-table-sort"
                  type="button"
                  onClick={() => requestSort("phone")}
                >
                  Phone
                </button>
              </th>
            </tr>
          </thead>
          <tbody>
            {items.map((c) => (
              <tr key={c.id}>
                <td>{c.name}</td>
                <td>{c.lastName}</td>
                <td>{c.email}</td>
                <td>{c.phone}</td>
              </tr>
            ))}
          </tbody>
        </Table>
  );
}

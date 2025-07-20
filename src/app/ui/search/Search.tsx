"use client";

import Image from 'next/image';
import styles from './search.module.css';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { useDebouncedCallback } from 'use-debounce';

type SearchProps = {
  readonly placeholder?: string;
};

export default function Search({ placeholder = "Buscar..." }: SearchProps) {
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const { replace } = useRouter();

  const handleSearch = useDebouncedCallback((term: string) => {
    console.log(`Searching... ${term}`);

    const params = new URLSearchParams(searchParams);

    params.set('page', '1');

    if (term) {
      params.set('query', term);
    } else {
      params.delete('query');
    }

    replace(`${pathname}?${params.toString()}`);
  }, 300)

  return (
    <div className={`${styles.searchContainer} col-12 col-sm-8 col-md-6 col-lg-6`}>
      <span className={styles.icon}>
        <Image src="/search_24dp.svg" alt="Menú principal" width={24} height={24} />
      </span>
      <input
        id="search"
        name="search"
        type="search"
        placeholder={placeholder}
        className={styles.searchInput}
        onChange={(e) => handleSearch(e.target.value)}
        defaultValue={searchParams.get('query')?.toString()}
      />
    </div>
  );
}
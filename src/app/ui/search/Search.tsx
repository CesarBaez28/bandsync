"use client";

import styles from "./search.module.css";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useDebouncedCallback } from "use-debounce";
import { useState, useEffect } from "react";
import CustomButton from "../button/CustomButton";
import SearchIcon from '@/public/search_24dp.svg'

type SearchProps = {
  readonly placeholder?: string;
};

export default function Search({ placeholder = "Buscar..." }: SearchProps) {
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const { replace } = useRouter();

  const initialQuery = searchParams.get("query") ?? "";
  const [term, setTerm] = useState(initialQuery);

  useEffect(() => {
    setTerm(initialQuery);
  }, [initialQuery]);

  const updateUrl = (value: string) => {
    const params = new URLSearchParams(searchParams);
    params.set("page", "1");

    if (value) {
      params.set("query", value);
    } else {
      params.delete("query");
    }

    replace(`${pathname}?${params.toString()}`);
  };

  const handleSearch = useDebouncedCallback((value: string) => {
    updateUrl(value);
  }, 300);

  const handleChange = (value: string) => {
    setTerm(value);
    handleSearch(value);
  };

  const handleClear = () => {
    setTerm("");
    updateUrl("");
  };

  return (
    <div
      className={`${styles.searchContainer} col-12 col-sm-8 col-md-6 col-lg-6`}
    >
      <span className={styles.icon}>
       <SearchIcon width={22} height={22} />
      </span>
      <input
        id="search"
        name="search"
        type="search"
        placeholder={placeholder}
        className={styles.searchInput}
        value={term}
        onChange={(e) => handleChange(e.target.value)}
      />

      {term && (
        <CustomButton
          variant="tertiary"
          type="button"
          onClick={handleClear}
          className={styles.clearButton}
          aria-label="Limpiar búsqueda"
        >
          ✕
        </CustomButton>
      )}
    </div>
  );
}
'use client';

import { usePathname, useSearchParams } from "next/navigation";
import CustomLink from "../link-temporal/CustomLink";
import Image from "next/image";
import { generatePagination } from "@/app/lib/utils";
import styles from './pagination.module.css';

export default function Pagination({ totalPages }: { readonly totalPages: number }) {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const currentPage = Number(searchParams.get('page')) || 1;
  const allPages = generatePagination(currentPage, totalPages);

  const createPageURL = (pageNumber: number | string) => {
    const params = new URLSearchParams(searchParams);
    params.set('page', pageNumber.toString());
    return `${pathname}?${params.toString()}`;
  };

  return (
    <div className={styles.wrapper}>
      <div className={styles.container}>

        {currentPage > 1 && totalPages >= 5 ?
          <PaginationArrow
            href={createPageURL(currentPage - 1)}
            direction="left"
          />
          : null
        }

        <div className={styles.paginationNumber}>
          {allPages.map((page, index) => {
            return (
              <PaginationNumber
                key={`${page}-${index}`}
                href={createPageURL(page)}
                page={page}
                isActive={currentPage === page}
              />
            );
          })}
        </div>

        {currentPage < totalPages && totalPages >= 5 ?
          <PaginationArrow
            href={createPageURL(currentPage + 1)}
            direction="right"
          />
          : null
        }

      </div>
    </div>
  );
}

function PaginationNumber({
  page,
  href,
  isActive,
}: {
  readonly page: number | string;
  readonly href: string;
  readonly isActive: boolean;
}) {

  if (page === '...') {
    return <p className={styles.ellipsis}>...</p>;
  }

  return isActive ? (
    <CustomLink variant="primary" href={href} style={{ pointerEvents: 'none' }}>
      {page}
    </CustomLink>
  ) : (
    <CustomLink variant="secondary" href={href}>
      {page}
    </CustomLink>
  );
}

function PaginationArrow({ href, direction }: { readonly href: string; readonly direction: 'left' | 'right'; }) {

  const icon = direction === 'left' ? <Image src={'/arrow_back_24dp.svg'} alt="Arrow Back" height={16} width={16} />
    : <Image src={'/arrow_forward_24dp.svg'} alt="Arrow Forward" height={16} width={16} />;

  return (
    <CustomLink variant="secondary" href={href}>
      {icon}
    </CustomLink>
  );
}
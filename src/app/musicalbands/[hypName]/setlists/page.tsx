import stylesResponsive from "@/app/styles/responsive.module.css";
import styles from "./setlists.module.css";
import { getMusicalBandByHyphenatedName } from "@/app/lib/api/musicalBands";
import InputContainer from "@/app/ui/musicalbands/setlists/InputContainer";
import PaginationSkeleton from "@/app/ui/skeletons/PaginationSkeleton";
import TableSkeleton from "@/app/ui/skeletons/TableSkeleton";
import { Metadata } from "next";
import { Suspense } from "react";
import AccordionSkeleton from "@/app/ui/skeletons/AccordionSkeleton";
import SetListDataProvider from "@/app/ui/musicalbands/setlists/SetListsDataProvider";

type Props = {
  readonly params: Promise<{ hypName: string; }>;
  readonly searchParams?: Promise<{
    query?: string;
    page?: string;
  }>;
}

export const metadata: Metadata = {
  title: "Setlists",
  description: "Setlists",
};

export default async function SetlistsPage(props: Props) {
  const [{ hypName }, { query = '', page = '1' } = {}] = await Promise.all([
    props.params,
    props.searchParams
  ]);

  const musicalBand = (await getMusicalBandByHyphenatedName({ name: hypName })).data;

  return (
    <div>
      <h2>Setlists</h2>

      <InputContainer hypName={hypName} musicalBandId={musicalBand?.id} />


      <main className={styles.mainContainer}>
        <Suspense fallback={
          <>
            <PaginationSkeleton showArrows={false} pages={3} />
            <div className={stylesResponsive.desktopOnly}>
              <TableSkeleton columns={6} rows={6} />
            </div>

            <div className={stylesResponsive.mobileOnly}>
              <AccordionSkeleton />
              <AccordionSkeleton />
              <AccordionSkeleton />
            </div>
          </>
        }>
          <SetListDataProvider
            musicalBandId={musicalBand?.id}
            hypName={hypName}
            query={query} page={Number(page)}
          />
        </Suspense>
      </main>
    </div>
  )
}
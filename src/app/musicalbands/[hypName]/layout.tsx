import { ReactNode } from "react";
import SideNav from "@/app/ui/sidenav/SideNav";
import styles from '../musicalbands.module.css';
import { SideNavProvider } from "@/app/ui/sidenav/SideNavContext";
import MainHeader from "@/app/ui/musicalbands/MainHeader";

type LayoutProps = {
  children: ReactNode;
  params: Promise<{ hypName: string }>;
}

export default async function Layout({ children, params }: LayoutProps) {
  const param = await params;
  const hypName = param.hypName;

  return (
    <SideNavProvider>
      <MainHeader hypName={hypName} />
      <div className={styles['layout-content']}>
        <SideNav hypName={hypName} />
        <div className={styles.mainContainer}>
          {children}
        </div>
      </div>
    </SideNavProvider>
  );
}
import { ReactNode } from "react";
import SideNav from "@/app/ui/sidenav/SideNav";
import styles from '../musicalbands.module.css';
import { SideNavProvider } from "@/app/ui/sidenav/SideNavContext";
import MainHeader from "@/app/ui/musicalbands/MainHeader";
import PermissionsProvider from "@/app/providers/UserRolesPermissionsProvider";
import { auth } from "@/auth";
import { Metadata } from "next";
import { config } from "@/app/lib/config";

type LayoutProps = {
  children: ReactNode;
  params: Promise<{ hypName: string }>;
}

const appName = config.appName;

export async function generateMetadata(
  { params }: LayoutProps
): Promise<Metadata> {
  const hypName = (await params).hypName

  return {
    title: {
      template: `%s :: ${hypName} :: ${appName}`,
      default: `${hypName} :: ${appName}`,
    },
    description: 'Banda musical',
  };
}

export default async function Layout({ children, params }: LayoutProps) {
  const [session, { hypName }] = await Promise.all([
    auth(),
    params
  ])

  return (
    <PermissionsProvider session={session}>
      <SideNavProvider>
        <MainHeader hypName={hypName} appName={appName}/>
        <div className={styles['layout-content']}>
          <SideNav hypName={hypName} />
          <div className={styles.mainContainer}>
            {children}
          </div>
        </div>
      </SideNavProvider>
    </PermissionsProvider>
  );
}
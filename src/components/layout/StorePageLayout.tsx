import type { PropsWithChildren } from "react";
import { AppFooter } from "@/components/layout/AppFooter";
import { StoreHeader, type StoreHeaderSearchConfig } from "@/components/layout/StoreHeader";
import { useAuth } from "@/hooks/useAuth";

type StorePageLayoutProps = PropsWithChildren<{
  search?: StoreHeaderSearchConfig;
}>;

export function StorePageLayout({ children, search }: StorePageLayoutProps) {
  const { signOut } = useAuth();

  return (
    <div className="store-page">
      <StoreHeader onSignOut={signOut} search={search} />
      {children}
      <AppFooter />
    </div>
  );
}

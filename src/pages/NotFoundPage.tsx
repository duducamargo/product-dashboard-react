import { NotFoundContent } from "@/components/feedback/NotFoundContent";
import { StorePageLayout } from "@/components/layout/StorePageLayout";
import { useProductHeaderSearch } from "@/hooks/useProductHeaderSearch";
import { appPaths } from "@/routes/paths";

export function NotFoundPage() {
  const headerSearchConfig = useProductHeaderSearch();

  return (
    <StorePageLayout search={headerSearchConfig}>
      <NotFoundContent actionTo={appPaths.home} />
    </StorePageLayout>
  );
}

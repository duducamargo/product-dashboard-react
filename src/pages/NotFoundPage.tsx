import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { NotFoundContent } from "@/components/feedback/NotFoundContent";
import { AppFooter } from "@/components/layout/AppFooter";
import { StoreHeader } from "@/components/layout/StoreHeader";
import { useAuth } from "@/hooks/useAuth";
import { useProductSuggestions } from "@/hooks/useProducts";
import type { Product } from "@/types/product";
import "@/pages/HomePage.css";

export function NotFoundPage() {
  const navigate = useNavigate();
  const { signOut } = useAuth();
  const [headerSearch, setHeaderSearch] = useState("");
  const suggestionsQuery = useProductSuggestions(headerSearch);

  const headerSearchConfig = useMemo(
    () => ({
      isLoading: suggestionsQuery.isLoading || suggestionsQuery.isSearching,
      value: headerSearch,
      suggestions: suggestionsQuery.data ?? [],
      onChange: setHeaderSearch,
      onSelect: (selectedProduct: Product) => {
        setHeaderSearch(selectedProduct.title);
        navigate(`/products/${selectedProduct.id}`);
      },
    }),
    [
      headerSearch,
      navigate,
      suggestionsQuery.data,
      suggestionsQuery.isLoading,
      suggestionsQuery.isSearching,
    ]
  );

  return (
    <div className="store-page">
      <StoreHeader onSignOut={signOut} search={headerSearchConfig} />
      <NotFoundContent />
      <AppFooter />
    </div>
  );
}

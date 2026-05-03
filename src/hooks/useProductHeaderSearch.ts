import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import type { StoreHeaderSearchConfig } from "@/components/layout/StoreHeader";
import { useProductSuggestions } from "@/hooks/useProducts";
import { appPaths } from "@/routes/paths";
import type { Product } from "@/types/product";

export function useProductHeaderSearch(): StoreHeaderSearchConfig {
  const navigate = useNavigate();
  const [search, setSearch] = useState("");
  const suggestionsQuery = useProductSuggestions(search);

  return useMemo(
    () => ({
      isLoading: suggestionsQuery.isLoading || suggestionsQuery.isSearching,
      value: search,
      suggestions: suggestionsQuery.data ?? [],
      onChange: setSearch,
      onSelect: (product: Product) => {
        setSearch(product.title);
        navigate(appPaths.productDetails(product.id));
      },
    }),
    [
      navigate,
      search,
      suggestionsQuery.data,
      suggestionsQuery.isLoading,
      suggestionsQuery.isSearching,
    ]
  );
}

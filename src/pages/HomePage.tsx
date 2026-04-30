import { useEffect, useMemo, useState } from "react";
import { HomeHero } from "@/components/home/HomeHero";
import { ProductFilters } from "@/components/home/ProductFilters";
import { ProductsGrid } from "@/components/home/ProductsGrid";
import { ProductsPagination } from "@/components/home/ProductsPagination";
import { ProductsSkeletonGrid } from "@/components/home/ProductsSkeletonGrid";
import { ProductsState } from "@/components/home/ProductsState";
import { ProductsSummary } from "@/components/home/ProductsSummary";
import { AppFooter } from "@/components/layout/AppFooter";
import { StoreHeader } from "@/components/layout/StoreHeader";
import { ProductSearchCombobox } from "@/components/product/ProductSearchCombobox";
import { useAuth } from "@/hooks/useAuth";
import {
  PRODUCTS_PAGE_SIZE,
  useProductCategories,
  useProducts,
  useProductSuggestions,
} from "@/hooks/useProducts";
import "@/pages/HomePage.css";

function toOptionalNumber(value: string) {
  if (!value) {
    return undefined;
  }

  const parsedValue = Number(value);

  return Number.isFinite(parsedValue) ? parsedValue : undefined;
}

export function HomePage() {
  const { signOut } = useAuth();
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("");
  const [isCategoryFilterOpen, setIsCategoryFilterOpen] = useState(true);
  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");
  const [page, setPage] = useState(1);

  const filters = useMemo(
    () => ({
      category,
      maxPrice: toOptionalNumber(maxPrice),
      minPrice: toOptionalNumber(minPrice),
      page,
      search,
    }),
    [category, maxPrice, minPrice, page, search]
  );

  const productsQuery = useProducts(filters);
  const suggestionsQuery = useProductSuggestions(search);
  const categoriesQuery = useProductCategories();
  const products = productsQuery.data?.products ?? [];
  const totalProducts = productsQuery.data?.total ?? 0;
  const firstItem = totalProducts === 0 ? 0 : (page - 1) * PRODUCTS_PAGE_SIZE + 1;
  const lastItem = Math.min(page * PRODUCTS_PAGE_SIZE, totalProducts);
  const hasActiveFilters = Boolean(search || category || minPrice || maxPrice);
  const isInitialLoading = productsQuery.isLoading || categoriesQuery.isLoading;
  const isUpdating =
    (productsQuery.isFetching && !productsQuery.isLoading) || productsQuery.isSearching;
  const hasRequestError = productsQuery.isError || categoriesQuery.isError;

  useEffect(() => {
    setPage(1);
  }, [category, maxPrice, minPrice, search]);

  function handleClearFilters() {
    setSearch("");
    setCategory("");
    setMinPrice("");
    setMaxPrice("");
  }

  function handleRetry() {
    productsQuery.refetch();
    categoriesQuery.refetch();
  }

  return (
    <div className="store-page">
      <StoreHeader
        onSignOut={signOut}
        search={{
          isLoading: suggestionsQuery.isLoading || suggestionsQuery.isSearching,
          value: search,
          suggestions: suggestionsQuery.data ?? [],
          onChange: setSearch,
          onSelect: (product) => setSearch(product.title),
        }}
      />

      <main className="home-page">
        <HomeHero />

        <div className="catalog-layout">
          <ProductSearchCombobox
            className="mobile-product-search"
            id="mobile-product-search-suggestions"
            isLoading={suggestionsQuery.isLoading || suggestionsQuery.isSearching}
            suggestions={suggestionsQuery.data ?? []}
            value={search}
            onChange={setSearch}
            onSelect={(product) => setSearch(product.title)}
          />

          <ProductFilters
            categories={categoriesQuery.data ?? []}
            category={category}
            hasActiveFilters={hasActiveFilters}
            isCategoryFilterOpen={isCategoryFilterOpen}
            maxPrice={maxPrice}
            minPrice={minPrice}
            onCategoryChange={setCategory}
            onClearFilters={handleClearFilters}
            onMaxPriceChange={setMaxPrice}
            onMinPriceChange={setMinPrice}
            onToggleCategoryFilter={() => setIsCategoryFilterOpen((isOpen) => !isOpen)}
          />

          <section className="catalog-content">
            {hasRequestError ? (
              <ProductsState
                actionLabel="Tentar novamente"
                description="Verifique sua conexao e tente novamente."
                title="Nao foi possivel carregar os produtos"
                role="alert"
                variant="error"
                onAction={handleRetry}
              />
            ) : null}

            {!hasRequestError ? (
              <>
                {!isInitialLoading ? (
                  <ProductsSummary
                    firstItem={firstItem}
                    lastItem={lastItem}
                    totalProducts={totalProducts}
                  />
                ) : null}

                {isInitialLoading ? <ProductsSkeletonGrid /> : null}

                {!isInitialLoading && products.length === 0 ? (
                  <ProductsState
                    actionLabel="Limpar filtros"
                    description="Buscamos em todo o catalogo, mas nenhum produto corresponde aos filtros atuais."
                    title="Nenhum produto encontrado"
                    onAction={handleClearFilters}
                  />
                ) : null}

                {!isInitialLoading && products.length > 0 ? (
                  <>
                    <ProductsGrid isUpdating={isUpdating} products={products} />
                    <ProductsPagination
                      currentPage={page}
                      totalPages={productsQuery.totalPages}
                      onPageChange={setPage}
                    />
                  </>
                ) : null}
              </>
            ) : null}
          </section>
        </div>
      </main>

      <AppFooter />
    </div>
  );
}

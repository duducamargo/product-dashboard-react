import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { useMemo } from "react";
import { useDebounce } from "@/hooks/useDebounce";
import { productService } from "@/services/productService";
import type { Product, ProductFilters, ProductsResponse } from "@/types/product";

export const PRODUCTS_PAGE_SIZE = 12;

function filterByPrice(products: Product[], minPrice?: number, maxPrice?: number) {
  return products.filter((product) => {
    const matchesMinPrice = minPrice === undefined || product.price >= minPrice;
    const matchesMaxPrice = maxPrice === undefined || product.price <= maxPrice;

    return matchesMinPrice && matchesMaxPrice;
  });
}

function paginateProducts(products: Product[], page: number): ProductsResponse {
  const skip = (page - 1) * PRODUCTS_PAGE_SIZE;

  return {
    products: products.slice(skip, skip + PRODUCTS_PAGE_SIZE),
    total: products.length,
    skip,
    limit: PRODUCTS_PAGE_SIZE,
  };
}

export function useProducts(filters: ProductFilters) {
  const debouncedSearch = useDebounce(filters.search.trim());
  const hasPriceFilter = filters.minPrice !== undefined || filters.maxPrice !== undefined;
  const needsClientPagination = hasPriceFilter || Boolean(filters.category && debouncedSearch);

  const query = useQuery({
    queryKey: [
      "products",
      {
        category: filters.category,
        maxPrice: filters.maxPrice,
        minPrice: filters.minPrice,
        page: filters.page,
        search: debouncedSearch,
      },
    ],
    queryFn: async () => {
      if (needsClientPagination) {
        const response = await productService.getProducts({
          category: filters.category,
          limit: 0,
          search: debouncedSearch,
          skip: 0,
        });
        const filteredProducts = filterByPrice(response.products, filters.minPrice, filters.maxPrice);

        return paginateProducts(filteredProducts, filters.page);
      }

      const skip = (filters.page - 1) * PRODUCTS_PAGE_SIZE;

      return productService.getProducts({
        category: filters.category,
        limit: PRODUCTS_PAGE_SIZE,
        search: debouncedSearch,
        skip,
      });
    },
    placeholderData: keepPreviousData,
  });

  const totalPages = useMemo(() => {
    const total = query.data?.total ?? 0;

    return Math.max(Math.ceil(total / PRODUCTS_PAGE_SIZE), 1);
  }, [query.data?.total]);

  return {
    ...query,
    isSearching: filters.search.trim() !== debouncedSearch,
    totalPages,
  };
}

export function useProduct(productId: number | null) {
  return useQuery({
    queryKey: ["product", productId],
    queryFn: ({ signal }) => {
      if (productId === null) {
        throw new Error("Product id is required");
      }

      return productService.getProductById(productId, signal);
    },
    enabled: productId !== null,
    retry: (failureCount, error) => {
      const status = (error as { response?: { status?: number } }).response?.status;

      return status !== 404 && failureCount < 1;
    },
  });
}

export function useProductCategories() {
  return useQuery({
    queryKey: ["product-categories"],
    queryFn: productService.getCategories,
    staleTime: 1000 * 60 * 30,
  });
}

export function useProductSuggestions(search: string) {
  const debouncedSearch = useDebounce(search.trim(), 250);

  const query = useQuery({
    queryKey: ["product-suggestions", debouncedSearch],
    queryFn: async () => {
      const response = await productService.getProducts({
        limit: 6,
        search: debouncedSearch,
        skip: 0,
      });

      return response.products;
    },
    enabled: debouncedSearch.length >= 2,
    staleTime: 1000 * 60 * 5,
  });

  return {
    ...query,
    isSearching: search.trim() !== debouncedSearch,
  };
}

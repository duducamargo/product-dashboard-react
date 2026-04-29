import { httpClient } from "@/api/httpClient";
import type { Product, ProductCategory, ProductsResponse } from "@/types/product";

type GetProductsParams = {
  search?: string;
  category?: string;
  limit: number;
  skip: number;
};

function filterBySearch(products: Product[], search: string) {
  const normalizedSearch = search.trim().toLowerCase();

  if (!normalizedSearch) {
    return products;
  }

  return products.filter((product) => product.title.toLowerCase().includes(normalizedSearch));
}

function buildResponse(products: Product[], skip: number, limit: number): ProductsResponse {
  const paginatedProducts = limit === 0 ? products : products.slice(skip, skip + limit);

  return {
    products: paginatedProducts,
    total: products.length,
    skip,
    limit,
  };
}

export const productService = {
  async getProducts({ search = "", category = "", limit, skip }: GetProductsParams) {
    const normalizedSearch = search.trim();

    if (category) {
      const { data } = await httpClient.get<ProductsResponse>(`/products/category/${category}`, {
        params: { limit, skip },
      });

      if (!normalizedSearch) {
        return data;
      }

      return buildResponse(filterBySearch(data.products, normalizedSearch), skip, limit);
    }

    if (normalizedSearch) {
      const { data } = await httpClient.get<ProductsResponse>("/products/search", {
        params: { q: normalizedSearch, limit, skip },
      });

      return data;
    }

    const { data } = await httpClient.get<ProductsResponse>("/products", {
      params: { limit, skip },
    });

    return data;
  },

  async getCategories() {
    const { data } = await httpClient.get<ProductCategory[]>("/products/categories");

    return data;
  },
};

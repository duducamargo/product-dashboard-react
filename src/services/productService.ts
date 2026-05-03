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

function isProduct(data: unknown): data is Product {
  return (
    typeof data === "object" &&
    data !== null &&
    "id" in data &&
    "title" in data &&
    typeof (data as Product).id === "number" &&
    typeof (data as Product).title === "string"
  );
}

function isDummyJsonNotFound(data: unknown) {
  return (
    typeof data === "object" &&
    data !== null &&
    "message" in data &&
    typeof (data as { message?: unknown }).message === "string" &&
    (data as { message: string }).message.toLowerCase().includes("not found")
  );
}

export const productService = {
  async getProductById(productId: number, signal?: AbortSignal) {
    const { data } = await httpClient.get<unknown>(`/products/${productId}`, { signal });

    if (isDummyJsonNotFound(data)) {
      const error = new Error("Product not found") as Error & { response?: { status: number } };
      error.response = { status: 404 };
      throw error;
    }

    if (!isProduct(data)) {
      throw new Error("Invalid product response");
    }

    return data;
  },

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

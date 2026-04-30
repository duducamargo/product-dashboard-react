import { ProductCard } from "@/components/home/ProductCard";
import type { Product } from "@/types/product";

type ProductsGridProps = {
  isUpdating: boolean;
  products: Product[];
};

export function ProductsGrid({ isUpdating, products }: ProductsGridProps) {
  return (
    <section className="products-grid" aria-busy={isUpdating}>
      {products.map((product) => (
        <ProductCard key={product.id} product={product} />
      ))}
    </section>
  );
}

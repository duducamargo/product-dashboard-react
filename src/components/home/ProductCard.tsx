import { Link } from "react-router-dom";
import type { Product } from "@/types/product";

const currencyFormatter = new Intl.NumberFormat("pt-BR", {
  currency: "USD",
  style: "currency",
});

type ProductCardProps = {
  product: Product;
};

export function ProductCard({ product }: ProductCardProps) {
  return (
    <article className="product-card">
      <div className="product-image-wrap">
        <img src={product.thumbnail} alt={product.title} loading="lazy" />
      </div>
      <div className="product-card-content">
        <div className="product-kicker">
          <span>{product.category}</span>
          <strong aria-label={`Avaliacao ${product.rating.toFixed(1)}`}>
            <span aria-hidden="true">{"\u2605"}</span>
            {product.rating.toFixed(1)}
          </strong>
        </div>
        <h2>{product.title}</h2>
        <strong className="product-price">{currencyFormatter.format(product.price)}</strong>
        <Link className="details-button" to={`/products/${product.id}`}>
          Ver Detalhes
        </Link>
      </div>
    </article>
  );
}

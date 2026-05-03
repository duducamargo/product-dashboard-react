import type { Product } from "@/types/product";
import { currencyFormatter } from "@/utils/formatters";
import { translateAvailabilityStatus } from "@/utils/productDetails";

type ProductInfoPanelProps = {
  product: Product;
  discountPercentage: number;
  hasCopiedProductLink: boolean;
  originalPrice: number | null;
  productPrice: number;
  productRating: number;
  productStock: number;
  reviewCount: number;
  onShareProduct: () => void;
};

function ShareIcon() {
  return (
    <svg aria-hidden="true" focusable="false" viewBox="0 0 24 24">
      <path d="M18 16.1c-.76 0-1.44.3-1.96.77L8.91 12.7a3.27 3.27 0 0 0 0-1.39l7.05-4.13A2.99 2.99 0 1 0 15 5c0 .24.03.47.08.69L8.03 9.82a3 3 0 1 0 0 4.36l7.12 4.18c-.04.2-.06.42-.06.64A2.91 2.91 0 1 0 18 16.1Z" />
    </svg>
  );
}

export function ProductInfoPanel({
  product,
  discountPercentage,
  hasCopiedProductLink,
  originalPrice,
  productPrice,
  productRating,
  productStock,
  reviewCount,
  onShareProduct,
}: ProductInfoPanelProps) {
  return (
    <section className="details-info" aria-labelledby="product-title">
      <span className="details-stock-badge">
        {translateAvailabilityStatus(product.availabilityStatus)}
      </span>
      <h1 id="product-title">{product.title}</h1>
      <p className="details-model">
        SKU: {product.sku} | Marca: {product.brand ?? "Nao informada"}
      </p>

      <div className="details-rating" aria-label={`Avaliacao ${productRating.toFixed(1)}`}>
        <span>{"\u2605\u2605\u2605\u2605\u2605"}</span>
        <strong>{productRating.toFixed(1)}</strong>
        {reviewCount > 0 ? <small>({reviewCount} avaliacoes)</small> : null}
      </div>

      <div className="details-price-row">
        <strong>{currencyFormatter.format(productPrice)}</strong>
        {originalPrice ? <span>{currencyFormatter.format(originalPrice)}</span> : null}
      </div>

      <div className="details-divider" />

      <section className="details-description">
        <h2>Descricao</h2>
        <p>{product.description}</p>
      </section>

      <div className="details-highlights">
        <span>{product.warrantyInformation ?? "Garantia nao informada"}</span>
        <span>{product.shippingInformation ?? "Envio nao informado"}</span>
        <span>{product.returnPolicy ?? "Politica de devolucao indisponivel"}</span>
        <span>Pedido minimo: {product.minimumOrderQuantity ?? 1}</span>
        <span>Estoque: {productStock} unidades</span>
        <span>Desconto: {discountPercentage.toFixed(2)}%</span>
      </div>

      <div className="details-divider" />

      <div className="details-actions">
        <button
          className="details-share-action"
          type="button"
          aria-label={hasCopiedProductLink ? "Link copiado" : "Copiar link completo do produto"}
          title={hasCopiedProductLink ? "Link copiado" : "Copiar link completo do produto"}
          onClick={onShareProduct}
        >
          <ShareIcon />
          <span>{hasCopiedProductLink ? "Link copiado" : "Compartilhar produto"}</span>
        </button>
      </div>
    </section>
  );
}

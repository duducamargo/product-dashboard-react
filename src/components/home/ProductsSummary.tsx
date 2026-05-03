type ProductsSummaryProps = {
  firstItem: number;
  lastItem: number;
  totalProducts: number;
};

export function ProductsSummary({ firstItem, lastItem, totalProducts }: ProductsSummaryProps) {
  return (
    <section className="products-summary" aria-live="polite">
      <div>
        <strong>{totalProducts}</strong>
        <span>{totalProducts === 1 ? " produto encontrado" : " produtos encontrados"}</span>
      </div>
      {totalProducts > 0 ? (
        <span>
          Exibindo {firstItem}-{lastItem}
        </span>
      ) : null}
    </section>
  );
}

export function ProductsSkeletonGrid() {
  return (
    <section className="products-grid" aria-label="Carregando produtos">
      {Array.from({ length: 6 }).map((_, index) => (
        <article className="product-card product-card-skeleton" key={index}>
          <div />
          <span />
          <span />
          <span />
        </article>
      ))}
    </section>
  );
}

import { useEffect, useMemo, useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import { PRODUCTS_PAGE_SIZE, useProductCategories, useProducts } from "@/hooks/useProducts";
import "@/pages/HomePage.css";

const currencyFormatter = new Intl.NumberFormat("pt-BR", {
  currency: "USD",
  style: "currency",
});

function toOptionalNumber(value: string) {
  if (!value) {
    return undefined;
  }

  const parsedValue = Number(value);

  return Number.isFinite(parsedValue) ? parsedValue : undefined;
}

export function HomePage() {
  const { user, signOut } = useAuth();
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("");
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
  const categoriesQuery = useProductCategories();
  const products = productsQuery.data?.products ?? [];
  const totalProducts = productsQuery.data?.total ?? 0;
  const firstItem = totalProducts === 0 ? 0 : (page - 1) * PRODUCTS_PAGE_SIZE + 1;
  const lastItem = Math.min(page * PRODUCTS_PAGE_SIZE, totalProducts);
  const hasActiveFilters = Boolean(search || category || minPrice || maxPrice);
  const isInitialLoading = productsQuery.isLoading || categoriesQuery.isLoading;
  const isUpdating = productsQuery.isFetching && !productsQuery.isLoading;

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
    <main className="home-page">
      <header className="home-header">
        <div>
          <p className="eyebrow">Produtos</p>
          <h1>Catalogo de produtos</h1>
          <p>
            {user?.firstName
              ? `${user.firstName}, acompanhe produtos, estoque e precos em um unico lugar.`
              : "Acompanhe produtos, estoque e precos em um unico lugar."}
          </p>
        </div>

        <button className="button-secondary" type="button" onClick={signOut}>
          Sair
        </button>
      </header>

      <section className="filters-panel" aria-label="Filtros de produtos">
        <label className="field">
          <span>Nome do produto</span>
          <input
            type="search"
            placeholder="Buscar por nome"
            value={search}
            onChange={(event) => setSearch(event.target.value)}
          />
        </label>

        <label className="field">
          <span>Categoria</span>
          <select
            value={category}
            onChange={(event) => setCategory(event.target.value)}
            disabled={categoriesQuery.isLoading}
          >
            <option value="">Todas as categorias</option>
            {categoriesQuery.data?.map((productCategory) => (
              <option key={productCategory.slug} value={productCategory.slug}>
                {productCategory.name}
              </option>
            ))}
          </select>
        </label>

        <label className="field">
          <span>Preco minimo</span>
          <input
            min="0"
            type="number"
            placeholder="0"
            value={minPrice}
            onChange={(event) => setMinPrice(event.target.value)}
          />
        </label>

        <label className="field">
          <span>Preco maximo</span>
          <input
            min="0"
            type="number"
            placeholder="1000"
            value={maxPrice}
            onChange={(event) => setMaxPrice(event.target.value)}
          />
        </label>

        <button
          className="button-secondary filters-clear"
          type="button"
          onClick={handleClearFilters}
          disabled={!hasActiveFilters}
        >
          Limpar
        </button>
      </section>

      {productsQuery.isError || categoriesQuery.isError ? (
        <section className="state-card" role="alert">
          <h2>Nao foi possivel carregar os produtos</h2>
          <p>Verifique sua conexao e tente novamente.</p>
          <button className="button-primary" type="button" onClick={handleRetry}>
            Tentar novamente
          </button>
        </section>
      ) : null}

      {!productsQuery.isError && !categoriesQuery.isError ? (
        <>
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

          {isInitialLoading ? (
            <section className="products-grid" aria-label="Carregando produtos">
              {Array.from({ length: 8 }).map((_, index) => (
                <article className="product-card product-card-skeleton" key={index}>
                  <div />
                  <span />
                  <span />
                  <span />
                </article>
              ))}
            </section>
          ) : null}

          {!isInitialLoading && products.length === 0 ? (
            <section className="state-card">
              <h2>Nenhum produto encontrado</h2>
              <p>Ajuste os filtros para ampliar os resultados.</p>
              {hasActiveFilters ? (
                <button className="button-primary" type="button" onClick={handleClearFilters}>
                  Limpar filtros
                </button>
              ) : null}
            </section>
          ) : null}

          {!isInitialLoading && products.length > 0 ? (
            <>
              <section className="products-grid" aria-busy={isUpdating || productsQuery.isSearching}>
                {products.map((product) => (
                  <article className="product-card" key={product.id}>
                    <img src={product.thumbnail} alt={product.title} loading="lazy" />
                    <div className="product-card-content">
                      <span className="product-category">{product.category}</span>
                      <h2>{product.title}</h2>
                      <p>{product.description}</p>
                      <div className="product-meta">
                        <strong>{currencyFormatter.format(product.price)}</strong>
                        <span>{product.rating.toFixed(1)} / 5</span>
                      </div>
                      <div className="product-stock">
                        <span>Estoque</span>
                        <strong>{product.stock}</strong>
                      </div>
                    </div>
                  </article>
                ))}
              </section>

              <nav className="pagination" aria-label="Paginacao de produtos">
                <button
                  className="button-secondary"
                  type="button"
                  onClick={() => setPage((currentPage) => Math.max(currentPage - 1, 1))}
                  disabled={page === 1}
                >
                  Anterior
                </button>
                <span>
                  Pagina {page} de {productsQuery.totalPages}
                </span>
                <button
                  className="button-secondary"
                  type="button"
                  onClick={() =>
                    setPage((currentPage) => Math.min(currentPage + 1, productsQuery.totalPages))
                  }
                  disabled={page === productsQuery.totalPages}
                >
                  Proxima
                </button>
              </nav>
            </>
          ) : null}
        </>
      ) : null}
    </main>
  );
}

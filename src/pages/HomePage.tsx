import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
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
  const { signOut } = useAuth();
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
    <div className="store-page">
      <header className="store-header">
        <Link className="store-brand" to="/home" aria-label="TechStore home">
          TechStore
        </Link>

        <nav className="store-nav" aria-label="Navegacao principal">
          <Link to="/home">Home</Link>
          <Link to="/home">Produtos</Link>
        </nav>

        <button className="header-action" type="button" onClick={signOut}>
          Sair
        </button>
      </header>

      <main className="home-page">
        <section className="home-hero">
          <p className="eyebrow">Loja de produtos</p>
          <h1>Discover the Future</h1>
          <p>Produtos selecionados com filtros rapidos, paginacao e cache eficiente.</p>
        </section>

        <div className="catalog-layout">
          <aside className="filters-panel" aria-label="Filtros de produtos">
            <label className="field">
              <span>Buscar</span>
              <input
                type="search"
                placeholder="Nome do produto"
                value={search}
                onChange={(event) => setSearch(event.target.value)}
              />
            </label>

            <fieldset className="category-filter">
              <legend>Categorias</legend>
              <label>
                <input
                  type="radio"
                  name="category"
                  value=""
                  checked={category === ""}
                  onChange={() => setCategory("")}
                />
                Todas
              </label>
              {categoriesQuery.data?.map((productCategory) => (
                <label key={productCategory.slug}>
                  <input
                    type="radio"
                    name="category"
                    value={productCategory.slug}
                    checked={category === productCategory.slug}
                    onChange={(event) => setCategory(event.target.value)}
                  />
                  {productCategory.name}
                </label>
              ))}
            </fieldset>

            <div className="price-filter">
              <span>Faixa de preco</span>
              <label>
                <input
                  min="0"
                  type="number"
                  placeholder="Minimo"
                  value={minPrice}
                  onChange={(event) => setMinPrice(event.target.value)}
                />
              </label>
              <label>
                <input
                  min="0"
                  type="number"
                  placeholder="Maximo"
                  value={maxPrice}
                  onChange={(event) => setMaxPrice(event.target.value)}
                />
              </label>
            </div>

            <button
              className="button-primary filters-clear"
              type="button"
              onClick={handleClearFilters}
              disabled={!hasActiveFilters}
            >
              Limpar filtros
            </button>

            <div className="promo-card" aria-hidden="true">
              <span>New season</span>
              <strong>Upgrade Your Workspace</strong>
              <small>Produtos para sua rotina</small>
            </div>
          </aside>

          <section className="catalog-content">
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
                    <span>
                      {totalProducts === 1 ? " produto encontrado" : " produtos encontrados"}
                    </span>
                  </div>
                  {totalProducts > 0 ? (
                    <span>
                      Exibindo {firstItem}-{lastItem}
                    </span>
                  ) : null}
                </section>

                {isInitialLoading ? (
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
                    <section
                      className="products-grid"
                      aria-busy={isUpdating || productsQuery.isSearching}
                    >
                      {products.map((product) => (
                        <article className="product-card" key={product.id}>
                          <div className="product-image-wrap">
                            <img src={product.thumbnail} alt={product.title} loading="lazy" />
                          </div>
                          <div className="product-card-content">
                            <div className="product-kicker">
                              <span>{product.category}</span>
                              <strong>{product.rating.toFixed(1)}</strong>
                            </div>
                            <h2>{product.title}</h2>
                            <p>{product.description}</p>
                            <div className="product-meta">
                              <strong>{currencyFormatter.format(product.price)}</strong>
                              <span>Estoque {product.stock}</span>
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
                          setPage((currentPage) =>
                            Math.min(currentPage + 1, productsQuery.totalPages)
                          )
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
          </section>
        </div>
      </main>
    </div>
  );
}

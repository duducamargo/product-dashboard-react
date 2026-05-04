import type { ProductCategory } from "@/types/product";

type ProductFiltersProps = {
  categories: ProductCategory[];
  category: string;
  hasActiveFilters: boolean;
  isCategoryFilterOpen: boolean;
  maxPrice: string;
  minPrice: string;
  onCategoryChange: (category: string) => void;
  onClearFilters: () => void;
  onMaxPriceChange: (maxPrice: string) => void;
  onMinPriceChange: (minPrice: string) => void;
  onToggleCategoryFilter: () => void;
};

export function ProductFilters({
  categories,
  category,
  hasActiveFilters,
  isCategoryFilterOpen,
  maxPrice,
  minPrice,
  onCategoryChange,
  onClearFilters,
  onMaxPriceChange,
  onMinPriceChange,
  onToggleCategoryFilter,
}: ProductFiltersProps) {
  return (
    <aside className="filters-panel" aria-label="Filtros de produtos">
      <section className="category-filter">
        <button
          className="category-filter-trigger"
          type="button"
          aria-controls="category-options"
          aria-expanded={isCategoryFilterOpen}
          onClick={onToggleCategoryFilter}
        >
          <span>Categorias</span>
          <span className="category-filter-count">{category ? "1 ativa" : "Todas"}</span>
        </button>

        {isCategoryFilterOpen ? (
          <div className="category-filter-content" id="category-options">
            <div className="category-filter-list">
              <label className="category-option">
                <input
                  type="radio"
                  name="category"
                  value=""
                  checked={category === ""}
                  onChange={() => onCategoryChange("")}
                />
                <span>Todas</span>
              </label>

              {categories.map((productCategory) => (
                <label className="category-option" key={productCategory.slug}>
                  <input
                    type="radio"
                    name="category"
                    value={productCategory.slug}
                    checked={category === productCategory.slug}
                    onChange={(event) => onCategoryChange(event.target.value)}
                  />
                  <span>{productCategory.name}</span>
                </label>
              ))}
            </div>
          </div>
        ) : null}
      </section>

      <div className="price-filter">
        <span>Faixa de preço</span>
        <label>
          <input
            min="0"
            type="number"
            placeholder="Mínimo"
            value={minPrice}
            onChange={(event) => onMinPriceChange(event.target.value)}
          />
        </label>
        <label>
          <input
            min="0"
            type="number"
            placeholder="Máximo"
            value={maxPrice}
            onChange={(event) => onMaxPriceChange(event.target.value)}
          />
        </label>
      </div>

      <button
        className="button-primary filters-clear"
        type="button"
        onClick={onClearFilters}
        disabled={!hasActiveFilters}
      >
        Limpar filtros
      </button>
    </aside>
  );
}

import { useState } from "react";
import type { Product } from "@/types/product";

type ProductSearchComboboxProps = {
  className?: string;
  id: string;
  isLoading: boolean;
  suggestions: Product[];
  value: string;
  onChange: (value: string) => void;
  onSelect: (product: Product) => void;
};

function SearchIcon() {
  return (
    <svg aria-hidden="true" viewBox="0 0 24 24" focusable="false">
      <path
        d="m21 21-4.35-4.35m1.35-5.65a7 7 0 1 1-14 0 7 7 0 0 1 14 0Z"
        fill="none"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="2"
      />
    </svg>
  );
}

export function ProductSearchCombobox({
  className = "",
  id,
  isLoading,
  suggestions,
  value,
  onChange,
  onSelect,
}: ProductSearchComboboxProps) {
  const [isOpen, setIsOpen] = useState(false);
  const hasSearchValue = Boolean(value.trim());
  const shouldShowSuggestions = hasSearchValue && isOpen;

  function handleSuggestionSelect(product: Product) {
    onSelect(product);
    setIsOpen(false);
  }

  return (
    <div
      className={`product-search ${className}`.trim()}
      onBlur={() => window.setTimeout(() => setIsOpen(false), 120)}
    >
      <label className="product-search-field">
        <span className="sr-only">Buscar produtos</span>
        <span className="product-search-icon">
          <SearchIcon />
        </span>
        <input
          type="search"
          placeholder="Buscar produtos..."
          value={value}
          onChange={(event) => {
            onChange(event.target.value);
            setIsOpen(true);
          }}
          onFocus={() => setIsOpen(true)}
          autoComplete="off"
          aria-autocomplete="list"
          aria-expanded={shouldShowSuggestions}
          aria-controls={id}
        />
      </label>

      {shouldShowSuggestions ? (
        <div
          className="product-search-popover"
          id={id}
          role="listbox"
          aria-label="Sugestoes de produtos"
        >
          {isLoading ? <span className="product-search-status">Buscando produtos...</span> : null}

          {!isLoading && suggestions.length === 0 ? (
            <span className="product-search-status">Nenhum produto encontrado</span>
          ) : null}

          {!isLoading
            ? suggestions.map((product) => (
                <button
                  className="product-search-option"
                  key={product.id}
                  type="button"
                  role="option"
                  onMouseDown={(event) => event.preventDefault()}
                  onClick={() => handleSuggestionSelect(product)}
                >
                  <img src={product.thumbnail} alt="" aria-hidden="true" />
                  <span>
                    <strong>{product.title}</strong>
                    <small>{product.category}</small>
                  </span>
                  <em aria-label={`Avaliacao ${product.rating.toFixed(1)}`}>
                    {"\u2605"} {product.rating.toFixed(1)}
                  </em>
                </button>
              ))
            : null}
        </div>
      ) : null}
    </div>
  );
}

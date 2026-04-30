import { useState } from "react";
import { Link } from "react-router-dom";
import techstoreIconUrl from "@/assets/techstore-icon.svg";
import type { Product } from "@/types/product";

type StoreHeaderProps = {
  onSignOut: () => void;
  search?: {
    isLoading: boolean;
    value: string;
    suggestions: Product[];
    onChange: (value: string) => void;
    onSelect: (product: Product) => void;
  };
};

export function StoreHeader({ onSignOut, search }: StoreHeaderProps) {
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const hasSearchValue = Boolean(search?.value.trim());
  const shouldShowSuggestions = Boolean(search && hasSearchValue && isSearchOpen);

  function handleSuggestionSelect(product: Product) {
    search?.onSelect(product);
    setIsSearchOpen(false);
  }

  return (
    <header className={search ? "store-header store-header-with-search" : "store-header"}>
      <Link className="store-brand" to="/home" aria-label="TechStore home">
        <img className="store-brand-icon" src={techstoreIconUrl} alt="" aria-hidden="true" />
        <span>TechStore</span>
      </Link>

      {search ? (
        <div className="header-search" onBlur={() => window.setTimeout(() => setIsSearchOpen(false), 120)}>
          <label className="header-search-field">
            <span className="sr-only">Buscar produtos</span>
            <input
              type="search"
              placeholder="Buscar produtos..."
              value={search.value}
              onChange={(event) => {
                search.onChange(event.target.value);
                setIsSearchOpen(true);
              }}
              onFocus={() => setIsSearchOpen(true)}
              autoComplete="off"
              aria-autocomplete="list"
              aria-expanded={shouldShowSuggestions}
              aria-controls="header-search-suggestions"
            />
          </label>

          {shouldShowSuggestions ? (
            <div
              className="header-search-popover"
              id="header-search-suggestions"
              role="listbox"
              aria-label="Sugestoes de produtos"
            >
              {search.isLoading ? (
                <span className="header-search-status">Buscando produtos...</span>
              ) : null}

              {!search.isLoading && search.suggestions.length === 0 ? (
                <span className="header-search-status">Nenhum produto encontrado</span>
              ) : null}

              {!search.isLoading
                ? search.suggestions.map((product) => (
                    <button
                      className="header-search-option"
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
      ) : null}

      <button className="header-action" type="button" onClick={onSignOut}>
        Sair
      </button>
    </header>
  );
}

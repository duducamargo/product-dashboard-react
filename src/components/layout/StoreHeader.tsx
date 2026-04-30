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

function LogoutIcon() {
  return (
    <svg aria-hidden="true" viewBox="0 0 24 24" focusable="false">
      <path
        d="M10 17v1a2 2 0 0 0 2 2h6a2 2 0 0 0 2-2V6a2 2 0 0 0-2-2h-6a2 2 0 0 0-2 2v1"
        fill="none"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="2"
      />
      <path
        d="M15 12H3m0 0 4-4m-4 4 4 4"
        fill="none"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="2"
      />
    </svg>
  );
}

function UserIcon() {
  return (
    <svg aria-hidden="true" viewBox="0 0 24 24" focusable="false">
      <path
        d="M20 21a8 8 0 0 0-16 0"
        fill="none"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="2"
      />
      <circle
        cx="12"
        cy="8"
        fill="none"
        r="4"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="2"
      />
    </svg>
  );
}

export function StoreHeader({ onSignOut, search }: StoreHeaderProps) {
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
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
        <div
          className="header-search"
          onBlur={() => window.setTimeout(() => setIsSearchOpen(false), 120)}
        >
          <label className="header-search-field">
            <span className="sr-only">Buscar produtos</span>
            <span className="header-search-icon">
              <SearchIcon />
            </span>
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

      <div
        className="header-user-menu"
        onBlur={() => window.setTimeout(() => setIsUserMenuOpen(false), 120)}
      >
        <button
          className="header-avatar-button"
          type="button"
          aria-label="Abrir menu do usuario"
          aria-haspopup="menu"
          aria-expanded={isUserMenuOpen}
          onClick={() => setIsUserMenuOpen((isOpen) => !isOpen)}
        >
          <UserIcon />
        </button>

        {isUserMenuOpen ? (
          <div className="header-user-popover" role="menu">
            <div className="header-user-summary">
              <span className="header-user-avatar" aria-hidden="true">
                <UserIcon />
              </span>
              <span>
                <strong>Usuario</strong>
                <small>Sessao ativa</small>
              </span>
            </div>

            <button className="header-user-action" type="button" role="menuitem" onClick={onSignOut}>
              <LogoutIcon />
              <span>Sair</span>
            </button>
          </div>
        ) : null}
      </div>
    </header>
  );
}

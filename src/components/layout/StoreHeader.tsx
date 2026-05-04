import { useState } from "react";
import { ProductSearchCombobox } from "@/components/product/ProductSearchCombobox";
import { Link } from "react-router-dom";
import { appPaths } from "@/routes/paths";
import techstoreIconUrl from "@/assets/techstore-icon.svg";
import type { Product } from "@/types/product";
import "@/components/layout/StoreLayout.css";

export type StoreHeaderSearchConfig = {
  isLoading: boolean;
  value: string;
  suggestions: Product[];
  onChange: (value: string) => void;
  onSelect: (product: Product) => void;
};

type StoreHeaderProps = {
  onSignOut: () => void;
  search?: StoreHeaderSearchConfig;
};

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
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);

  function handleSignOut() {
    setIsUserMenuOpen(false);
    onSignOut();
  }

  return (
    <header className={search ? "store-header store-header-with-search" : "store-header"}>
      <Link className="store-brand" to={appPaths.home} aria-label="TechStore home">
        <img className="store-brand-icon" src={techstoreIconUrl} alt="" aria-hidden="true" />
        <span>TechStore</span>
      </Link>

      {search ? (
        <ProductSearchCombobox
          className="header-search"
          id="header-search-suggestions"
          isLoading={search.isLoading}
          suggestions={search.suggestions}
          value={search.value}
          onChange={search.onChange}
          onSelect={search.onSelect}
        />
      ) : null}

      <div
        className="header-user-menu"
        onBlur={() => window.setTimeout(() => setIsUserMenuOpen(false), 120)}
      >
        <button
          className="header-avatar-button"
          type="button"
          aria-label="Abrir menu do usuário"
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
                <strong>Usuário</strong>
                <small>Sessão ativa</small>
              </span>
            </div>

            <button className="header-user-action" type="button" role="menuitem" onClick={handleSignOut}>
              <LogoutIcon />
              <span>Sair</span>
            </button>
          </div>
        ) : null}
      </div>
    </header>
  );
}

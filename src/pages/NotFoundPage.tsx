import { useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AppFooter } from "@/components/layout/AppFooter";
import { StoreHeader } from "@/components/layout/StoreHeader";
import { useAuth } from "@/hooks/useAuth";
import { useProductSuggestions } from "@/hooks/useProducts";
import type { Product } from "@/types/product";
import "@/pages/HomePage.css";
import "@/pages/NotFoundPage.css";

function NotFoundIcon() {
  return (
    <svg aria-hidden="true" focusable="false" viewBox="0 0 120 120">
      <rect className="not-found-box-top" height="28" rx="8" width="86" x="17" y="18" />
      <path className="not-found-box-body" d="M24 46h72v50a8 8 0 0 1-8 8H32a8 8 0 0 1-8-8V46Z" />
      <path className="not-found-box-line" d="M48 68h24" />
      <circle className="not-found-alert" cx="94" cy="24" r="13" />
      <path className="not-found-alert-line" d="M94 16v9" />
      <path className="not-found-alert-dot" d="M94 31h.01" />
    </svg>
  );
}

export function NotFoundPage() {
  const navigate = useNavigate();
  const { signOut } = useAuth();
  const [headerSearch, setHeaderSearch] = useState("");
  const suggestionsQuery = useProductSuggestions(headerSearch);

  const headerSearchConfig = useMemo(
    () => ({
      isLoading: suggestionsQuery.isLoading || suggestionsQuery.isSearching,
      value: headerSearch,
      suggestions: suggestionsQuery.data ?? [],
      onChange: setHeaderSearch,
      onSelect: (selectedProduct: Product) => {
        setHeaderSearch(selectedProduct.title);
        navigate(`/products/${selectedProduct.id}`);
      },
    }),
    [
      headerSearch,
      navigate,
      suggestionsQuery.data,
      suggestionsQuery.isLoading,
      suggestionsQuery.isSearching,
    ]
  );

  return (
    <div className="store-page">
      <StoreHeader onSignOut={signOut} search={headerSearchConfig} />

      <main className="not-found-page">
        <section className="not-found-content">
          <div className="not-found-illustration">
            <NotFoundIcon />
          </div>

          <span className="not-found-code">404</span>
          <h1>Pagina nao encontrada</h1>
          <p>
            A rota acessada nao existe ou foi movida. Volte para o catalogo para continuar
            navegando pelos produtos.
          </p>

          <Link className="not-found-action" to="/home">
            Voltar ao catalogo
          </Link>
        </section>
      </main>

      <AppFooter />
    </div>
  );
}

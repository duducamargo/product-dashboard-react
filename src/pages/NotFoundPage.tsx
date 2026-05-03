import { Link } from "react-router-dom";
import { StorePageLayout } from "@/components/layout/StorePageLayout";
import { useProductHeaderSearch } from "@/hooks/useProductHeaderSearch";
import { appPaths } from "@/routes/paths";
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
  const headerSearchConfig = useProductHeaderSearch();

  return (
    <StorePageLayout search={headerSearchConfig}>
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

          <Link className="not-found-action" to={appPaths.home}>
            Voltar ao catalogo
          </Link>
        </section>
      </main>
    </StorePageLayout>
  );
}

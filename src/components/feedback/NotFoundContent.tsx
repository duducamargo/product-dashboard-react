import { Link } from "react-router-dom";
import "@/components/feedback/NotFoundContent.css";

type NotFoundContentProps = {
  title?: string;
  description?: string;
  actionLabel?: string;
  actionTo?: string;
};

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

export function NotFoundContent({
  title = "Pagina nao encontrada",
  description = "A rota acessada nao existe ou foi movida. Volte para o catalogo para continuar navegando pelos produtos.",
  actionLabel = "Voltar ao catalogo",
  actionTo = "/home",
}: NotFoundContentProps) {
  return (
    <main className="not-found-page">
      <section className="not-found-content">
        <div className="not-found-illustration">
          <NotFoundIcon />
        </div>

        <span className="not-found-code">404</span>
        <h1>{title}</h1>
        <p>{description}</p>

        <Link className="not-found-action" to={actionTo}>
          {actionLabel}
        </Link>
      </section>
    </main>
  );
}

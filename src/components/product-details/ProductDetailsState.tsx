import { Link } from "react-router-dom";

type ProductDetailsStateProps = {
  title: string;
  description: string;
  actionLabel: string;
  actionTo?: string;
  onAction?: () => void;
};

export function ProductDetailsState({
  title,
  description,
  actionLabel,
  actionTo,
  onAction,
}: ProductDetailsStateProps) {
  return (
    <main className="product-details-page">
      <section className="details-state">
        <h1>{title}</h1>
        <p>{description}</p>
        {actionTo ? (
          <Link className="details-primary-action" to={actionTo}>
            {actionLabel}
          </Link>
        ) : (
          <button className="details-primary-action" type="button" onClick={onAction}>
            {actionLabel}
          </button>
        )}
      </section>
    </main>
  );
}

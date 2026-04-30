type ProductsStateProps = {
  actionLabel?: string;
  description: string;
  title: string;
  role?: "alert";
  variant?: "empty" | "error";
  onAction?: () => void;
};

export function ProductsState({
  actionLabel,
  description,
  title,
  role,
  variant = "empty",
  onAction,
}: ProductsStateProps) {
  if (variant === "empty") {
    return (
      <section className="state-card state-card-empty" role={role}>
        <div className="empty-state-illustration" aria-hidden="true">
          <span className="empty-box">
            <span className="empty-box-lid" />
            <span className="empty-box-body" />
            <span className="empty-box-label" />
          </span>
        </div>
        <h2>{title}</h2>
        <p>{description}</p>
        {actionLabel && onAction ? (
          <button className="button-primary" type="button" onClick={onAction}>
            {actionLabel}
          </button>
        ) : null}
      </section>
    );
  }

  return (
    <section className="state-card" data-variant={variant} role={role}>
      <span className="state-card-icon" aria-hidden="true" />
      <h2>{title}</h2>
      <p>{description}</p>
      {actionLabel && onAction ? (
        <button className="button-primary" type="button" onClick={onAction}>
          {actionLabel}
        </button>
      ) : null}
    </section>
  );
}

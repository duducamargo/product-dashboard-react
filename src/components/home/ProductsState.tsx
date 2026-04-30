type ProductsStateProps = {
  actionLabel?: string;
  description: string;
  title: string;
  role?: "alert";
  onAction?: () => void;
};

export function ProductsState({
  actionLabel,
  description,
  title,
  role,
  onAction,
}: ProductsStateProps) {
  return (
    <section className="state-card" role={role}>
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

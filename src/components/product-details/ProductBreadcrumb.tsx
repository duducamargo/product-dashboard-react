import { Link } from "react-router-dom";

type ProductBreadcrumbProps = {
  category: string;
  title: string;
};

export function ProductBreadcrumb({ category, title }: ProductBreadcrumbProps) {
  return (
    <nav className="details-breadcrumb" aria-label="Breadcrumb">
      <Link to="/home">Home</Link>
      <span aria-hidden="true">{"\u203a"}</span>
      <span>{category}</span>
      <span aria-hidden="true">{"\u203a"}</span>
      <strong>{title}</strong>
    </nav>
  );
}

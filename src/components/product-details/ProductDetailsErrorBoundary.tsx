import { Component, type ReactNode } from "react";
import { Link } from "react-router-dom";

type ProductDetailsErrorBoundaryState = {
  hasError: boolean;
};

export class ProductDetailsErrorBoundary extends Component<
  { children: ReactNode },
  ProductDetailsErrorBoundaryState
> {
  state: ProductDetailsErrorBoundaryState = { hasError: false };

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  render() {
    if (this.state.hasError) {
      return (
        <main className="product-details-page">
          <section className="details-state">
            <h1>Não foi possível exibir o produto</h1>
            <p>Encontramos um problema ao montar os dados deste produto.</p>
            <Link className="details-primary-action" to="/home">
              Voltar ao catálogo
            </Link>
          </section>
        </main>
      );
    }

    return this.props.children;
  }
}

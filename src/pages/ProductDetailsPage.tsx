import { Component, type ReactNode, useEffect, useMemo, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { AppFooter } from "@/components/layout/AppFooter";
import { StoreHeader } from "@/components/layout/StoreHeader";
import { useAuth } from "@/hooks/useAuth";
import { useProduct } from "@/hooks/useProducts";
import "@/pages/HomePage.css";
import "@/pages/ProductDetailsPage.css";

const currencyFormatter = new Intl.NumberFormat("pt-BR", {
  currency: "USD",
  style: "currency",
});

function getProductId(value: string | undefined) {
  const productId = Number(value);

  return Number.isInteger(productId) && productId > 0 ? productId : null;
}

function isNotFoundError(error: unknown) {
  return (error as { response?: { status?: number } }).response?.status === 404;
}

function getNumber(value: unknown, fallback = 0) {
  return typeof value === "number" && Number.isFinite(value) ? value : fallback;
}

function translateAvailabilityStatus(status?: string) {
  const translations: Record<string, string> = {
    "In Stock": "Em estoque",
    "Low Stock": "Estoque baixo",
    "Out of Stock": "Sem estoque",
  };

  return status ? (translations[status] ?? status) : "Em estoque";
}

type DetailsErrorBoundaryState = {
  hasError: boolean;
};

class DetailsErrorBoundary extends Component<{ children: ReactNode }, DetailsErrorBoundaryState> {
  state: DetailsErrorBoundaryState = { hasError: false };

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  render() {
    if (this.state.hasError) {
      return (
        <main className="product-details-page">
          <section className="details-state">
            <h1>Nao foi possivel exibir o produto</h1>
            <p>Encontramos um problema ao montar os dados deste produto.</p>
            <Link className="details-primary-action" to="/home">
              Voltar ao catalogo
            </Link>
          </section>
        </main>
      );
    }

    return this.props.children;
  }
}

export function ProductDetailsPage() {
  const { id } = useParams();
  const { signOut } = useAuth();
  const productId = getProductId(id);
  const productQuery = useProduct(productId);
  const product = productQuery.data;
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const productImages = useMemo(
    () => (product ? Array.from(new Set([product.thumbnail, ...(product.images ?? [])])) : []),
    [product]
  );
  const currentImage = selectedImage ?? productImages[0];
  const reviewCount = product?.reviews?.length ?? 0;
  const hasNotFound = productId === null || isNotFoundError(productQuery.error);
  const dimensions = product?.dimensions;
  const productTags = product?.tags ?? [];
  const productRating = getNumber(product?.rating);
  const productPrice = getNumber(product?.price);
  const discountPercentage = getNumber(product?.discountPercentage);
  const productWeight = getNumber(product?.weight);
  const originalPrice =
    product && discountPercentage > 0
      ? productPrice / (1 - discountPercentage / 100)
      : null;

  useEffect(() => {
    setSelectedImage(null);
  }, [product?.id]);

  if (productId !== null && productQuery.isLoading) {
    return (
      <div className="store-page">
        <StoreHeader onSignOut={signOut} />
        <main className="product-details-page">
          <section className="details-skeleton" aria-busy="true" aria-label="Carregando produto" />
        </main>
        <AppFooter />
      </div>
    );
  }

  if (hasNotFound) {
    return (
      <div className="store-page">
        <StoreHeader onSignOut={signOut} />
        <main className="product-details-page">
          <section className="details-state">
            <h1>Produto nao encontrado</h1>
            <p>O produto solicitado nao existe ou nao esta mais disponivel no catalogo.</p>
            <Link className="details-primary-action" to="/home">
              Voltar ao catalogo
            </Link>
          </section>
        </main>
        <AppFooter />
      </div>
    );
  }

  if (productQuery.isError || !product) {
    return (
      <div className="store-page">
        <StoreHeader onSignOut={signOut} />
        <main className="product-details-page">
          <section className="details-state">
            <h1>Nao foi possivel carregar o produto</h1>
            <p>Verifique sua conexao e tente novamente.</p>
            <button className="details-primary-action" type="button" onClick={() => productQuery.refetch()}>
              Tentar novamente
            </button>
          </section>
        </main>
        <AppFooter />
      </div>
    );
  }

  return (
    <div className="store-page">
      <StoreHeader onSignOut={signOut} />

      <DetailsErrorBoundary>
        <main className="product-details-page">
          <nav className="details-breadcrumb" aria-label="Breadcrumb">
            <Link to="/home">Home</Link>
            <span>{product.category}</span>
            <strong>{product.title}</strong>
          </nav>

          <Link className="details-back-link" to="/home">
            {"\u2190"} Voltar ao catalogo
          </Link>

          <section className="details-main">
            <div className="details-gallery">
              <div className="details-main-image">
                <img src={currentImage ?? product.thumbnail} alt={product.title} />
              </div>

              <div className="details-thumbnails" aria-label="Imagens do produto">
                {productImages.slice(0, 4).map((image) => (
                  <button
                    className="details-thumbnail"
                    data-active={image === currentImage}
                    key={image}
                    type="button"
                    onClick={() => setSelectedImage(image)}
                  >
                    <img src={image} alt="" aria-hidden="true" />
                  </button>
                ))}
              </div>
            </div>

            <section className="details-info" aria-labelledby="product-title">
              <span className="details-stock-badge">
                {translateAvailabilityStatus(product.availabilityStatus)}
              </span>
              <h1 id="product-title">{product.title}</h1>
              <p className="details-model">
                SKU: {product.sku} | Marca: {product.brand ?? "Nao informada"}
              </p>

              <div className="details-rating" aria-label={`Avaliacao ${productRating.toFixed(1)}`}>
                <span>{"\u2605\u2605\u2605\u2605\u2605"}</span>
                <strong>{productRating.toFixed(1)}</strong>
                {reviewCount > 0 ? <small>({reviewCount} avaliacoes)</small> : null}
              </div>

              <div className="details-price-row">
                <strong>{currencyFormatter.format(productPrice)}</strong>
                {originalPrice ? <span>{currencyFormatter.format(originalPrice)}</span> : null}
              </div>

              <div className="details-divider" />

              <section className="details-description">
                <h2>Descricao</h2>
                <p>{product.description}</p>
              </section>

              <div className="details-highlights">
                <span>{product.warrantyInformation ?? "Garantia nao informada"}</span>
                <span>{product.shippingInformation ?? "Envio informado no checkout"}</span>
                <span>{product.returnPolicy ?? "Politica de devolucao indisponivel"}</span>
                <span>Pedido minimo: {product.minimumOrderQuantity ?? 1}</span>
              </div>

              <div className="details-divider" />

              <button className="details-primary-action" type="button">
                Adicionar ao carrinho
              </button>
              <div className="details-secondary-actions">
                <button type="button">Favoritar</button>
                <button type="button">Compartilhar</button>
              </div>
            </section>
          </section>

          <section className="technical-specs" aria-labelledby="technical-specs-title">
            <h2 id="technical-specs-title">Especificacoes tecnicas</h2>
            <div className="technical-specs-grid">
              <article>
                <span>Peso</span>
                <h3>{productWeight} kg</h3>
                <p>Peso aproximado do produto conforme retorno da API.</p>
              </article>
              <article>
                <span>Dimensoes</span>
                <h3>
                  {dimensions
                    ? `${dimensions.width} x ${dimensions.height} x ${dimensions.depth} cm`
                    : "Nao informado"}
                </h3>
                <p>Largura, altura e profundidade cadastradas para o item.</p>
              </article>
              <article>
                <span>Categoria</span>
                <h3>{product.category}</h3>
                <p>{productTags.length > 0 ? productTags.join(", ") : "Sem tags cadastradas."}</p>
              </article>
            </div>
          </section>
        </main>
      </DetailsErrorBoundary>

      <AppFooter />
    </div>
  );
}

import { useEffect, useMemo, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { AppFooter } from "@/components/layout/AppFooter";
import { NotFoundContent } from "@/components/feedback/NotFoundContent";
import { StoreHeader } from "@/components/layout/StoreHeader";
import { ProductBreadcrumb } from "@/components/product-details/ProductBreadcrumb";
import { ProductDetailsErrorBoundary } from "@/components/product-details/ProductDetailsErrorBoundary";
import { ProductDetailsState } from "@/components/product-details/ProductDetailsState";
import { ProductGallery } from "@/components/product-details/ProductGallery";
import { ProductInfoPanel } from "@/components/product-details/ProductInfoPanel";
import { ProductReviews } from "@/components/product-details/ProductReviews";
import { ProductTechnicalSpecs } from "@/components/product-details/ProductTechnicalSpecs";
import { useAuth } from "@/hooks/useAuth";
import { useProduct, useProductSuggestions } from "@/hooks/useProducts";
import type { Product } from "@/types/product";
import {
  copyTextToClipboard,
  getGalleryImages,
  getNumber,
  getProductId,
  isNotFoundError,
} from "@/utils/productDetails";
import "@/pages/HomePage.css";
import "@/pages/ProductDetailsPage.css";

export function ProductDetailsPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { signOut } = useAuth();
  const productId = getProductId(id);
  const productQuery = useProduct(productId);
  const product = productQuery.data;
  const [headerSearch, setHeaderSearch] = useState("");
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [hasCopiedProductLink, setHasCopiedProductLink] = useState(false);
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

  const productImages = useMemo(
    () => (product ? getGalleryImages(product.thumbnail, product.images ?? []) : []),
    [product]
  );

  const currentImage = selectedImage ?? productImages[0];
  const hasNotFound = productId === null || isNotFoundError(productQuery.error);
  const productTags = product?.tags ?? [];
  const productRating = getNumber(product?.rating);
  const productPrice = getNumber(product?.price);
  const discountPercentage = getNumber(product?.discountPercentage);
  const productWeight = getNumber(product?.weight);
  const productStock = getNumber(product?.stock);
  const productReviews = product?.reviews ?? [];
  const originalPrice =
    product && discountPercentage > 0
      ? productPrice / (1 - discountPercentage / 100)
      : null;

  useEffect(() => {
    setSelectedImage(null);
  }, [product?.id]);

  async function handleShareProduct() {
    const url = window.location.href;

    if (navigator.share) {
      try {
        await navigator.share({
          title: document.title,
          text: "Confira este produto",
          url: url,
        });
      } catch (error) {
        console.error("Erro ao compartilhar:", error);
      }
    } else {
      // Fallback: copia o link
      await copyTextToClipboard(url);
      setHasCopiedProductLink(true);
      window.setTimeout(() => setHasCopiedProductLink(false), 1800);
    }
  }

  if (productId !== null && productQuery.isLoading) {
    return (
      <div className="store-page">
        <StoreHeader onSignOut={signOut} search={headerSearchConfig} />
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
        <StoreHeader onSignOut={signOut} search={headerSearchConfig} />
        <NotFoundContent
          actionLabel="Voltar ao catalogo"
          actionTo="/home"
          description="O produto solicitado nao existe ou nao esta mais disponivel no catalogo."
          title="Produto nao encontrado"
        />
        <AppFooter />
      </div>
    );
  }

  if (productQuery.isError || !product) {
    return (
      <div className="store-page">
        <StoreHeader onSignOut={signOut} search={headerSearchConfig} />
        <ProductDetailsState
          actionLabel="Tentar novamente"
          description="Verifique sua conexao e tente novamente."
          title="Nao foi possivel carregar o produto"
          onAction={() => productQuery.refetch()}
        />
        <AppFooter />
      </div>
    );
  }

  return (
    <div className="store-page">
      <StoreHeader onSignOut={signOut} search={headerSearchConfig} />

      <ProductDetailsErrorBoundary>
        <main className="product-details-page">
          <ProductBreadcrumb category={product.category} title={product.title} />

          <Link className="details-back-link" to="/home">
            {"\u2190"} Voltar ao catalogo
          </Link>

          <section className="details-main">
            <ProductGallery
              currentImage={currentImage}
              fallbackImage={product.thumbnail}
              images={productImages}
              title={product.title}
              onImageSelect={setSelectedImage}
            />

            <ProductInfoPanel
              discountPercentage={discountPercentage}
              hasCopiedProductLink={hasCopiedProductLink}
              originalPrice={originalPrice}
              product={product}
              productPrice={productPrice}
              productRating={productRating}
              productStock={productStock}
              reviewCount={productReviews.length}
              onShareProduct={() => void handleShareProduct()}
            />
          </section>

          <ProductTechnicalSpecs
            product={product}
            productTags={productTags}
            productWeight={productWeight}
          />

          <ProductReviews productRating={productRating} reviews={productReviews} />
        </main>
      </ProductDetailsErrorBoundary>

      <AppFooter />
    </div>
  );
}

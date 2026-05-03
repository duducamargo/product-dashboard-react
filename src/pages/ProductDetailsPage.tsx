import { useEffect, useMemo, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { NotFoundContent } from "@/components/feedback/NotFoundContent";
import { StorePageLayout } from "@/components/layout/StorePageLayout";
import { ProductBreadcrumb } from "@/components/product-details/ProductBreadcrumb";
import { ProductDetailsErrorBoundary } from "@/components/product-details/ProductDetailsErrorBoundary";
import { ProductDetailsState } from "@/components/product-details/ProductDetailsState";
import { ProductGallery } from "@/components/product-details/ProductGallery";
import { ProductInfoPanel } from "@/components/product-details/ProductInfoPanel";
import { ProductReviews } from "@/components/product-details/ProductReviews";
import { ProductTechnicalSpecs } from "@/components/product-details/ProductTechnicalSpecs";
import { useProductHeaderSearch } from "@/hooks/useProductHeaderSearch";
import { useProduct } from "@/hooks/useProducts";
import { appPaths } from "@/routes/paths";
import {
  getGalleryImages,
  getNumber,
  getProductId,
  isNotFoundError,
  shareProductLink,
} from "@/utils/productDetails";
import "@/pages/ProductDetailsPage.css";

export function ProductDetailsPage() {
  const { id } = useParams();
  const productId = getProductId(id);
  const productQuery = useProduct(productId);
  const product = productQuery.data;
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [hasCopiedProductLink, setHasCopiedProductLink] = useState(false);
  const headerSearchConfig = useProductHeaderSearch();

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
    const hasCopiedLink = await shareProductLink(window.location.href);

    if (hasCopiedLink) {
      setHasCopiedProductLink(true);
      window.setTimeout(() => setHasCopiedProductLink(false), 1800);
    }
  }

  if (productId !== null && productQuery.isLoading) {
    return (
      <StorePageLayout search={headerSearchConfig}>
        <main className="product-details-page">
          <section className="details-skeleton" aria-busy="true" aria-label="Carregando produto" />
        </main>
      </StorePageLayout>
    );
  }

  if (hasNotFound) {
    return (
      <StorePageLayout search={headerSearchConfig}>
        <NotFoundContent
          actionLabel="Voltar ao catalogo"
          actionTo={appPaths.home}
          description="O produto solicitado nao existe ou nao esta mais disponivel no catalogo."
          title="Produto nao encontrado"
        />
      </StorePageLayout>
    );
  }

  if (productQuery.isError || !product) {
    return (
      <StorePageLayout search={headerSearchConfig}>
        <ProductDetailsState
          actionLabel="Tentar novamente"
          description="Verifique sua conexao e tente novamente."
          title="Nao foi possivel carregar o produto"
          onAction={() => productQuery.refetch()}
        />
      </StorePageLayout>
    );
  }

  return (
    <StorePageLayout search={headerSearchConfig}>
      <ProductDetailsErrorBoundary>
        <main className="product-details-page">
          <ProductBreadcrumb category={product.category} title={product.title} />

          <Link className="details-back-link" to={appPaths.home}>
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
    </StorePageLayout>
  );
}

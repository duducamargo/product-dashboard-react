import type { ProductReview } from "@/types/product";
import { formatReviewDate } from "@/utils/formatters";
import { getNumber } from "@/utils/productDetails";

type ProductReviewsProps = {
  productRating: number;
  reviews: ProductReview[];
};

export function ProductReviews({ productRating, reviews }: ProductReviewsProps) {
  return (
    <section className="product-reviews" aria-labelledby="product-reviews-title">
      <div className="product-reviews-heading">
        <div>
          <span>Avaliacoes</span>
          <h2 id="product-reviews-title">O que os usuarios dizem</h2>
        </div>
        <strong>{productRating.toFixed(1)} / 5</strong>
      </div>

      {reviews.length > 0 ? (
        <div className="product-reviews-grid">
          {reviews.map((review) => (
            <article className="product-review-card" key={`${review.reviewerEmail}-${review.date}`}>
              <div className="product-review-card-header">
                <div>
                  <h3>{review.reviewerName}</h3>
                  <p>{formatReviewDate(review.date)}</p>
                </div>
                <strong>{getNumber(review.rating).toFixed(1)}</strong>
              </div>
              <p>{review.comment}</p>
            </article>
          ))}
        </div>
      ) : (
        <p className="product-reviews-empty">Este produto ainda nao possui avaliacoes.</p>
      )}
    </section>
  );
}

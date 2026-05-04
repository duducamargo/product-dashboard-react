import type { Product } from "@/types/product";
import { formatProductCategory } from "@/utils/productCategory";

type ProductTechnicalSpecsProps = {
  product: Product;
  productTags: string[];
  productWeight: number;
};

export function ProductTechnicalSpecs({
  product,
  productTags,
  productWeight,
}: ProductTechnicalSpecsProps) {
  return (
    <section className="technical-specs" aria-labelledby="technical-specs-title">
      <h2 id="technical-specs-title">Especificações técnicas</h2>
      <div className="technical-specs-grid">
        <article>
          <span>Peso</span>
          <h3>{productWeight} kg</h3>
          <p>Peso aproximado do produto conforme retorno da API.</p>
        </article>
        <article>
          <span>Dimensões</span>
          <h3>
            {product.dimensions
              ? `${product.dimensions.width} x ${product.dimensions.height} x ${product.dimensions.depth} cm`
              : "Não informado"}
          </h3>
          <p>Largura, altura e profundidade cadastradas para o item.</p>
        </article>
        <article>
          <span>Categoria</span>
          <h3>{formatProductCategory(product.category)}</h3>
          <p>{productTags.length > 0 ? productTags.join(", ") : "Sem tags cadastradas."}</p>
        </article>
        <article>
          <span>Identificação</span>
          <h3>Código de barras</h3>
          <p>{product.meta?.barcode ?? "Não informado"}.</p>
        </article>
      </div>
    </section>
  );
}

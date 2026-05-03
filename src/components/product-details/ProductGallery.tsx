type ProductGalleryProps = {
  currentImage: string | undefined;
  images: string[];
  title: string;
  fallbackImage: string;
  onImageSelect: (image: string) => void;
};

export function ProductGallery({
  currentImage,
  images,
  title,
  fallbackImage,
  onImageSelect,
}: ProductGalleryProps) {
  return (
    <div className="details-gallery">
      <div className="details-main-image">
        <img src={currentImage ?? fallbackImage} alt={title} />
      </div>

      <div className="details-thumbnails" aria-label="Imagens do produto">
        {images.slice(0, 4).map((image) => (
          <button
            className="details-thumbnail"
            data-active={image === currentImage}
            key={image}
            type="button"
            onClick={() => onImageSelect(image)}
          >
            <img src={image} alt="" aria-hidden="true" />
          </button>
        ))}
      </div>
    </div>
  );
}

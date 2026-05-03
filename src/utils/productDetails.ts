export function getProductId(value: string | undefined) {
  const productId = Number(value);

  return Number.isInteger(productId) && productId > 0 ? productId : null;
}

export function getNumber(value: unknown, fallback = 0) {
  return typeof value === "number" && Number.isFinite(value) ? value : fallback;
}

export function getGalleryImages(thumbnail: string, images: string[]) {
  const uniqueImages = Array.from(new Set([thumbnail, ...images].filter(Boolean)));

  if (uniqueImages.length < 2) {
    return uniqueImages;
  }

  return [uniqueImages[1], uniqueImages[0], ...uniqueImages.slice(2)];
}

export function isNotFoundError(error: unknown) {
  if (!error || typeof error !== "object") {
    return false;
  }

  return (error as { response?: { status?: number } }).response?.status === 404;
}

export function translateAvailabilityStatus(status?: string) {
  const translations: Record<string, string> = {
    "In Stock": "Em estoque",
    "Low Stock": "Estoque baixo",
    "Out of Stock": "Sem estoque",
  };

  return status ? (translations[status] ?? status) : "Em estoque";
}

export async function copyTextToClipboard(value: string) {
  if (navigator.clipboard?.writeText) {
    await navigator.clipboard.writeText(value);
    return;
  }

  const linkField = document.createElement("textarea");
  linkField.value = value;
  linkField.setAttribute("readonly", "");
  linkField.style.position = "fixed";
  linkField.style.opacity = "0";
  document.body.appendChild(linkField);
  linkField.select();
  document.execCommand("copy");
  document.body.removeChild(linkField);
}

export async function shareProductLink(url: string) {
  if (navigator.share) {
    try {
      await navigator.share({
        title: document.title,
        text: "Confira este produto",
        url,
      });

      return false;
    } catch (error) {
      if (error instanceof DOMException && error.name === "AbortError") {
        return false;
      }
    }
  }

  await copyTextToClipboard(url);
  return true;
}

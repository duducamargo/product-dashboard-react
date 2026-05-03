export function formatProductCategory(category: string) {
  return category
    .split("-")
    .filter(Boolean)
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
}

export function getCategoryFilterPath(category: string) {
  const params = new URLSearchParams();

  if (category) {
    params.set("category", category);
  }

  const queryString = params.toString();

  return queryString ? `/home?${queryString}` : "/home";
}

export const currencyFormatter = new Intl.NumberFormat("pt-BR", {
  currency: "USD",
  style: "currency",
});

const reviewDateFormatter = new Intl.DateTimeFormat("pt-BR", {
  day: "2-digit",
  month: "long",
  year: "numeric",
});

export function formatReviewDate(value: string) {
  const date = new Date(value);

  return Number.isNaN(date.getTime()) ? "Data não informada" : reviewDateFormatter.format(date);
}

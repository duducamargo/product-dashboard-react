type PaginationItem = number | "ellipsis" | "ellipsis-start" | "ellipsis-end";

type ProductsPaginationProps = {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
};

function getPaginationItems(currentPage: number, totalPages: number): PaginationItem[] {
  if (totalPages <= 5) {
    return Array.from({ length: totalPages }, (_, index) => index + 1);
  }

  if (currentPage <= 3) {
    return [1, 2, 3, "ellipsis", totalPages];
  }

  if (currentPage >= totalPages - 2) {
    return [1, "ellipsis", totalPages - 2, totalPages - 1, totalPages];
  }

  return [1, "ellipsis-start", currentPage, "ellipsis-end", totalPages];
}

export function ProductsPagination({
  currentPage,
  totalPages,
  onPageChange,
}: ProductsPaginationProps) {
  return (
    <nav className="pagination" aria-label="Paginacao de produtos">
      <button
        className="pagination-button pagination-arrow"
        type="button"
        onClick={() => onPageChange(Math.max(currentPage - 1, 1))}
        disabled={currentPage === 1}
        aria-label="Pagina anterior"
      >
        {"\u2039"}
      </button>

      {getPaginationItems(currentPage, totalPages).map((paginationItem) =>
        typeof paginationItem === "number" ? (
          <button
            className="pagination-button"
            data-active={paginationItem === currentPage}
            key={paginationItem}
            type="button"
            onClick={() => onPageChange(paginationItem)}
            aria-current={paginationItem === currentPage ? "page" : undefined}
          >
            {paginationItem}
          </button>
        ) : (
          <span className="pagination-ellipsis" key={paginationItem}>
            ...
          </span>
        )
      )}

      <button
        className="pagination-button pagination-arrow"
        type="button"
        onClick={() => onPageChange(Math.min(currentPage + 1, totalPages))}
        disabled={currentPage === totalPages}
        aria-label="Proxima pagina"
      >
        {"\u203A"}
      </button>
    </nav>
  );
}

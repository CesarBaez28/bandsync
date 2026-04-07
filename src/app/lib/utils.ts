export async function handleAsync<T, E = Error>(
  promise: Promise<T>
): Promise<[T, null] | [null, E]> {
  try {
    const data = await promise;
    return [data, null];
  } catch (err) {
    return [null, err as E];
  }
}

export const generatePagination = (currentPage: number, totalPages: number) => {
  // If there are 6 or fewer pages, show all page numbers
  if (totalPages <= 6) {
    return Array.from({ length: totalPages }, (_, i) => i + 1);
  }

  // If the current page is near the start, show the first 5 pages, an ellipsis, and the last page
  if (currentPage <= 3) {
    return [1, 2, 3, 4, 5, '...', totalPages];
  }

  // If the current page is near the end, show the first page, an ellipsis, and the last 5 pages
  if (currentPage + 3 === totalPages || currentPage + 2 >= totalPages) {
    return [1, '...', totalPages - 4, totalPages - 3, totalPages - 2, totalPages - 1, totalPages];
  }

  // Otherwise, show the first page, an ellipsis, two pages before and after the current page, another ellipsis, and the last page
  return [1, '...', currentPage - 2, currentPage - 1, currentPage, currentPage + 1, currentPage + 2, '...', totalPages];
};

export const urlToBase64 = async (url?: string): Promise<string | null> => {
  if (!url) return null;

  try {
    const response = await fetch(url);
    if (!response.ok) return null;

    const contentType = response.headers.get("content-type") || "image/png";
    const arrayBuffer = await response.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    return `data:${contentType};base64,${buffer.toString("base64")}`;
  } catch (err) {
    console.error("Error converting to base64:", err);
    return null;
  }
};

export const formatDate = (date: Date): string => {
  if (!date) return '';

  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');

  return `${year}-${month}-${day}`;
}
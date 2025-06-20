import { useEffect, useState } from 'react';

// Custom hook for pagination
const usePagination = (items = [], itemsPerPage = 10) => {
  const [currentPage, setCurrentPage] = useState(1);
  const [paginatedItems, setPaginatedItems] = useState([]);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    // Reset to first page when items or itemsPerPage changes
    setCurrentPage(1);
  }, [items, itemsPerPage]);

  useEffect(() => {
    // Update paginated items whenever items, currentPage, or itemsPerPage changes
    if (!items.length) {
      setPaginatedItems([]);
      setTotalPages(1);
      return;
    }

    const total = Math.ceil(items.length / itemsPerPage);
    setTotalPages(total);

    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    const slicedItems = items.slice(startIndex, endIndex);

    setPaginatedItems(slicedItems);
  }, [items, currentPage, itemsPerPage]);

  // Functions to control pagination
  const nextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(prev => prev + 1);
    }
  };

  const prevPage = () => {
    if (currentPage > 1) {
      setCurrentPage(prev => prev - 1);
    }
  };

  const goToPage = (page) => {
    const pageNumber = Math.max(1, Math.min(page, totalPages));
    setCurrentPage(pageNumber);
  };

  return {
    currentPage,
    totalPages,
    paginatedItems,
    nextPage,
    prevPage,
    goToPage,
    hasNextPage: currentPage < totalPages,
    hasPrevPage: currentPage > 1,
    pageNumbers: Array.from({ length: totalPages }, (_, i) => i + 1),
  };
};

export default usePagination;

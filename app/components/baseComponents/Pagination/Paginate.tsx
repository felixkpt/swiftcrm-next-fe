import React from 'react';

type PaginationProps = {
    currentPage?: number;
    totalRecords: number;
    perPage: number;
    onPageNumberChange: (page: number) => void;
};

const Paginate = ({ currentPage = 1, totalRecords, perPage, onPageNumberChange }: PaginationProps) => {
    const totalPages = Math.ceil(totalRecords / perPage);
    console.log('totalRecords',totalRecords, 'totalPages', totalPages)
    const limit = 2; // Number of page links to show on each side of the current page

    const handlePageChange = (page: number) => {
        if (page > 0 && page <= totalPages) {
            onPageNumberChange(page);
        }
    };

    const renderPageNumbers = () => {
        const pages = [];
        
        // Show first page
        if (currentPage > 1) {
            pages.push(
                <button
                    key="first"
                    onClick={() => handlePageChange(1)}
                    className="px-3 py-1 border rounded-lg"
                >
                    &laquo;&laquo;
                </button>
            );
        }

        // Show previous page
        if (currentPage > 1) {
            pages.push(
                <button
                    key="prev"
                    onClick={() => handlePageChange(currentPage - 1)}
                    className="px-3 py-1 border rounded-lg"
                >
                    &laquo;
                </button>
            );
        }

        // Page numbers with ellipses
        for (let i = 1; i <= totalPages; i++) {
            if (
                i === 1 ||
                i === totalPages ||
                (i >= currentPage - limit && i <= currentPage + limit)
            ) {
                pages.push(
                    <button
                        key={i}
                        onClick={() => handlePageChange(i)}
                        className={`px-3 py-1 border rounded-lg ${
                            i === currentPage ? 'bg-blue-500 text-white' : 'bg-white text-blue-500'
                        }`}
                    >
                        {i}
                    </button>
                );
            } else if (i === currentPage - limit - 1 || i === currentPage + limit + 1) {
                pages.push(
                    <span key={`ellipsis-${i}`} className="px-3 py-1">
                        ...
                    </span>
                );
            }
        }

        // Show next page
        if (currentPage < totalPages) {
            pages.push(
                <button
                    key="next"
                    onClick={() => handlePageChange(currentPage + 1)}
                    className="px-3 py-1 border rounded-lg"
                >
                    &raquo;
                </button>
            );
        }

        // Show last page
        if (currentPage < totalPages) {
            pages.push(
                <button
                    key="last"
                    onClick={() => handlePageChange(totalPages)}
                    className="px-3 py-1 border rounded-lg"
                >
                    &raquo;&raquo;
                </button>
            );
        }

        return pages;
    };

    return (
        <div className="flex items-center justify-center space-x-1">
            {renderPageNumbers()}
        </div>
    );
};

export default Paginate;

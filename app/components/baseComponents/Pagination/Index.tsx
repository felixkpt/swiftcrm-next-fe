import React from 'react';

type PaginationProps = {
    currentPage?: number;
    totalPages?: number;
    onPageNumberChange: (page: number) => void;
};

const Pagination = ({ currentPage, totalPages, onPageNumberChange }: PaginationProps) => {
    const limit = 1

    const renderPageNumbers = () => {
        if (!totalPages || !currentPage) return null

        const pageNumbers = [];
        for (let i = 1; i <= totalPages / limit; i++) {
            if (i === 1 || i === totalPages || (i >= currentPage - 2 && i <= currentPage + 2)) {
                pageNumbers.push(
                    <button
                        key={i}
                        className={`join-item btn ${i === currentPage ? 'btn-active' : ''}`}
                        onClick={() => onPageNumberChange(i)}
                    >
                        {i}
                    </button>
                );
            } else if (i === currentPage - 3 || i === currentPage + 3) {
                pageNumbers.push(
                    <button key={i} className="join-item btn btn-disabled">...</button>
                );
            }
        }
        return pageNumbers;
    };

    return (
        <div>
            <div className="join">
                {renderPageNumbers()}
            </div>
        </div>
    );
};

export default Pagination;

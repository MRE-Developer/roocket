import React from 'react';

const Pagination = ({itemsPerPage, totalItems, paginate , currentPage}) => {

    const pageNumbers = [];

    for(let i = 1; i <= Math.ceil(totalItems / itemsPerPage); i++){
        pageNumbers.push(i);
    }

    return (
        <div>
            <nav aria-label="Page navigation">
                <ul className="pagination justify-content-center">
                    {pageNumbers.map(number => (
                        <li key={number} className={`page-item ${number === currentPage ? "active" : ""}`}>
                            <a onClick={(e) => paginate(e,number)} className="page-link">
                                {number}
                            </a>
                        </li>
                    ))}
                </ul>
            </nav>
        </div>
    )
};

export default Pagination
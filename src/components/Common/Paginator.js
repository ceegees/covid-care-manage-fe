import React, { Component } from 'react';
import { NavLink } from 'react-router-dom';

const Paginator = ({ base, total,page, perPage = 10,pageCount = 10 }) => {
    const pages = [];
    const lastPage = Math.ceil(total / perPage);
    const start = Math.max(page - Math.floor(pageCount/2),1); 
    for (let idx = start ; idx < start + pageCount && idx < lastPage+1; idx++) {
        pages.push(idx);
    } 

    // console.log(pages,perPage,total,lastPage);
    if (total < perPage) {
        return <div></div>
    }

    return <div className="w3-center w3-padding">
        <div className="w3-bar ">
            { page > 10 && <NavLink to={`${base}/1`} className="w3-button">&laquo;</NavLink> }
            {pages.map(pg => <NavLink 
                key={`page_${pg}`} to={`${base}/${pg}`}
                className="w3-button">{pg}</NavLink>)
            }
            {lastPage - 10 > page && <NavLink to={`${base}/${lastPage}`} className="w3-button">&raquo;</NavLink>}
        </div>
    </div>
}

export default Paginator;
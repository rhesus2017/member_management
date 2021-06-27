// react
import React from 'react';

// redux
import { useDispatch, useSelector } from 'react-redux';
import { GetPagination } from '../../../../action';

// css
import './Pagination.css';


function Pagination({ Count }){ 

  const dispatch = useDispatch();
  const getPagination = (i) => { dispatch(GetPagination(i)); }
  const currentPage = useSelector(state => state.GetPagination);

  let contentLength = Count;
  let minPage = 1
  let maxPage = Math.ceil(contentLength/7) ;
  let pager = [];
  let leftSideNumber = currentPage.pager - 2;
  let rightSideNumber = currentPage.pager + 2;

  if ( leftSideNumber < minPage ) { leftSideNumber = minPage; }
  if ( leftSideNumber === minPage ) { rightSideNumber = minPage + 4; }
  if ( rightSideNumber > maxPage ) { rightSideNumber = maxPage; }
  if ( rightSideNumber === maxPage ) { leftSideNumber = maxPage - 4; }

  for (let i=leftSideNumber; i<=rightSideNumber; i++) {
    pager.push(
      <div className={(i === currentPage.pager ? 'active' : '')} onClick={() => { getPagination(i) }}>{i}</div>
    );
  }

  const prevPageClick = () => {
    if ( currentPage.pager > 1 ) { getPagination(currentPage.pager - 1) }
  }
  const nextPageClick = () => {
    if ( currentPage.pager < maxPage ) { getPagination(currentPage.pager + 1) }
  }
  const firstPageClick = () => {
    getPagination(minPage)
  }
  const lastPageClick = () => {
    getPagination(maxPage)
  }

  return (
    <div className='pagination'>
      <div className={(currentPage.pager === minPage ? 'disable' : '')} onClick={firstPageClick}>&lsaquo;&lsaquo;</div>
      <div className={(currentPage.pager === minPage ? 'disable' : '')} onClick={prevPageClick}>&lsaquo;</div>
      {pager}
      <div className={(currentPage.pager === maxPage ? 'disable' : '')} onClick={nextPageClick}>&rsaquo;</div>
      <div className={(currentPage.pager === maxPage ? 'disable' : '')} onClick={lastPageClick}>&rsaquo;&rsaquo;</div>
    </div>
  );
}


export default Pagination;
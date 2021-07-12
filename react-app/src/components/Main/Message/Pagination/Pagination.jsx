// react
import React from 'react';

// redux
import { useDispatch, useSelector } from 'react-redux';
import { MessagePagination } from '../../../../action';

// css
import './Pagination.css';


function Pagination({ Count }){ 

  const dispatch = useDispatch();
  const messagePagination = (i) => { dispatch(MessagePagination(i)); }
  const currentPage = useSelector(state => state.MessagePagination);

  let contentLength = Count;
  let minPage = 1
  let maxPage = Math.ceil(contentLength/7) ;
  let pager = [];
  let leftSideNumber = currentPage.pager - 2;
  let rightSideNumber = currentPage.pager + 2;

  if ( leftSideNumber <= minPage ) { 
    leftSideNumber = minPage;
  } else if ( rightSideNumber === maxPage ) {
    leftSideNumber = maxPage - 4;
  }

  if ( rightSideNumber >= maxPage ) {
    rightSideNumber = maxPage;
  }else if ( leftSideNumber === minPage ) { 
    rightSideNumber = minPage + 4;
  }

  for (let i=leftSideNumber; i<=rightSideNumber; i++) {
    pager.push(
      <div className={(i === currentPage.pager ? 'active' : '')} onClick={() => { messagePagination(i) }}>{i}</div>
    );
  }

  const prevPageClick = () => {
    if ( currentPage.pager > 1 ) { messagePagination(currentPage.pager - 1) }
  }
  const nextPageClick = () => {
    if ( currentPage.pager < maxPage ) { messagePagination(currentPage.pager + 1) }
  }
  const firstPageClick = () => {
    messagePagination(minPage)
  }
  const lastPageClick = () => {
    messagePagination(maxPage)
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
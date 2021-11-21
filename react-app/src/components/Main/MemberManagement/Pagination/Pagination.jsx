// react
import React from 'react';

// redux
import { useDispatch, useSelector } from 'react-redux';
import { MemberPagination } from '../../../../action';

// css
import './Pagination.css';


function Pagination({ Count }){ 

  const dispatch = useDispatch();
  const memberPagination = (i) => { dispatch(MemberPagination(i)); }
  const currentPage = useSelector(state => state.MemberPagination);

  let contentLength = Count;
  let minPage = 1
  let maxPage = Math.ceil(contentLength/7);
  let pager = [];
  let leftSideNumber = currentPage.pager - 2;
  let rightSideNumber = currentPage.pager + 2;


  if ( leftSideNumber < minPage ) {
    leftSideNumber = minPage;
  } else if ( rightSideNumber > maxPage ) {
    rightSideNumber = maxPage;
  }

  for (let i=leftSideNumber; i<=rightSideNumber; i++) {
    pager.push(
      <div className={(i === currentPage.pager ? 'active' : '')} onClick={() => { memberPagination(i) }}>{i}</div>
    );
  }

  const prevPageClick = () => {
    if ( currentPage.pager > 1 ) { memberPagination(currentPage.pager - 1) }
  }
  const nextPageClick = () => {
    if ( currentPage.pager < maxPage ) { memberPagination(currentPage.pager + 1) }
  }
  const firstPageClick = () => {
    memberPagination(minPage)
  }
  const lastPageClick = () => {
    memberPagination(maxPage)
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
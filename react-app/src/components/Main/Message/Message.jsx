// react
import React, { useEffect, useState } from 'react'
import { useHistory } from 'react-router-dom';
import axios from 'axios';

// redux
import { useDispatch, useSelector } from 'react-redux';
import { RecentMessage } from '../../../action';
import { MessagePagination } from '../../../action';

// component
import MessageTable from './MessageTable/MessageTable';
import Pagination from './Pagination/Pagination';

// css
import './Message.css';


const Message = () => { 

  const mySwal = require('sweetalert2');
  const history = useHistory();
  const dispatch = useDispatch();
  const recentMessage = (check) => { dispatch(RecentMessage(check)); }
  const messagePagination = (i) => { dispatch(MessagePagination(i)); }
  const currentPage = useSelector(state => state.MessagePagination);
  const getStorage = (item) => { return JSON.parse(window.localStorage.getItem(item)) }
  const setStorage = (item, value) => { window.localStorage.setItem(item, JSON.stringify(value)) }
  const [MessageLists, setMessageLists] = useState([]);
  const [Count, setCount] = useState();
  const [CheckList, setCheckList] = useState([]);
  const [AllChecked, setAllChecked] = useState(false);

  useEffect(() => {
    getMessage();
    setAllChecked(false);
    setCheckList([]);
  }, [currentPage.pager]); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    if ( MessageLists.length === 0 && currentPage.pager !== 1 ) { messagePagination(currentPage.pager - 1);}
    setAllChecked(false);
  }, [MessageLists]); // eslint-disable-line react-hooks/exhaustive-deps

  const check = (num) => {
    setCheckList(CheckList => [...CheckList, num]);
  }
  const nonCheck = (num) => {
    setCheckList(CheckList => CheckList.filter(number => number !== num));
  }
  const onAllCheckedHandler = () => {
    AllChecked === false ? setAllChecked(true) : setAllChecked(false);
  }
  const storageClear = (route) => {
    setStorage('userId', 0);
    setStorage('userName', '');
    setStorage('userGrade', '');
    history.push(route);
  }
  const getMessage = () => {
    axios({
      url: '/api/get_message',
      method:'POST',
      data:{
        userId: getStorage('userId'),
        pager: currentPage.pager
      }
    }).then(function (response) {
      if ( response['data']['result'] === '000000' ) {
        setMessageLists(response['data']['rows']);
        setCount(response['data']['count']['count(*)']);
        recentMessage(false);
      } else if ( response['data']['result'] === '000300' ) {
        mySwal.fire({icon: 'error', title: '실패', html: '세션이 만료되었습니다. 로그인 페이지로 이동합니다'});
        storageClear('/Login');
      } else if ( response['data']['result'] === '000301' ) {
        mySwal.fire({icon: 'error', title: '실패', html: '관리자에 의해 로그아웃 됐습니다.<br>로그인 페이지로 이동합니다'});
        storageClear('/Login');
      } else if ( response['data']['result'] === '000302' ) {
        mySwal.fire({icon: 'error', title: '실패', html: '정지 된 계정입니다. 관리자에게 문의해주세요'});
        storageClear('/');
      } else if ( response['data']['result'] === '000303' ) {
        mySwal.fire({icon: 'error', title: '실패', html: '탈퇴 된 계정입니다. 관리자에게 문의해주세요'});
        storageClear('/');
      } else if ( response['data']['result'] === '000304' ) {
        mySwal.fire({icon: 'error', title: '실패', html: '로그인이 필요합니다. 로그인 페이지로 이동합니다'});
        storageClear('/Login');
      }
    }).catch(function(error){
      mySwal.fire({icon: 'error', title: '실패', html: '알수 없는 문제로 메세지 가져오기를 실패했습니다'});
      storageClear('/');
    });
  }
  const deleteMessage = () => {
    mySwal.fire({icon: 'question', title: '질문', html: '선택한 메세지를 삭제하시겠습니까?', showCancelButton: true}).then((result) => {
      if (result.isConfirmed) {
        if ( CheckList.length === 0 ) {
          mySwal.fire({icon: 'error', title: '실패', html: '메세지를 선택해주세요'});
        } else {
          axios({
            url: '/api/delete_message',
            method: 'POST',
            data: {
              userId: getStorage('userId'),
              delete_number : CheckList
            }
          }).then(function (response) {
            if ( response['data']['result'] === '000000' ) {
              mySwal.fire({icon: 'success', title: '성공', html: '선택한 메세지가 삭제되었습니다'}).then((result) => {
                getMessage();
                setCheckList([]);
              });
            } else if ( response['data']['result'] === '000300' ) {
              mySwal.fire({icon: 'error', title: '실패', html: '세션이 만료되었습니다. 로그인 페이지로 이동합니다'});
              storageClear('/Login');
            } else if ( response['data']['result'] === '000301' ) {
              mySwal.fire({icon: 'error', title: '실패', html: '관리자에 의해 로그아웃 됐습니다.<br>로그인 페이지로 이동합니다'});
              storageClear('/Login');
            } else if ( response['data']['result'] === '000302' ) {
              mySwal.fire({icon: 'error', title: '실패', html: '정지 된 계정입니다. 관리자에게 문의해주세요'});
              storageClear('/');
            } else if ( response['data']['result'] === '000303' ) {
              mySwal.fire({icon: 'error', title: '실패', html: '탈퇴 된 계정입니다. 관리자에게 문의해주세요'});
              storageClear('/');
            } else if ( response['data']['result'] === '000304' ) {
              mySwal.fire({icon: 'error', title: '실패', html: '로그인이 필요합니다. 로그인 페이지로 이동합니다'});
              storageClear('/Login');
            }
          }).catch(function(error){
            mySwal.fire({icon: 'error', title: '실패', html: '알수 없는 문제로 메세지 삭제가 실패했습니다'});
            storageClear('/');
          });
        }
      }
    })
  }

  return(
    <div className='message_wrap'>
      <div className='table_wrap'>
        <div className='table'>
          <div className='tr'>
            <div className='td th'>
              <input type='checkbox' className='checkbox' onClick={onAllCheckedHandler} checked={AllChecked} />
              <label></label>
            </div>
            <div className='td th'><span>보낸 사람</span></div>
            <div className='td th'><span>내용</span></div>
            <div className='td th'><span>보낸 시간</span></div>
          </div>
            {
              Count === 0
                ? <div className='nonData'>메세지가 존재하지 않습니다</div> 
                : MessageLists.map((MessageList) => { 
                  return ( <MessageTable MessageList={MessageList} Count={Count} check={check} nonCheck={nonCheck} AllChecked={AllChecked}/> ) 
                })
            }     
        </div>
        <div className='button_wrap'>
          <button onClick={deleteMessage}>삭제</button>
        </div>
          {
            Count !== 0 && <Pagination Count={Count}/>
          }
      </div>
    </div>
  )
    
}


export default Message;
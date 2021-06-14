// react
import React, { useEffect } from 'react'
import { useHistory } from "react-router-dom";
import axios from 'axios';

// hoc
import useLocalStorage from "../../../hoc/useLocalStorage";

// css
import './MemberManagement.css';

const MemberManagement = () => {

  useEffect(() => {
    sessionCheck()
  }, []);

  const mySwal = require('sweetalert2');
  const history = useHistory();
  const [UserId, setUserId] = useLocalStorage("userId", "0");
  const [UserName, setUserName] = useLocalStorage("userName", "");

  const sessionCheck = (event) => {
    axios({
      url: 'http://127.0.0.1:5000/auth/api/session_check',
      method:'GET',
    }).then(function (response) {
      if ( UserId !== "0" && !response['data']['session'] ) {
        mySwal.fire({icon: 'error', title: '실패', text: '세션이 만료되었습니다. 로그인 페이지로 이동합니다'}).then((result) => {
          setUserId("0");
          setUserName("");
          history.push('/Login');
        });
      } else if ( UserId === "0" && !response['data']['session'] ) {
        mySwal.fire({icon: 'error', title: '실패', text: '로그인이 필요한 페이지입니다. 로그인 페이지로 이동합니다'}).then((result) => {
          setUserId("0");
          setUserName("");
          history.push('/Login');
        });
      }
    }).catch(function(error){
      mySwal.fire({icon: 'error', title: '실패', text: '알수 없는 문제로 새션 확인을 실패했습니다'});
    });
  }
  
  return(
    <div className="management_wrap">
      <div className="table">
        <div className="tr">
          <div className="td th"><span>휴대폰번호</span></div>
          <div className="td th"><span>이름</span></div>
          <div className="td th"><span>비밀번호</span></div>
          <div className="td th"><span>비밀번호확인</span></div>
          <div className="td th"><span>등급</span></div>
          <div className="td th"></div>
        </div>
        <div className="tr">
          <div className="td"><input type="tel" value="01039345623" /></div>
          <div className="td"><input type="text" value="김태진" /></div>
          <div className="td"><input type="password" value="" /></div>
          <div className="td"><input type="password" value="" /></div>
          <div className="td">
            <select>
              <option>master</option>
              <option>guest</option>
            </select>
          </div>
          <div className="td"><button>변경</button></div>
        </div>
        <div className="tr">
          <div className="td"><input type="tel" value="01083455668" /></div>
          <div className="td"><input type="text" value="이명숙" /></div>
          <div className="td"><input type="password" value="" /></div>
          <div className="td"><input type="password" value="" /></div>
          <div className="td">
            <select>
              <option>master</option>
              <option>guest</option>
            </select>
          </div>
          <div className="td"><button>변경</button></div>
        </div>
      </div>
    </div>
  )
    
}

export default MemberManagement;
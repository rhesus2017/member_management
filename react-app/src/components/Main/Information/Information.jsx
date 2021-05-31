// react
import React, { useState, useEffect } from 'react'
import { Link, useHistory } from "react-router-dom";

// hoc
import useLocalStorage from "../../../hoc/useLocalStorage";

// css
import './Information.css';

const Information = () => {

  useEffect(() => {
    userId === "0" &&
      mySwal.fire({icon: 'error', title: '실패', text: '올바른 접근 경로가 아닙니다'}).then((result) => {
        history.push('/');
      });
  }, []);

  const mySwal = require('sweetalert2');
  const history = useHistory();
  const [Phone] = useState("");
  const [Name, setName] = useState("");
  const [Password, setPassword] = useState("");
  const [PasswordConfirm, setPasswordConfirm] = useState("");
  const [userId] = useLocalStorage("userId", "0");

  const onNameHandler = (event) => {
    setName(event.currentTarget.value);
  }
  const onPasswordHandler = (event) => {
    setPassword(event.currentTarget.value);
  }
  const onPasswordConfirmHandler = (event) => {
    setPasswordConfirm(event.currentTarget.value);
  }

  return(
    <div className="information_wrap">
      <form method="post" autocomplete="off">
        <div>
          <div>
            <p><span>휴대폰번호</span><span>*</span></p>
            <input type="text" value={Phone} readOnly />
          </div>
          <div>
            <p> <span>성명</span><span>*</span></p>
            <input type="text" value={Name} onChange={onNameHandler} />
          </div>
        </div>
        <div>
          <div>
            <p><span>비밀번호</span><span>*</span></p>
            <input type="password" autocomplete="off" value={Password} onChange={onPasswordHandler} />
          </div>
          <div>
            <p><span>비밀번호 확인</span><span>*</span></p>       
            <input type="password" autocomplete="off" value={PasswordConfirm} onChange={onPasswordConfirmHandler} />
          </div>
        </div>
        <p>
          <span>변경하기</span><Link to="/">취소</Link>
        </p>
      </form>
    </div>
  )
    
}

export default Information;
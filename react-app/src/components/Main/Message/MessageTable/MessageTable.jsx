// react
import React, { useState, useEffect } from 'react'


const MessageTable = ({ MessageList, check, nonCheck, AllChecked }) => {

  const [Checked, setChecked] = useState(false);

  useEffect(() => {
    setChecked(false);
  }, [MessageList]); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    if ( AllChecked ) {
      setChecked(true);
      check(MessageList['id']);
    } else {
      setChecked(false);
      nonCheck(MessageList['id']);
    }
  }, [AllChecked]); // eslint-disable-line react-hooks/exhaustive-deps
  
  const onCheckedHandler = (num) => {
    if ( Checked === false ) {
      setChecked(true);
      check(num);
    } else {
      setChecked(false);
      nonCheck(num);
    }
  }

  return(
    <form method='post' autocomplete='off' className='tr'>
      <div className='td'>
        <input type='checkbox' className='checkbox' onClick={() => { onCheckedHandler(MessageList['id']) }} checked={Checked} id={'check_' + MessageList['id']} />
        <label for={'check_' + MessageList['id']}></label>
      </div>
      <div className='td'><span>{MessageList['sender']}</span></div>
      <div className='td'><span>{MessageList['message']}</span></div>
      <div className='td'><span>{MessageList['datetime']}</span></div>
    </form>
  )
    
}

export default MessageTable;
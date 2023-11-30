import React, { useState } from 'react';
import axios from 'axios';
import './ContactUs.css';

function ContactUs() {
  const [title, setTitle] = useState('');
  const [message, setMessage] = useState('');
  const [showPopup, setShowPopup] = useState(false); // 팝업 표시 여부를 위한 state

  const handleSubmit = async () => {
    try {
      // 백엔드에 데이터 전송
      const response = await axios.post('https://api.murok.munwon.net/feedback/compose/', {
        title: title,
        description: message,
        // 추가적으로 필요한 데이터가 있다면 여기에 추가
      });
      console.log(response.data); // 응답 로그 출력
      setShowPopup(true); // 팝업 표시
    } catch (error) {
      console.error('문의하기 오류:', error);
    }
  };


  const handleClosePopup = () => {
    setShowPopup(false); // 팝업 숨김
  };

  return (
    <div className="contact-us-container">
      <h2>문의하기</h2>
      <div className="contact-form">
        <label>
          제목:
          <input 
            type="text" 
            value={title} 
            onChange={(e) => setTitle(e.target.value)}
            className="contact-title"
          />
        </label>
        <textarea 
          value={message} 
          onChange={(e) => setMessage(e.target.value)}
          className="contact-message"
          placeholder="내용을 입력해주세요."
        />
        <button onClick={handleSubmit} className="contact-submit">문의하기</button>
      </div>
      {showPopup && (
        <div className="popup">
          <div className="popup-content">
            <span className="close-btn" onClick={handleClosePopup}>&times;</span>
            <h3>문의 내용이 전송되었습니다.</h3>
            <p>빠른 시일 내에 답변 드리겠습니다.</p>
            <button onClick={handleClosePopup} className="confirm-btn">확인</button> {/* 확인 버튼 추가 */}
          </div>
        </div>
      )}
    </div>
  );
}

export default ContactUs;

import React, { useState } from 'react';
import './ContactUs.css';

function ContactUs() {
  const [title, setTitle] = useState('');
  const [message, setMessage] = useState('');
  const [showPopup, setShowPopup] = useState(false); // 팝업 표시 상태

  const handleSubmit = () => {
    const mailtoLink = `mailto:murok_contact@gmail.com?subject=${encodeURIComponent(title)}&body=${encodeURIComponent(message)}`;
    window.location.href = mailtoLink; // 이메일 클라이언트를 여는 링크
    setShowPopup(true); // 팝업 표시
    setTitle(''); // 제목 초기화
    setMessage(''); // 메시지 초기화
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
            placeholder="제목을 입력해주세요."
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
            <button onClick={handleClosePopup} className="confirm-btn">확인</button>
          </div>
        </div>
      )}
    </div>
  );
}

export default ContactUs;

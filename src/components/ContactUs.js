import React, { useState } from 'react';
import './ContactUs.css';

function ContactUs() {
  const [title, setTitle] = useState('');
  const [message, setMessage] = useState('');

  const handleSubmit = () => {
    const mailtoLink = `mailto:murok_contact@gmail.com?subject=${encodeURIComponent(title)}&body=${encodeURIComponent(message)}`;
    window.location.href = mailtoLink; // 이메일 클라이언트를 여는 링크
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
    </div>
  );
}

export default ContactUs;

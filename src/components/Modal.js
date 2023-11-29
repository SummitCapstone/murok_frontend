import React from 'react';
import './Modal.css'; // 모달에 대한 CSS

function Modal({ children, onClose }) {
  return (
    <div className="modal-backdrop">
      <div className="modal-content">
        {children}
        <button onClick={onClose}>닫기</button>
      </div>
    </div>
  );
}

export default Modal;

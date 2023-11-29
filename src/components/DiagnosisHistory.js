import React from 'react';
import './DiagnosisHistory.css';

function DiagnosisHistory() {
  return (
    <div className="diagnosis-history-container">
      <h2>진단 이력</h2>
      <div className="diagnosis-box">
        <div className="diagnosis-title">제목: 진단 이력 테스트</div>
        <div className="diagnosis-date">날짜: 2023-11-02</div>
      </div>
      {/* 추가적인 진단 이력 박스들을 필요에 따라 여기에 추가 */}
    </div>
  );
}

export default DiagnosisHistory;
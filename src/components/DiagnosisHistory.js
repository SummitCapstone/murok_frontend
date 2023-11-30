import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../contexts/AuthContext'; // useAuth 훅을 가져옴
import './DiagnosisHistory.css';

function DiagnosisHistory() {
  const [history, setHistory] = useState([]);
  const auth = useAuth(); // useAuth 훅을 사용하여 로그인 상태 가져오기

  useEffect(() => {
    if (auth.currentUser) {
      // 로그인한 사용자: 서버에서 진단 이력 불러오기
      const SERVER_URL = 'https://api.murok.munwon.net';
      axios.get(`${SERVER_URL}/user/diagnosis-history`, {
        headers: {
          // 인증 토큰이 필요한 경우, 여기에 추가
          // Authorization: `Bearer ${auth.currentUser.token}`
        }
      })
      .then(response => {
        setHistory(response.data); // 서버 응답에 따라 조정 필요
      })
      .catch(error => console.error('Error fetching history:', error));
    } else {
      // 로그인하지 않은 사용자: 로컬 스토리지에서 진단 이력 불러오기
      const localHistory = localStorage.getItem('diagnosisHistory');
      if (localHistory) {
        setHistory(JSON.parse(localHistory));
      }
    }
  }, [auth.currentUser]); // 의존성 배열에 auth.currentUser 추가

  return (
    <div className="diagnosis-history-container">
      <h2>진단 이력</h2>
      {history.map((item, index) => (
        <div key={index} className="diagnosis-box">
          <div className="diagnosis-title">제목: {item.title}</div>
          <div className="diagnosis-date">날짜: {item.date}</div>
        </div>
      ))}
    </div>
  );
}

export default DiagnosisHistory;

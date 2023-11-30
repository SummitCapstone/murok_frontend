import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { UuidContext } from '../contexts/UuidContext';
import './DiagnosisHistory.css';

function DiagnosisHistory() {
  const [history, setHistory] = useState([]);
  const uuid = useContext(UuidContext); // UuidContext에서 UUID 가져오기

  useEffect(() => {
    const SERVER_URL = 'https://api.murok.munwon.net';

    axios.get(`${SERVER_URL}/diagnosis-history`, {
      headers: {
        'X-Request-User-Id': uuid, // UuidContext에서 가져온 UUID 사용
      }
    })
    .then(response => {
      setHistory(response.data);
    })
    .catch(error => console.error('Error fetching history:', error));
  }, [uuid]); // UUID가 변경될 때마다 useEffect 재실행

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

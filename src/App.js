import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom';

import DiagnosisHistory from './components/DiagnosisHistory';
import Login from './components/Login';

import DiagnosisResult from './components/DiagnosisResult';

import DiagnosisPage from './components/DiagnosisPage';

import ContactUs from './components/ContactUs';

import homeButtonImage from './assets/homeButton.png';
import readingGlassesImage from './assets/readingglasses.png';

// 로그인, 로그아웃 관리
import { AuthProvider } from './contexts/AuthContext';
import AuthLinks from './contexts/AuthLinks'; // 새로 만든 컴포넌트 임포트


import './App.css';

function App() {
  // 작물 종류, 이미지 첨부 상태 
  const [selectedCrop, setSelectedCrop] = useState(null);
  const [selectedImage, setSelectedImage] = useState(null);

  const [isFontAdjusterVisible, setFontAdjusterVisible] = useState(false);
  // 상태로 저장하여 컴포넌트 갱신 시에도 초기 폰트 크기 유지
  const [defaultFontSize, setDefaultFontSize] = useState('');

  useEffect(() => {
    // 컴포넌트 마운트 시에 한 번만 실행되어야 하므로 빈 의존성 배열을 사용합니다.
    const fontSize = window.getComputedStyle(document.body).fontSize;
    setDefaultFontSize(fontSize);
  }, []);

  const handleFontAdjustment = () => {
    setFontAdjusterVisible(!isFontAdjusterVisible);
  };

  const adjustFontSize = (type) => {
    const root = document.documentElement;
    const currentFontSize = getComputedStyle(root).getPropertyValue('font-size');
    const newSize = type === 'increase'
      ? parseFloat(currentFontSize) * 1.1 + 'px'
      : parseFloat(currentFontSize) * 0.9 + 'px';

    root.style.setProperty('font-size', newSize);
  };

  const handleReset = () => {
    document.documentElement.style.fontSize = defaultFontSize;
  };

  return (
    <Router>
      <AuthProvider>
        <div className="App">
          <header className="App-header">
            <h1>무럭 AI 진단 플랫폼</h1>
          </header>
          <main>
            <Routes>
              <Route path="/" element={
                <>
                  <Link to="/start-diagnosis" className="menu-item">진단 시작하기</Link>
                  <Link to="/diagnosis-history" className="menu-item">나의 진단이력</Link>
                  <Link to="/contact" className="menu-item">문의하기</Link>
                  {/* <Link to="/login" className="menu-item">로그인</Link> */}
                  <AuthLinks /> {/* 여기에 AuthLinks 컴포넌트 추가 */}
                </>
              } />
              <Route path="/start-diagnosis" element={
                <DiagnosisPage
                  selectedCrop={selectedCrop}
                  setSelectedCrop={setSelectedCrop}
                  selectedImage={selectedImage}
                  setSelectedImage={setSelectedImage}
                />
              } />
              <Route path="/diagnosis-history" element={<DiagnosisHistory />} />
              <Route path="/contact" element={<ContactUs />} />
              <Route path="/login" element={<Login />} />
              <Route path="/diagnosis-result" element={<DiagnosisResult />} />
            </Routes>
          </main>
          <footer className="App-footer">
            <div className="footer-controls">
              <div className="home-button-container">
                <Link to="/">
                  <img src={homeButtonImage} alt="홈으로 가기" className="home-button-image" />
                </Link>
              </div>
              <div className="font-controls">
                <button onClick={handleFontAdjustment} className="adjust-font-button">
                  <img src={readingGlassesImage} alt="글자 크기 조절" />
                </button>
                {isFontAdjusterVisible && (
                  <div className="font-adjuster-popup">
                    <button onClick={() => adjustFontSize('increase')}>+</button>
                    <button onClick={() => adjustFontSize('decrease')}>-</button>
                    <button onClick={handleReset}>초기화</button>
                    <button onClick={handleFontAdjustment} className="close-font-adjuster">닫기</button>
                  </div>
                )}
              </div>
            </div>
          </footer>
        </div>
      </AuthProvider>
    </Router>
  );
}

export default App;
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
// import { useAuth } from '../contexts/AuthContext';
import './Login.css';

function Login() {
  const [email, setEmail] = useState("");
  const [verificationCode, setVerificationCode] = useState("");
  const [showVerificationField, setShowVerificationField] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  // 시간 설정
  const [timer, setTimer] = useState(15 * 60); // 초 단위로 15분 설정
  const [countdownActive, setCountdownActive] = useState(false);

  // 로그인 관리
  // const { login } = useAuth();

  const navigate = useNavigate();
  const SERVER_URL = 'http://localhost:5000';

  useEffect(() => {
    let interval = null;
    if (countdownActive && timer > 0) {
      interval = setInterval(() => {
        setTimer(timer => timer - 1); // 매 초마다 타이머를 감소
      }, 1000);
    } else if (timer === 0) {
      // 타이머가 0이 되면 인증 시간 만료 처리
      setShowVerificationField(false);
      setError('인증 시간이 만료되었습니다.');
      clearInterval(interval);
    }
    return () => clearInterval(interval);
  }, [countdownActive, timer]);

  // 이메일 인증 요청 핸들러
  const handleRequestVerification = async () => {
    try {
      setLoading(true);
      // POST 요청을 통해 이메일을 서버에 보내고, 인증번호를 이메일로 발송하는 로직을 구현합니다.
      await axios.post(`${SERVER_URL}/api/send-verification-code`, { email });
      // 카운트다운 시작
      setShowVerificationField(true);
      setCountdownActive(true);
      setTimer(15 * 60); // 타이머를 15분으로 재설정
    } catch (error) {
      console.error('Error requesting verification:', error);
      setError('인증번호 요청에 실패했습니다.');
    } finally {
      setLoading(false);
    }
  };

  // 인증번호 검증 핸들러
  const handleVerification = async () => {
    try {
      setLoading(true);
      // POST 요청을 통해 사용자가 입력한 인증번호를 서버에 보내고, 검증을 요청합니다.
      const response = await axios.post(`${SERVER_URL}/api/verify-code`, {
        email,
        code: verificationCode
      });
      // 서버로부터의 응답에서 JWT 토큰을 받아온다고 가정합니다.
      const { token } = response.data;
      if (token) {
        console.log("Verified successfully!");
        // JWT를 로컬 스토리지에 저장합니다.
        localStorage.setItem('token', token);
        navigate('/'); // 인증 성공 시 메인 페이지로 리디렉트합니다.
      } else {
        // 인증번호 불일치 또는 다른 오류 처리
        throw new Error('Verification failed.');
      }
    } catch (err) {
      console.error('Error verifying code:', err);
      setError('인증 번호 검증에 실패했습니다.');
    } finally {
      setLoading(false);
    }
  };


  // 타이머를 MM:SS 형식으로 표시하는 함수
  const formatTimer = () => {
    const minutes = Math.floor(timer / 60);
    const seconds = timer % 60;
    return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
  };

  return (
    <div className="login-container">
      <h1>로그인</h1>
      <div>
        <label>
          이메일:
          <input
            type="email"
            placeholder="이메일을 입력하세요."
            value={email}
            onChange={e => setEmail(e.target.value)}
          />
        </label>
        <button onClick={() => handleRequestVerification(true)} disabled={loading || showVerificationField}>
          {loading ? '확인 중...' : '인증번호 받기'}
        </button>
      </div>

      {showVerificationField && (
        <>
          <div className="divider" /> {/* 구분선 추가 */}
          <div className={`verification-section ${showVerificationField ? 'active' : ''}`}></div>
          <label>
            인증 번호:
            <input
              type="text"
              placeholder="인증번호 6자리 입력하세요."
              value={verificationCode}
              onChange={e => setVerificationCode(e.target.value)}
            />
          </label>
          <button onClick={handleVerification} disabled={loading}>
            {loading ? '검증 중...' : '인증 확인'}
          </button>
          {error && <p className="error">{error}</p>}
          <p className={`timer ${timer === 0 ? 'expired' : ''}`}>남은 시간: {formatTimer()}</p> {/* Correct function call to display the timer */}
        </>
      )}
    </div>
  );
}

export default Login;

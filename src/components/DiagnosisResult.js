import React, { useRef, useEffect, useMemo, useState } from 'react'; // useMemo 추가
import { useNavigate } from 'react-router-dom';
import html2canvas from 'html2canvas';
import Modal from './Modal'; // Modal 컴포넌트 임포트
import ContactUs from './ContactUs'; // ContactUs 컴포넌트 임포트
import './DiagnosisResult.css';

function DiagnosisResult() {
  const canvasRef = useRef(null);
  const navigate = useNavigate();
  const [showModal, setShowModal] = useState(false);

  const openModal = () => {
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
  };

  // useMemo를 사용하여 data 배열 메모이제이션
  const data = useMemo(() => [
    { label: 'Item One', value: 10, color: 'black' },
    { label: 'Item Two', value: 20, color: '#7F7F7F' },
    { label: 'Item Three', value: 70, color: '#3F3F3F' }
  ], []);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    const centerX = canvas.width / 2;
    const centerY = canvas.height / 2;
    const radius = Math.min(centerX, centerY);

    let startAngle = 0;

    data.forEach(item => {
      const endAngle = startAngle + 2 * Math.PI * (item.value / 100);
      ctx.beginPath();
      ctx.arc(centerX, centerY, radius, startAngle, endAngle);
      ctx.lineTo(centerX, centerY);
      ctx.fillStyle = item.color;
      ctx.fill();
      startAngle = endAngle;
    });
  }, [data]); // useEffect의 의존성 배열에 data 추가

  // '자세한 정보' 페이지로 이동하는 함수
  const goToDetailedInfo = () => {
    // 테스트를 위해 직접 값을 설정
    const testCropName = '오이';
    const testSickNameKor = '노균병';

    navigate('/detailed-info', { state: { cropName: testCropName, sickNameKor: testSickNameKor } });
  };


  // '자세한 정보' 페이지로 이동하는 함수
  // const goToDetailedInfo = () => {
  //   navigate('/detailed-info');
  // };

  // '문의하기' 페이지로 이동하는 함수 (삭제, 모달 사용)
  // const goToContactUs = () => {
  //   navigate('/contact');
  // };

  // 진단 결과를 이미지로 저장하는 함수
  const saveDiagnosisAsImage = () => {
    html2canvas(document.querySelector(".diagnosis-result")).then(canvas => {
      const image = canvas.toDataURL("image/png", 1.0);
      let link = document.createElement('a');
      link.href = image;
      link.download = 'diagnosis-result.png';
      link.click();
    });
  };

  return (
    <div className="diagnosis-result">
      <h2>진단 결과</h2>
      <div className="image-box">
        이미지
      </div>
      <div className="diagram">
        <canvas ref={canvasRef} width={180} height={180}></canvas>
        <div>
          {data.map(item => (
            <div key={item.label}>{item.label}: {item.value}%</div>
          ))}
        </div>
      </div>
      <div className="result-buttons">
        <button onClick={goToDetailedInfo}>자세한 정보</button>
        <button onClick={openModal}>문의하기</button>
      </div>
      {showModal && (
        <Modal show={showModal} onClose={closeModal}>
          <ContactUs />
        </Modal>
      )}
      <button onClick={saveDiagnosisAsImage} className="save-diagnosis">진단 내용 저장</button>
    </div>
  );
}

export default DiagnosisResult;

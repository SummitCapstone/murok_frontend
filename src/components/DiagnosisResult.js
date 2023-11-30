import React, { useRef, useEffect, useMemo, useState } from 'react'; // useMemo 추가
import { useNavigate, useLocation } from 'react-router-dom';
import html2canvas from 'html2canvas';
import Modal from './Modal'; // Modal 컴포넌트 임포트
import ContactUs from './ContactUs'; // ContactUs 컴포넌트 임포트
import './DiagnosisResult.css';

// 랜덤 색상 생성 함수
function getRandomColor() {
  const letters = '0123456789ABCDEF';
  let color = '#';
  for (let i = 0; i < 6; i++) {
    color += letters[Math.floor(Math.random() * 16)];
  }
  return color;
}

function DiagnosisResult() {
  const canvasRef = useRef(null);
  const navigate = useNavigate();
  const location = useLocation(); // useLocation 추가
  const [showModal, setShowModal] = useState(false);
  const [diagnosisData, setDiagnosisData] = useState(null); // 진단 데이터 상태 추가
  const [data, setData] = useState([]);
  const [imageURL, setImageURL] = useState(null);

  useEffect(() => {
    if (location.state && location.state.data) {
      const receivedData = location.state.data;
      setDiagnosisData(receivedData);
      
      // 콘솔에 데이터 확인
      console.log("Received Data:", receivedData);

      // 이미지 URL 설정
      if (receivedData.imageURL) {
        setImageURL(receivedData.imageURL);
      }

      // 확률 데이터 변환 및 설정
      if (receivedData.probability_ranking && receivedData.probability_ranking.crop_status_possibility_rank) {
        const formattedData = receivedData.probability_ranking.crop_status_possibility_rank.map(item => ({
          label: item.state,
          value: parseFloat(item.probability), // 문자열을 숫자로 변환
          color: getRandomColor()
        }));
        setData(formattedData);
      }
    } else {
      navigate('/'); // 데이터가 없으면 홈으로 리다이렉트
    }
  }, [location, navigate]);


  useEffect(() => {
    if (!canvasRef.current) return;
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
  }, [data]);

  const openModal = () => {
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
  };

  // '자세한 정보' 페이지로 이동하는 함수
  const goToDetailedInfo = () => {
    // diagnosisData와 diagnosisData.probability_ranking이 존재하는지 확인
    if (!diagnosisData || !diagnosisData.probability_ranking || !diagnosisData.probability_ranking.crop_status_possibility_rank) {
      alert('자세한 정보를 가져올 수 없습니다.');
      return;
    }

    const cropName = diagnosisData.crop_category;
    const sickNameKor = diagnosisData.probability_ranking.crop_status_possibility_rank[0].state; // 가장 높은 확률의 상태

    navigate('/detailed-info', { state: { cropName, sickNameKor } });
  };

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
        {imageURL ? <img src={imageURL} alt="Crop Image" /> : '이미지를 불러오는 중...'}
      </div>
      <div className="diagram">
        <canvas ref={canvasRef} width={180} height={180}></canvas>
        <div className="probability-ranking">
          {data.map((item, index) => (
            <div key={index} className="probability-item">
              <span className="probability-label">{item.label}</span>
              <span className="probability-value">{item.value}%</span>
              <div className="probability-color" style={{ backgroundColor: item.color }}></div>
            </div>
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

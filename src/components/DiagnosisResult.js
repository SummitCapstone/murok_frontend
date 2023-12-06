import React, { useRef, useEffect, useState, useContext } from 'react'; // useMemo 추가
import { useLocation } from 'react-router-dom';
import html2canvas from 'html2canvas';
import Modal from './Modal'; // Modal 컴포넌트 임포트
import ContactUs from './ContactUs'; // ContactUs 컴포넌트 임포트
import DetailedInfo from './DetailedInfo';
import axios from 'axios';
import { UuidContext } from '../contexts/UuidContext';
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
  const location = useLocation(); // useLocation 추가
  const [showModal, setShowModal] = useState(false);
  const [showDetailedModal, setShowDetailedModal] = useState(false);
  const [diagnosisData, setDiagnosisData] = useState(null); // 진단 데이터 상태 추가
  const [data, setData] = useState([]);
  const [imageURL, setImageURL] = useState(null);
  const [displayData, setDisplayData] = useState([]);
  const uuid = useContext(UuidContext);

  // location에서 사용자가 선택한 이미지 받아오기
  const selectedImage = location.state && location.state.selectedImage
    ? URL.createObjectURL(location.state.selectedImage)
    : null;


  useEffect(() => {
    // 서버로부터 받은 result_url을 사용하여 추가 데이터 요청
    const fetchReportData = async () => {
      if (location.state && location.state.data && location.state.data.result_url) {
        const reportUrl = `https://api.murok.munwon.net${location.state.data.result_url}`;
        try {
          const response = await axios.get(reportUrl, {
            headers: {
              'X-Request-User-Id': uuid, // UUID를 헤더에 추가
            },
          });
          // 응답 데이터를 상태에 저장
          const reportData = response.data;
          setDiagnosisData(reportData);
          console.log('Report Data:', reportData);

          if (reportData.imageURL) {
            setImageURL(reportData.imageURL);
          }

          if (reportData.probability_ranking && reportData.probability_ranking.length > 0) {
            const topThreeData = reportData.probability_ranking
              .slice(0, 3)
              .map(item => ({
                label: item.state,
                value: parseFloat(item.probability),
                color: getRandomColor()
              }));
            setData(topThreeData);
          } else {
            console.log("No probability ranking data available");
          }
        } catch (error) {
          console.error('Report Data Fetching Error:', error);
        }
      }
    };

    fetchReportData();
  }, [location.state, uuid]);

  useEffect(() => {
    if (!canvasRef.current || data.length === 0) return;
    const canvas = canvasRef.current;
    canvas.width = canvas.offsetWidth;
    canvas.height = 200;

    const ctx = canvas.getContext('2d');
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    const centerX = canvas.width / 2;
    const centerY = canvas.height / 2;
    const radius = Math.min(centerX, centerY) - 10;
    let startAngle = 0;

    let totalPercentage = 0;
    data.forEach(item => {
      totalPercentage += item.value;
    });

    // totalPercentage를 콘솔에 출력
    console.log("Total Percentage:", totalPercentage);

    let updatedData = [...data];

    if (totalPercentage < 1) {
      const otherValue = 1 - totalPercentage;
      const otherData = {
        label: '기타',
        value: otherValue,
        color: getRandomColor()
      };
      updatedData.push(otherData);
    }

    console.log("Updated Data:", updatedData);

    updatedData.forEach(item => {
      const sliceAngle = 2 * Math.PI * (item.value / 1);
      const endAngle = startAngle + sliceAngle;
      ctx.beginPath();
      ctx.arc(centerX, centerY, radius, startAngle, endAngle);
      ctx.lineTo(centerX, centerY);
      ctx.fillStyle = item.color;
      ctx.fill();
      startAngle = endAngle;
    });

    setDisplayData(updatedData);
  }, [data]); // 의존성 배열에 data만 포함




  const openModal = () => {
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
  };

  const openDetailedModal = () => {
    setShowDetailedModal(true);
  };

  const closeDetailedModal = () => {
    setShowDetailedModal(false);
  };

  // '자세한 정보' 페이지로 이동하는 함수
  const goToDetailedInfo = () => {
    if (!diagnosisData || !diagnosisData.probability_ranking || !diagnosisData.probability_ranking.crop_status_possibility_rank) {
      alert('자세한 정보를 가져올 수 없습니다.');
      return;
    }
    openDetailedModal();
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
      <div className="image-container">
        <div className="user-image-box">
          {selectedImage ? (
            <img src={selectedImage} alt="User's Crop" />
          ) : (
            '사용자 이미지를 불러오는 중...'
          )}
        </div>
        <div className="server-image-box">
          {imageURL ? <img src={imageURL} alt="Server's Crop" /> : '서버 이미지를 불러오는 중...'}
        </div>
      </div>
      <div className="chart-and-ranking">
        <div className="diagram">
          <canvas ref={canvasRef} width={200} height={200}></canvas>
        </div>
        <div className="probability-ranking">
          {displayData.map((item, index) => (
            <div key={index} className="probability-item">
              <span className="probability-label">{item.label} : </span>
              <span className="probability-value">{(item.value * 100).toFixed(2)}%</span>
            </div>
          ))}
        </div>
      </div>
      <div className="diagnosis-content">
        <div className="result-buttons">
          <button onClick={goToDetailedInfo}>자세한 정보</button>
          <button onClick={openModal}>문의하기</button>
        </div>
        {showModal && (
          <Modal show={showModal} onClose={closeModal}>
            <ContactUs />
          </Modal>
        )}
        {showDetailedModal && (
          <Modal show={showDetailedModal} onClose={closeDetailedModal}>
            <DetailedInfo
              cropName={diagnosisData.crop_category}
              sickNameKor={diagnosisData.probability_ranking.crop_status_possibility_rank[0].state}
            />
          </Modal>
        )}
        <button onClick={saveDiagnosisAsImage} className="save-diagnosis">진단 내용 저장</button>
      </div>
    </div>
  );
}

export default DiagnosisResult;
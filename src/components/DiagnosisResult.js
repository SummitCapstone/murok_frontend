import React, { useRef, useEffect, useState, useContext } from 'react'; // useMemo 추가
import { useLocation, useNavigate } from 'react-router-dom';
import html2canvas from 'html2canvas';
import Modal from './Modal'; // Modal 컴포넌트 임포트
import ContactUs from './ContactUs'; // ContactUs 컴포넌트 임포트
import DetailedInfo from './DetailedInfo';
import diseasesData from './diseasesData'; // diseasesData 임포트
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

// 작물의 영어 이름과 한글 이름 매핑
const cropNameMapping = {
  "strawberry": "딸기",
  "cucumber": "오이",
  "tomato": "토마토",
  "pepper": "고추",
};

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

  // 오류 메시지 상태와 페이지 이동 함수 추가
  const [errorMessage, setErrorMessage] = useState('');
  const navigate = useNavigate();

  // location에서 사용자가 선택한 이미지 받아오기
  const selectedImage = location.state && location.state.selectedImage
    ? URL.createObjectURL(location.state.selectedImage)
    : null;


  // 이미지 URL을 Base64 문자열로 변환하는 함수
  const convertImageToBase64 = (url, callback) => {
    const img = new Image();
    img.crossOrigin = 'Anonymous'; // CORS 정책 우회
    img.onload = () => {
      let canvas = document.createElement('canvas');
      let ctx = canvas.getContext('2d');
      canvas.height = img.naturalHeight;
      canvas.width = img.naturalWidth;
      ctx.drawImage(img, 0, 0);
      const dataURL = canvas.toDataURL('image/png');
      callback(dataURL);
      canvas = null;
    };
    img.src = url;
    // URL이 데이터 URL이 아닐 경우 에러 방지를 위해 설정
    if (img.complete || img.complete === undefined) {
      img.src = "data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///ywAAAAAAQABAAACAUwAOw==";
      img.src = url;
    }
  };


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

          if (reportData) {
            // 영어 작물 이름을 한글로 변환
            const translatedCropName = cropNameMapping[reportData.crop_category] || reportData.crop_category;

            // 한글 작물 이름과 질병 이름으로 thumbImg URL 찾기
            const diseaseInfo = diseasesData.find(d =>
              d.cropName === translatedCropName &&
              d.sickNameKor === reportData.probability_ranking[0].state
            );

            if (diseaseInfo && diseaseInfo.thumbImg) {
              convertImageToBase64(diseaseInfo.thumbImg, (base64Img) => {
                setImageURL(base64Img);
              });
            }
          }

          if (reportData.probability_ranking && reportData.probability_ranking.length > 0) {
            // 1순위 질병의 확률이 85% 미만일 경우
            if (reportData.probability_ranking[0].probability < 0.85) {
              setErrorMessage(
                `진단 결과가 명확하지 않습니다.<br/><br/>
                진단 결과가 명확하지 않을 수 있는 이유는 다음과 같습니다.<br/>
                1. 선택한 작물 종류와 이미지가 일치하지 않는 경우<br/>
                2. 지원하지 않는 병해로 진단이 불가능한 경우<br/>
                3. 사진이 부적절하게 찍힌 경우<br/><br/>
                다시 진단을 시작해주세요.`
              );
              // setTimeout(() => navigate('/start-diagnosis'), 5000); // Navigate after 5 seconds
            }

            const topThreeData = reportData.probability_ranking
              .slice(0, 3)
              .map(item => ({
                label: item.state,
                value: parseFloat(item.probability),
                color: getRandomColor()
              }));
            // 작물 이름을 한글로 변환
            const translatedCropName = cropNameMapping[reportData.crop_category] || reportData.crop_category;

            setDiagnosisData({
              ...reportData,
              crop_category: translatedCropName
            });
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
  }, [location.state, uuid, navigate]);

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

  const handleModalClose = () => {
    setErrorMessage('');
    navigate('/start-diagnosis');
  };

  // '자세한 정보' 페이지로 이동하는 함수
  const goToDetailedInfo = () => {
    if (!diagnosisData || !diagnosisData.probability_ranking) {
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
      {errorMessage && (
        <Modal show={true} onClose={handleModalClose}>
          <div dangerouslySetInnerHTML={{ __html: errorMessage }} style={{ textAlign: 'center' }}></div>
        </Modal>
      )}
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
              sickNameKor={diagnosisData.probability_ranking[0].state} // 가장 확률이 높은 질병의 이름을 전달
            />
          </Modal>
        )}
        <button onClick={saveDiagnosisAsImage} className="save-diagnosis">진단 내용 저장</button>
      </div>
    </div>
  );
}

export default DiagnosisResult;
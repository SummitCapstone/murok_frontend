import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { UuidContext } from '../contexts/UuidContext';
import { useAuth } from '../contexts/AuthContext';
import Modal from './Modal'; // Modal 컴포넌트 임포트
import DetailedInfo from './DetailedInfo'; // DetailedInfo 컴포넌트 임포트
import './DiagnosisHistory.css';

// 작물의 영어 이름과 한글 이름 매핑
const cropNameMapping = {
  "strawberry": "딸기",
  "cucumber": "오이",
  "tomato": "토마토",
  "pepper": "고추",
};

function DiagnosisHistory() {
  const [history, setHistory] = useState([]); // 진단 이력을 저장할 상태
  const uuid = useContext(UuidContext); // UuidContext에서 UUID 가져오기
  const { currentUser } = useAuth();
  const [showDetailedModal, setShowDetailedModal] = useState(false); // 모달 상태
  const [selectedDiagnosis, setSelectedDiagnosis] = useState(null); // 선택된 진단 이력


  const [currentPage, setCurrentPage] = useState(1); // 현재 페이지 번호 상태
  const [totalPages, setTotalPages] = useState(0); // 전체 페이지 수

  // 페이지당 항목 수
  const itemsPerPage = 10;

  // 자세한 정보 모달을 여는 함수
  const openDetailedModal = (diagnosisData) => {
    const mappedData = {
      ...diagnosisData,
      crop_category: cropNameMapping[diagnosisData.crop_category] || diagnosisData.crop_category,
    };
    setSelectedDiagnosis(mappedData);
    setShowDetailedModal(true);
  };


  // 모달을 닫는 함수
  const closeDetailedModal = () => {
    setShowDetailedModal(false);
    setSelectedDiagnosis(null);
  };

  const goToPrevPage = () => {
    setCurrentPage(currentPage => Math.max(1, currentPage - 1));
  };

  const goToNextPage = () => {
    setCurrentPage(currentPage => Math.min(totalPages, currentPage + 1));
  };

  useEffect(() => {
    if (!currentUser) return;

    const SERVER_URL = 'https://api.murok.munwon.net';

    axios.get(`${SERVER_URL}/reports?page=${currentPage}`, {
      headers: {
        'X-Request-User-Id': uuid,
      }
    })
      .then(response => {
        if (response.data && response.data.results) {
          setHistory(response.data.results);
          setTotalPages(Math.ceil(response.data.count / itemsPerPage));
        }
      })
      .catch(error => console.error('Error fetching history:', error));
  }, [uuid, currentUser, currentPage]); // currentPage 추가

  if (!currentUser) {
    return <div className="diagnosis-history-container">
      <h2>진단 이력</h2>
      <p>회원가입한 사용자만 이용할 수 있습니다.</p>
    </div>;
  }

  return (
    <div className="diagnosis-history-container">
      <h2>진단 이력</h2>
      {history.length > 0 ? (
        history.map((item, index) => {
          const dateTime = new Date(item.created_date);
          const cropNameKor = cropNameMapping[item.crop_category] || item.crop_category;
          return (
            <div key={index} className="diagnosis-box" onClick={() => openDetailedModal(item)}>
              <div className="diagnosis-title">작물: {cropNameKor} - {item.crop_status}</div>
              <div className="diagnosis-date">
                날짜: {dateTime.toLocaleDateString()} {dateTime.toLocaleTimeString()}
              </div>
            </div>
          );
        })
      ) : (
        <p>아직 진단 이력 조회할 데이터가 존재하지 않습니다.</p> // 진단 이력이 없는 경우 표시할 메시지
      )}
      {showDetailedModal && selectedDiagnosis && (
        <Modal show={showDetailedModal} onClose={closeDetailedModal}>
          <DetailedInfo
            cropName={selectedDiagnosis.crop_category}
            sickNameKor={selectedDiagnosis.crop_status}
          />
        </Modal>
      )}
      <div className="pagination">
        <button onClick={goToPrevPage} disabled={currentPage === 1}>이전</button>
        <span>페이지 {currentPage} / {totalPages}</span>
        <button onClick={goToNextPage} disabled={currentPage === totalPages}>다음</button>
      </div>
    </div>
  );
}

export default DiagnosisHistory;

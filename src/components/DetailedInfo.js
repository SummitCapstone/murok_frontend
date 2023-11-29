import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom'; // useLocation 훅 임포트
import diseasesData from './diseasesData';
import './DetailedInfo.css';

function DetailedInfo() {
  const [info, setInfo] = useState(null);
  const location = useLocation();
  // useLocation을 사용하여 전달된 작물명과 병해명을 가져옵니다.
  const { cropName, sickNameKor } = location.state || {};

  useEffect(() => {
    // 데이터에서 해당 작물의 병해 정보를 찾습니다.
    const diseaseInfo = diseasesData.find(
      disease => disease.cropName === cropName && disease.sickNameKor === sickNameKor
    );
    setInfo(diseaseInfo);
  }, [cropName, sickNameKor]);

  return (
    <div className="detailed-info">
      <h1>{info ? `${info.cropName} - ${info.sickNameKor} (${info.sickNameEng})` : '로딩 중...'}</h1>
      <strong>발달 조건:</strong><div dangerouslySetInnerHTML={{ __html: info ? info.developmentCondition : '' }}></div>
      <strong>예방 방법:</strong><div dangerouslySetInnerHTML={{ __html: info ? info.preventionMethod : '' }}></div>
      <strong>증상:</strong><div dangerouslySetInnerHTML={{ __html: info ? info.symptoms : '' }}></div>
      {info && info.infectionRoute && <div dangerouslySetInnerHTML={{ __html: info.infectionRoute }}></div>}
      {info && info.thumbImg && (
        <div>
          <img src={info.thumbImg} alt={`${info.sickNameKor} 이미지`} />
        </div>
      )}
    </div>
  );
}

export default DetailedInfo;

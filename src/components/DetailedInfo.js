import React, { useState, useEffect } from 'react';
import diseasesData from './diseasesData';
import './DetailedInfo.css';

function DetailedInfo({ cropName, sickNameKor }) { // props로 데이터 받기
  const [info, setInfo] = useState(null);

  useEffect(() => {
    const diseaseInfo = diseasesData.find(
      disease => disease.cropName === cropName && disease.sickNameKor === sickNameKor
    );
    setInfo(diseaseInfo);
  }, [cropName, sickNameKor]);

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

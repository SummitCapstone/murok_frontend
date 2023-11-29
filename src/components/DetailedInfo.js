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
            <h1>{info ? info.cropName : '로딩 중...'}</h1>
            <p>{info ? info.developmentCondition : '상세 정보를 불러오는 중입니다.'}</p>
            {/* 필요에 따라 추가 정보 표시 */}
        </div>
    );
}

export default DetailedInfo;

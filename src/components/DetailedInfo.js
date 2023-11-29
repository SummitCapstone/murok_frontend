import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useLocation } from 'react-router-dom'; // useLocation 훅 임포트
import './DetailedInfo.css';

function DetailedInfo() {
    const [info, setInfo] = useState(null);
    const location = useLocation();
    // useLocation을 사용하여 전달된 작물명과 병해명을 가져옵니다.
    const { cropName, sickNameKor } = location.state || {};

    useEffect(() => {
        // API 호출을 위한 함수
        const fetchNCPMSData = async () => {
            try {
                // Axios를 사용하여 실제 API 호출
                const response = await axios.get('https://어쩌구/crop_api', {
                    params: {
                        apiKey: 'API_KEY', // 실제 API 키
                        serviceCode: 'SVC01', // 서비스 코드
                        serviceType: 'AA003', // 서비스 타입
                        cropName, // 작물 이름
                        sickNameKor // 병해 이름
                    }
                });
                setInfo(response.data); // 응답 데이터로 상태 업데이트
            } catch (error) {
                console.error('API 호출 중 오류 발생:', error);
                setInfo({ title: '오류', content: '정보를 불러오는 중 오류가 발생했습니다.' });
            }
        };

        if (cropName && sickNameKor) {
            fetchNCPMSData();
        }
    }, [cropName, sickNameKor]); // useEffect의 의존성 배열에 cropName과 sickNameKor 추가

    return (
        <div className="detailed-info">
            <h1>{info ? info.cropName : '로딩 중...'}</h1>
            <p>{info ? info.developmentCondition : '상세 정보를 불러오는 중입니다.'}</p>
            {/* 필요에 따라 추가 정보 표시 */}
        </div>
    );
}

export default DetailedInfo;

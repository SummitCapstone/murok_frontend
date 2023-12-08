import React, { useContext, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import CropSelection from './CropSelection';
import ImageUpload from './ImageUpload';
import axios from 'axios';
import { v4 as uuidv4 } from 'uuid'; // UUID 생성을 위한 라이브러리 임포트
import './DiagnosisPage.css';
import { UuidContext } from '../contexts/UuidContext';

function DiagnosisPage({ selectedCrop, setSelectedCrop, selectedImage, setSelectedImage }) {
    const uuid = useContext(UuidContext);

    useEffect(() => {
        setSelectedCrop(null);
        setSelectedImage(null);
    }, [setSelectedCrop, setSelectedImage]);

    const navigate = useNavigate();

    const handleDiagnosis = async () => {
        if (!selectedCrop || !selectedImage) {
            alert('모든 필드를 채워주세요.');
            return;
        }

        const formData = new FormData();
        formData.append('crop_category', selectedCrop); // crop_category에 작물 종류 추가
        formData.append('picture', selectedImage); // picture에 이미지 파일 추가

        try {
            const response = await axios.post('https://api.murok.munwon.net/diagnosis/request/', formData, {
                headers: {
                    'X-Request-Id': uuidv4(), // 첫 번째 UUID 생성
                    'X-Request-User-Id': uuid,
                }
            });
            const data = response.data;
            console.log(response.data);
            console.log("Verified successfully!");
            navigate("/diagnosis-result", { state: { data, selectedImage } });
        } catch (error) {
            console.error('Error:', error);
            // 에러 처리 로직
            if (!error.response) {
                // 서버에 응답이 없을 경우 (서버가 닫혀 있거나 네트워크 오류 등)
                alert('서버에 연결할 수 없습니다. 네트워크 상태를 확인하거나 나중에 다시 시도해주세요.');
            } else if (error.response.status === 413) {
                // 파일이 너무 큰 경우 (413 Payload Too Large)
                alert('파일이 너무 큽니다. 작은 파일로 시도해주세요.');
            } else {
                // 그 외 다른 오류
                alert('오류가 발생했습니다. 나중에 다시 시도해주세요.');
            }
        }
    };

    return (
        <div className="diagnosis-page">
            <div className="image-upload-container">
                <CropSelection selectedCrop={selectedCrop} setSelectedCrop={setSelectedCrop} />
                <ImageUpload setSelectedImage={setSelectedImage} />
                <button className="diagnose-button" onClick={handleDiagnosis}>진단</button>
            </div>
        </div>
    );
}

export default DiagnosisPage;

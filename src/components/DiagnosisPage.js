import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import CropSelection from './CropSelection';
import ImageUpload from './ImageUpload';
import axios from 'axios';
import { v4 as uuidv4 } from 'uuid'; // UUID 생성을 위한 라이브러리 임포트
import './DiagnosisPage.css';

function DiagnosisPage({ selectedCrop, setSelectedCrop, selectedImage, setSelectedImage }) {
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
                    'X-Request-User-Id': uuidv4(), // 두 번째 UUID 생성
                }
            });
            const data = response.data;
            console.log("Verified successfully!");
            navigate("/diagnosis-result", { state: { data } });
        } catch (error) {
            console.error('Error:', error);
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

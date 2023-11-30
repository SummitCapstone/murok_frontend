import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import CropSelection from './CropSelection';
import ImageUpload from './ImageUpload';
import axios from 'axios';
import './DiagnosisPage.css';

function DiagnosisPage({ selectedCrop, setSelectedCrop, selectedImage, setSelectedImage }) {
    // 컴포넌트 마운트 시 선택된 작물과 이미지 초기화
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

        // navigate("/diagnosis-result");

        const formData = new FormData();
        formData.append('crop', selectedCrop);
        formData.append('image', selectedImage);

        try {
            const response = await axios.post('https://api.murok.munwon.net/diagnosis', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            });
            const data = response.data;
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

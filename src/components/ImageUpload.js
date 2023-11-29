import React, { useState } from 'react';
import './ImageUpload.css';

function ImageUpload({ setSelectedImage }) {
  const [previewUrl, setPreviewUrl] = useState(null);
  const [fileName, setFileName] = useState('');
  const [imageSize, setImageSize] = useState(100); // 이미지 크기 상태

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedImage(file);
      setFileName(file.name); // 파일 이름 저장
      setPreviewUrl(URL.createObjectURL(file)); // 미리보기 URL 생성
    }
  };

  const handleSizeChange = (e) => {
    setImageSize(e.target.value); // 이미지 크기 변경
  };

  return (
    <div className="image-upload-container">
      <h2>진단할 작물의 이미지를 추가해주세요.</h2>
      <div className="separator"></div>
      <label className="image-upload-box">
        {previewUrl ? (
          <img src={previewUrl} alt="Preview" style={{ width: `${imageSize}%` }} />
        ) : (
          <>
            +<br />
            이미지 첨부
          </>
        )}
        <input type="file" accept="image/*" hidden onChange={handleImageChange} />
      </label>
      {fileName && <div className="file-name">{fileName}</div>}
      {previewUrl && (
        <div className="image-size-slider">
          <input type="range" min="10" max="100" value={imageSize} onChange={handleSizeChange} />
        </div>
      )}
    </div>
  );
}

export default ImageUpload;

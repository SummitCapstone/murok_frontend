import React from 'react';
import './CropSelection.css';

import strawberryIcon from '../assets/strawberry-icon.png';
import pepperIcon from '../assets/pepper-icon.png';
import tomatoIcon from '../assets/tomato-icon.png';
import cucumberIcon from '../assets/cucumber-icon.png';


function CropSelection({ selectedCrop, setSelectedCrop }) {

  const getBoxClass = (crop) => {
    return `crop-box ${cropEnglishNames[crop]} ${selectedCrop === cropEnglishNames[crop] ? 'active' : ''}`;
  };

  const cropEnglishNames = {
    딸기: 'STRAWBERRY',
    고추: 'PEPPER',
    토마토: 'TOMATO',
    오이: 'CUCUMBER'
  };

  const cropColors = {
    딸기: '#FF6384',
    고추: '#FF5722',
    토마토: '#FF6347',
    오이: '#4CAF50'
  };

  const cropIcons = {
    딸기: strawberryIcon,
    고추: pepperIcon,
    토마토: tomatoIcon,
    오이: cucumberIcon
  };

  return (
    <div className="crop-selection-container">
      <h2>진단할 작물을 선택해주세요.</h2>
      <div className="separator"></div>
      <div className="crops">
        {Object.keys(cropColors).map((crop) => (
          <div
            key={crop}
            className={getBoxClass(crop)}
            onClick={() => setSelectedCrop(cropEnglishNames[crop])}
            style={{ borderColor: selectedCrop === cropEnglishNames[crop] ? cropColors[crop] : 'initial' }}
          >
            <img src={cropIcons[crop]} alt={crop} className="crop-icon" />
            {crop}
          </div>
        ))}
      </div>
      {selectedCrop && (
        <h3 style={{ color: cropColors[Object.keys(cropEnglishNames).find(key => cropEnglishNames[key] === selectedCrop)] }}>선택한 작물: {Object.keys(cropEnglishNames).find(key => cropEnglishNames[key] === selectedCrop)}</h3>
      )}
    </div>
  );
}

export default CropSelection;

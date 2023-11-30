import React, { createContext, useState, useEffect } from 'react';
import { v4 as uuidv4 } from 'uuid';

export const UuidContext = createContext(null);

export const UuidProvider = ({ children }) => {
    const [uuid, setUuid] = useState('');

    useEffect(() => {
        // 로컬 스토리지에서 UUID를 불러옵니다.
        let storedUuid = localStorage.getItem('userUuid');
        if (!storedUuid) {
            // 로컬 스토리지에 UUID가 없다면 새로 생성하고 저장합니다.
            storedUuid = uuidv4();
            localStorage.setItem('userUuid', storedUuid);
        }
        setUuid(storedUuid);
    }, []); // 빈 의존성 배열은 이 코드가 컴포넌트 마운트 시 한 번만 실행됨을 의미

    return (
        <UuidContext.Provider value={uuid}>
            {children}
        </UuidContext.Provider>
    );
};


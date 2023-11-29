import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from './AuthContext';

function AuthLinks() {
  const { currentUser, logout } = useAuth();

  return (
    <>
      {currentUser ? (
        <button onClick={logout}>로그아웃</button>
      ) : (
        <Link to="/login" className="menu-item">로그인</Link>
      )}
    </>
  );
}

export default AuthLinks;

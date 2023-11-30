import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from './AuthContext';
import './AuthLinks.css';

function AuthLinks() {
  const { currentUser, logout } = useAuth();

  return (
    <>
      {currentUser ? (
        <button onClick={logout} className="menu-item">로그아웃</button>
      ) : (
        <Link to="/login" className="menu-item">로그인</Link>
      )}
    </>
  );
}

export default AuthLinks;

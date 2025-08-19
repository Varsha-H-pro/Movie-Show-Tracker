import React, { useState } from 'react';
import LoginForm from '../components/Auth/LoginForm';
import SignupForm from '../components/Auth/SignupForm';

const AuthPage = () => {
  const [isLogin, setIsLogin] = useState(true);

  const toggleForm = () => {
    setIsLogin(!isLogin);
  };

  return (
    <>
      {isLogin ? (
        <LoginForm onToggleForm={toggleForm} />
      ) : (
        <SignupForm onToggleForm={toggleForm} />
      )}
    </>
  );
};

export default AuthPage;
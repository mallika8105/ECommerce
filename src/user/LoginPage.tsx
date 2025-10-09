import React from 'react';
import AuthForm from './components/AuthForm'; // Assuming AuthForm will be created
import './LoginPage.css'; // Assuming LoginPage.css will be created

const LoginPage: React.FC = () => {
  return (
    <div className="login-page-container">
      <h1>Login / Sign Up</h1>
      <AuthForm />
    </div>
  );
};

export default LoginPage;

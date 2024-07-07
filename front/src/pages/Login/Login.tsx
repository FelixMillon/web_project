import React, { useState } from 'react';
import { useMutation, gql } from '@apollo/client';
import './Login.css';

const LOGIN_MUTATION = gql`
  mutation Login($email: String!, $password: String!) {
    login(email: $email, password: $password) {
      access_token
    }
  }
`;

const Login: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [login, { data, loading, error }] = useMutation(LOGIN_MUTATION);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await login({ variables: { email, password } });
      const token = response.data.login.access_token;
      localStorage.setItem('token', token);
      alert('Login successful');
    } catch (err) {
      console.error(err);
      alert('Login failed');
    }
  };

  return (
    <div className="login-container">
      <h2>Login</h2>
      <form onSubmit={handleSubmit} className="login-form">
        <div className="form-group">
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Email"
            required
          />
        </div>
        <div className="form-group">
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Password"
            required
          />
        </div>
        <button type="submit" disabled={loading} className="login-button">Login</button>
      </form>
      {loading && <p>Loading...</p>}
      {error && <p>Error: {error.message}</p>}
      {data && (
        <div className="success-container">
          <p>Success: <span className="token">{data.login.access_token}</span></p>
        </div>
      )}
    </div>
  );
};

export default Login;

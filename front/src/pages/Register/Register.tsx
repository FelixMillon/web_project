import React, { useState } from 'react';
import { gql, useMutation } from '@apollo/client';
import './Register.css';

const CREATE_USER = gql`
  mutation CreateUser($email: String!, $pseudo: String!, $name: String!, $password: String!) {
    createUser(email: $email, pseudo: $pseudo, name: $name, password: $password) {
      id
      email
      pseudo
      name
    }
  }
`;

const Register: React.FC = () => {
  const [email, setEmail] = useState('');
  const [pseudo, setPseudo] = useState('');
  const [name, setName] = useState('');
  const [password, setPassword] = useState('');
  const [createUser, { data, loading, error }] = useMutation(CREATE_USER);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await createUser({ variables: { email, pseudo, name, password } });
      alert('User created successfully');
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <div className="register-container">
      <h2>Register</h2>
      <form onSubmit={handleSubmit} className="register-form">
        <div className="form-group">
          <label>Email:</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>
        <div className="form-group">
          <label>Pseudo:</label>
          <input
            type="text"
            value={pseudo}
            onChange={(e) => setPseudo(e.target.value)}
          />
        </div>
        <div className="form-group">
          <label>Name:</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </div>
        <div className="form-group">
          <label>Password:</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>
        <button type="submit" className="register-button">Register</button>
      </form>
      {loading && <p>Loading...</p>}
      {error && <p>Error: {error.message}</p>}
    </div>
  );
};

export default Register;

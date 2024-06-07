import React, { useState } from 'react';
import { useMutation } from '@apollo/client';
import { gql } from 'graphql-tag';

const SIGNUP_MUTATION = gql`
  mutation Signup($email: String!, $pseudo: String!, $name: String!, $password: String!) {
    createUser(email: $email, pseudo: $pseudo, name: $name, password: $password) {
      id
      email
    }
  }
`;

const Signup: React.FC = () => {
  const [email, setEmail] = useState('');
  const [pseudo, setPseudo] = useState('');
  const [name, setName] = useState('');
  const [password, setPassword] = useState('');
  const [signup, { data, loading, error }] = useMutation(SIGNUP_MUTATION);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await signup({ variables: { email, pseudo, name, password } });
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div>
      <h2>Signup</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Email</label>
          <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
        </div>
        <div>
          <label>Pseudo</label>
          <input type="text" value={pseudo} onChange={(e) => setPseudo(e.target.value)} />
        </div>
        <div>
          <label>Name</label>
          <input type="text" value={name} onChange={(e) => setName(e.target.value)} />
        </div>
        <div>
          <label>Password</label>
          <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
        </div>
        <button type="submit" disabled={loading}>Signup</button>
      </form>
      {data && <p>Signup successful!</p>}
      {error && <p>Error signing up</p>}
    </div>
  );
};

export default Signup;

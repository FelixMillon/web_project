import React, { useEffect, useState } from 'react';
import { gql, useQuery } from '@apollo/client';

const GET_CONVERSATIONS = gql`
  query GetAllConversations($token: String!) {
    getAllConversations(token: $token) {
      id
      name
      users {
        id
        name
      }
    }
  }
`;

const Conversations: React.FC = () => {
  const [token, setToken] = useState<string | null>(null);

  useEffect(() => {
    const storedToken = localStorage.getItem('token');
    setToken(storedToken);
  }, []);

  const { data, loading, error } = useQuery(GET_CONVERSATIONS, {
    variables: { token },
    skip: !token,
  });

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error.message}</p>;

  return (
    <div>
      <h1>Conversations</h1>
      <ul>
        {data?.getAllConversations.map((conversation: any) => (
          <li key={conversation.id}>
            <h2>{conversation.name}</h2>
            <p>Users: {conversation.users.map((user: any) => user.name).join(', ')}</p>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Conversations;

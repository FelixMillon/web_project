import React, { useState } from 'react';
import { gql, useQuery, useMutation } from '@apollo/client';
import { useNavigate } from 'react-router-dom';
import './Conversations.css';

const GET_CONVERSATIONS = gql`
  query GetAllConversations($token: String!) {
    getAllConversations(token: $token) {
      id
      name
    }
  }
`;

const CREATE_CONVERSATION = gql`
  mutation CreateConversation($token: String!, $name: String!) {
    createConversation(token: $token, ownersId: [], name: $name) {
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
  const [inputToken, setInputToken] = useState<string>('');
  const [newConversationName, setNewConversationName] = useState<string>('');
  const navigate = useNavigate();

  const { data, loading, error } = useQuery(GET_CONVERSATIONS, {
    variables: { token },
    skip: !token,
    onError: (err) => {
      console.error('GET_CONVERSATIONS error:', err);
    },
  });

  const [createConversation] = useMutation(CREATE_CONVERSATION, {
    onError: (err) => {
      console.error('CREATE_CONVERSATION error:', err);
    },
    onCompleted: (data) => {
      console.log('Conversation created:', data);
    },
  });

  const handleTokenSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setToken(inputToken);
  };

  const handleCreateConversation = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newConversationName.trim()) return;
    try {
      await createConversation({
        variables: {
          token,
          name: newConversationName,
        },
      });
      setNewConversationName('');
    } catch (err) {
      console.error(err);
    }
  };

  const handleConversationClick = (conversationId: string) => {
    navigate(`/conversations/${conversationId}`);
  };

  if (!token) {
    return (
      <div className="token-input-container">
        <form onSubmit={handleTokenSubmit} className="token-form">
          <input
            type="text"
            value={inputToken}
            onChange={(e) => setInputToken(e.target.value)}
            placeholder="Enter your token"
            required
          />
          <button type="submit">Submit</button>
        </form>
      </div>
    );
  }

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error.message}</p>;

  return (
    <div className="conversations-container">
      <h1>Conversations</h1>
      <ul className="conversations-list">
        {data?.getAllConversations.map((conversation: any) => (
          <li
            key={conversation.id}
            className="conversation-item"
            onClick={() => handleConversationClick(conversation.id)}
          >
            <h2 className="conversation-name">{conversation.name}</h2>
          </li>
        ))}
      </ul>
      <div className="create-conversation-container">
        <form onSubmit={handleCreateConversation} className="create-conversation-form">
          <input
            type="text"
            value={newConversationName}
            onChange={(e) => setNewConversationName(e.target.value)}
            placeholder="Enter conversation name"
            required
          />
          <button type="submit">Create Conversation</button>
        </form>
      </div>
    </div>
  );
};

export default Conversations;

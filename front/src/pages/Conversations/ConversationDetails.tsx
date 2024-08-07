import React, { useState, useEffect } from 'react';
import { gql, useQuery, useMutation } from '@apollo/client';
import { useParams, useNavigate } from 'react-router-dom';
import './ConversationDetails.css';

const GET_MESSAGES_BY_CONVERSATION = gql`
  query getMessageByConversation($conversationId: String!) {
    getMessageByConversation(conversationId: $conversationId) {
      id
      content
      author {
        id
        name
      }
      timestamp
    }
  }
`;

const SEND_MESSAGE = gql`
  mutation SendMessage($token: String!, $conversationId: String!, $content: String!) {
    publishMessage(token: $token, conversationId: $conversationId, content: $content, eventType: "text") {
      id
      content
      author {
        id
        name
      }
      timestamp
    }
  }
`;

const INVITE_USER = gql`
  mutation invitesByEmail($token: String!, $conversationId: String!, $userEmail: String!) {
    invitesByEmail(token: $token, id: $conversationId, userEmail: $userEmail) {
      id
      users {
        id
        name
      }
    }
  }
`;

const DELETE_MESSAGE = gql`
  mutation DeleteMessage($token: String!, $id: String!) {
    deleteMessageById(token: $token, id: $id)
  }
`;

const ConversationDetails: React.FC = () => {
  const { conversationId } = useParams<{ conversationId: string }>();
  const navigate = useNavigate();
  const [token] = useState<string | null>(localStorage.getItem('token'));
  const [messageContent, setMessageContent] = useState<string>('');
  const [inviteUserEmail, setInviteUserEmail] = useState<string>('');

  useEffect(() => {
    if (!token) {
      console.error('Token not found');
      navigate('/');
    }
  }, [token, navigate]);

  const { data, loading, error, refetch } = useQuery(GET_MESSAGES_BY_CONVERSATION, {
    variables: { conversationId },
    skip: !conversationId,
  });

  useEffect(() => {
    const interval = setInterval(() => {
      refetch();
    }, 5000);
    return () => clearInterval(interval);
  }, [refetch]);

  const [sendMessage] = useMutation(SEND_MESSAGE, {
    onCompleted: () => {
      refetch();
    },
    onError: (err) => {
      console.error('SEND_MESSAGE error:', err);
    },
  });

  const [inviteUser] = useMutation(INVITE_USER, {
    onError: (err) => {
      console.error('INVITE_USER error:', err);
    },
    onCompleted: (data) => {
      console.log('User invited:', data);
    },
  });

  const [deleteMessage] = useMutation(DELETE_MESSAGE, {
    onCompleted: () => {
      refetch();
    },
    onError: (err) => {
      console.error('DELETE_MESSAGE error:', err);
    },
  });

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!conversationId || !messageContent.trim()) return;
    try {
      await sendMessage({
        variables: {
          token,
          conversationId,
          content: messageContent,
        },
      });
      setMessageContent('');
    } catch (err) {
      console.error(err);
    }
  };

  const handleInviteUser = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!conversationId || !inviteUserEmail.trim()) return;
    try {
      await inviteUser({
        variables: {
          token,
          conversationId,
          userEmail: inviteUserEmail,
        },
      });
      setInviteUserEmail('');
    } catch (err) {
      console.error(err);
    }
  };

  const handleDeleteMessage = async (messageId: string) => {
    try {
      await deleteMessage({
        variables: {
          token,
          id: messageId,
        },
      });
    } catch (err) {
      console.error(err);
    }
  };

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error.message}</p>;
  const messages = data?.getMessageByConversation || [];
  const userId = token ? JSON.parse(atob(token.split('.')[1])).id : null;

  return (
    <div className="conversation-details-container">
      <h1>Conversation Details</h1>
      <h3>Messages:</h3>
      <ul className="message-list">
        {messages.map((message: any) => (
          <li key={message.id} className={`message-item ${message.author.id === userId ? 'right' : 'left'}`}>
            <strong>{message.author.name}: </strong>
            {message.content}
            {message.author.id === userId && (
              <button className="delete-button" onClick={() => handleDeleteMessage(message.id)}>Delete</button>
            )}
          </li>
        ))}
      </ul>
      <form onSubmit={handleSendMessage} className="send-message-form">
        <input
          type="text"
          value={messageContent}
          onChange={(e) => setMessageContent(e.target.value)}
          placeholder="Type a message"
          required
        />
        <button type="submit">Send</button>
      </form>
      <form onSubmit={handleInviteUser} className="invite-user-form">
        <input
          type="text"
          value={inviteUserEmail}
          onChange={(e) => setInviteUserEmail(e.target.value)}
          placeholder="Enter user email to invite"
          required
        />
        <button type="submit">Invite User</button>
      </form>
    </div>
  );
};

export default ConversationDetails;

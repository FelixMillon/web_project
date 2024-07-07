import React, { useState, useEffect } from 'react';
import { gql, useQuery, useMutation } from '@apollo/client';
import { useParams } from 'react-router-dom';
import './ConversationDetails.css';

// Requête pour récupérer les messages par auteur
const GET_MESSAGES_BY_AUTHOR = gql`
  query GetMessageByAuthor($token: String!) {
    getMessageByAuthor(token: $token) {
      id
      content
      author {
        id
        name
      }
      conversation {
        id
        name
      }
      timestamp
    }
  }
`;

// Mutation pour envoyer un message
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


// Mutation pour inviter un utilisateur
const INVITE_USER = gql`
  mutation InviteUser($token: String!, $conversationId: String!, $userId: String!) {
    invitesTo(token: $token, id: $conversationId, userId: $userId) {
      id
      users {
        id
        name
      }
    }
  }
`;

const ConversationDetails: React.FC = () => {
  const { conversationId } = useParams<{ conversationId: string }>();
  const [token, setToken] = useState<string | null>(localStorage.getItem('token'));
  const [messageContent, setMessageContent] = useState<string>('');
  const [inviteUserId, setInviteUserId] = useState<string>('');

  useEffect(() => {
    if (!token) {
      console.error('Token not found');
    }
  }, [token]);

  const { data, loading, error, refetch } = useQuery(GET_MESSAGES_BY_AUTHOR, {
    variables: { token },
    skip: !token,
  });

  const [sendMessage] = useMutation(SEND_MESSAGE, {
    onCompleted: () => {
      refetch(); // Refresh the list of messages after sending a new message
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
    if (!conversationId || !inviteUserId.trim()) return;
    try {
      await inviteUser({
        variables: {
          token,
          conversationId,
          userId: inviteUserId,
        },
      });
      setInviteUserId('');
    } catch (err) {
      console.error(err);
    }
  };

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error.message}</p>;

  const filteredMessages = data?.getMessageByAuthor.filter(
    (message: any) => message.conversation.id === conversationId
  );

  // Récupérer le nom de la conversation depuis le premier message
  const conversationName = filteredMessages.length > 0 ? filteredMessages[0].conversation.name : 'Conversation';

  return (
    <div className="conversation-details-container">
      <h1>{conversationName}</h1>
      <h3>Messages:</h3>
      <ul>
        {filteredMessages.map((message: any) => (
          <li key={message.id}>
            <strong>{message.author.name}: </strong>
            {message.content} <em>({new Date(message.timestamp).toLocaleString()})</em>
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
          value={inviteUserId}
          onChange={(e) => setInviteUserId(e.target.value)}
          placeholder="Enter user ID to invite"
          required
        />
        <button type="submit">Invite User</button>
      </form>
    </div>
  );
};

export default ConversationDetails;

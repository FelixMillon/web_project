import React, { useEffect, useState } from 'react';
import io from 'socket.io-client';
import { SendedMessage } from '../../types';

const socket = io('http://localhost:3000');

const Messages = () => {
  const [messages, setMessages] = useState<SendedMessage[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchMessages = () => {
      socket.emit('requestMessages');
    };

    // Fonction pour mettre à jour les messages
    const updateMessages = (newMessages: SendedMessage[]) => {
      setMessages(newMessages);
    };

    // Demander les messages au chargement du composant
    fetchMessages();

    // Écouter les nouveaux messages
    socket.on('messages', updateMessages);

    // Gérer les erreurs de connexion
    socket.on('connect_error', () => {
      setError('Connection error');
    });

    const interval = setInterval(fetchMessages, 1000);

    // Nettoyer les écouteurs et l'intervalle lors du démontage du composant
    return () => {
      clearInterval(interval);
      socket.off('messages', updateMessages);
      socket.off('connect_error');
    };
  }, []);

  return (
    <div>
      <h1>Messages</h1>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      <ul>
        {messages.length > 0 ? (
          messages
            .filter((message) => message && message.content) // Filtrer les messages qui ne sont pas null et qui ont `content`
            .map((message, index) => (
              <li key={index}>{message.content}</li>
            ))
        ) : (
          <li>No messages available</li>
        )}
      </ul>
    </div>
  );
};

export default Messages;

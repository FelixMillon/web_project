export type User = {
    id: string;
    email: string;
    pseudo: string;
    name: string;
    password: string;
    conversations: Conversation[];
};

export type Conversation = {
    id: string;
    name: string;
    users: User[];
    owners: User[];
    timestamp: string;
};

export type Message = {
    id: string;
    conversation: Conversation;
    eventType: string;
    timestamp: string;
    author: User;
    content: string;
};

export type SendedMessage = {
    conversationId: string;
    eventType: string;
    authorId: string;
    content: string;
};
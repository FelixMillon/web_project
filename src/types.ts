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
    timestamp: number;
};

export type Message = {
    id: string;
    conversation: Conversation;
    eventType: string;
    timestamp: number;
    author: User;
    content: string;
};
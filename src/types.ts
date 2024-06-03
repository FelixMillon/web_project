export type User = {
    id: number;
    email: string;
    pseudo: string;
    name: string;
    password: string;
    conversations: Conversation[];
};

export type Conversation = {
    id: number;
    name: string;
    users: User[];
    owners: User[];
    timestamp: Date;
};

export type Message = {
    id: string;
    conversation: Conversation;
    eventType: string;
    timestamp: Date;
    author: User;
    content: string;
};
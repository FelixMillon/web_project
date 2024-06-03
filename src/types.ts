export type User = {
    id: number;
    email: string;
    pseudo: string;
    name: string;
    password: string;
};

export type Conversation = {
    id: number;
    name: string;
    users: User[];
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
import React, { useRef, useEffect } from 'react';
import ChatBubble from './ChatBubble';
import { Card, CardContent } from '@/components/ui/card';

interface Message {
  id: string;
  text: string;
  sender: 'user' | 'agent';
}

interface ChatWindowProps {
  messages: Message[];
}

const ChatWindow: React.FC<ChatWindowProps> = ({ messages }) => {
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  return (
    <Card className="flex-1 flex flex-col overflow-hidden">
      <CardContent className="flex-1 p-4 overflow-y-auto space-y-4">
        {messages.map((message) => (
          <ChatBubble key={message.id} message={message} />
        ))}
        <div ref={messagesEndRef} />
      </CardContent>
    </Card>
  );
};

export default ChatWindow;
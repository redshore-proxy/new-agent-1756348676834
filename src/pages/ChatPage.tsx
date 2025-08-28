import React, { useState } from 'react';
import { v4 as uuidv4 } from 'uuid';
import ChatWindow from '@/components/ChatWindow';
import ChatInput from '@/components/ChatInput';
import { CardHeader, CardTitle, CardDescription } from '@/components/ui/card';

interface Message {  id: string;
  text: string;
  sender: 'user' | 'agent';
}

const ChatPage: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isAgentTyping, setIsAgentTyping] = useState(false);

  const handleSendMessage = (text: string) => {
    const newUserMessage: Message = {
      id: uuidv4(),
      text,
      sender: 'user',
    };
    setMessages((prevMessages) => [...prevMessages, newUserMessage]);
    setIsAgentTyping(true);

    // Simulate agent response
    setTimeout(() => {
      const agentResponse: Message = {
        id: uuidv4(),
        text: `You said: "${text}". I am an agent and I'm still learning!`,
        sender: 'agent',
      };
      setMessages((prevMessages) => [...prevMessages, agentResponse]);
      setIsAgentTyping(false);
    }, 1500);
  };

  return (
    <div className="flex flex-col h-screen max-h-screen bg-background">
      <CardHeader >
        <CardTitle>AI Chat Agent</CardTitle>
        <CardDescription>
          {isAgentTyping ? 'Agent is typing...' : 'Ready to chat!'}
        </CardDescription>
      </CardHeader>
      < ChatWindow messages = { messages } />
      <ChatInput onSendMessage={ handleSendMessage } disabled = { isAgentTyping } />
    </div>
  );
};

export default ChatPage;
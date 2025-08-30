import React, { useState, useEffect, useMemo } from 'react';
import { v4 as uuidv4 } from 'uuid';
import ChatWindow from '@/components/ChatWindow';
import ChatInput from '@/components/ChatInput';
import { CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { GoogleGenerativeAI } from '@google/generative-ai'; // Import Gemini SDK

interface Message {
  id: string;
  text: string;  sender: 'user' | 'agent';
}

const ChatPage: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isAgentTyping, setIsAgentTyping] = useState(false);

  // Access API key and initialize Gemini model using useMemo
  const { genAI, model, apiKeyError } = useMemo(() => {
    const API_KEY = import.meta.env.VITE_GEMINI_API_KEY;
    if (!API_KEY) {
      console.error("VITE_GEMINI_API_KEY is not set. Please check your .env file and restart the app.");
      return { genAI: null, model: null, apiKeyError: true };
    }
    const genAIInstance = new GoogleGenerativeAI(API_KEY);// Ensure model is set to "gemini-1.5-flash"
    const modelName = "gemini-1.5-flash";
    const modelInstance = genAIInstance.getGenerativeModel({ model: modelName });
    console.log(`Gemini model initialized: ${modelName}`); // Log the model name for verification
    return { genAI: genAIInstance, model: modelInstance, apiKeyError: false };}, []); // Empty dependency array means it only runs once

  useEffect(() => {
    // Add an initial welcome message from the agent
    if (messages.length === 0) {
      if (apiKeyError) {
        setMessages([
          {
            id: uuidv4(),
            text: "Error: Gemini API Key is not set. Please set VITE_GEMINI_API_KEY in your .env file and rebuild/restart the app.",
            sender: 'agent',
          },
        ]);
      } else {
        setMessages([
          {
            id: uuidv4(),
            text: "Hello! I'm your AI chat agent. How can I help you today?",
            sender: 'agent',
          },
        ]);
      }
    }
  }, [apiKeyError, messages.length]);

  const handleSendMessage = async (text: string) => {
    if (apiKeyError || !model) {
      const errorMessage: Message = {
        id: uuidv4(),
        text: "Cannot send message: Gemini API is not initialized due to missing API Key.",
        sender: 'agent',
      };
      setMessages((prevMessages) => [...prevMessages, errorMessage]);
      return;
    }

    const newUserMessage: Message = {
      id: uuidv4(),
      text,
      sender: 'user',
    };
    setMessages((prevMessages) => [...prevMessages, newUserMessage]);
    setIsAgentTyping(true);

    try {
      const result = await model.generateContent(text);
      const response = await result.response;
      const agentText = response.text();

      const newAgentMessage: Message = {        id: uuidv4(),
        text: agentText,
        sender: 'agent',
      };
      setMessages((prevMessages) => [...prevMessages, newAgentMessage]);
    } catch (error) {
      console.error("Error calling Gemini API:", error);
      let errorMessageText = "Oops! Something went wrong with the AI. Please try again.";
      if (error instanceof Error) {
        errorMessageText += ` Error: ${error.message}`;
      }
      const errorMessage: Message = {
        id: uuidv4(),
        text: errorMessageText,
        sender: 'agent',
      };
      setMessages((prevMessages) => [...prevMessages, errorMessage]);
    } finally {
      setIsAgentTyping(false);
    }
  };

  return (
    <div className="flex flex-col h-screen max-h-screen bg-background">
      <CardHeader className="border-b">
        <CardTitle>AI Chat Agent</CardTitle>
        <CardDescription>
          {apiKeyError ? 'API Key Missing!' : (isAgentTyping ? 'Agent is typing...' : 'Ready to chat!')}
        </CardDescription>
      </CardHeader>
      <ChatWindow messages={messages} />
      <ChatInput onSendMessage={handleSendMessage} disabled={isAgentTyping || apiKeyError} />
    </div>
  );
};

export default ChatPage;
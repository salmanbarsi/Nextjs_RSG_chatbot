"use client";

import { useChat } from "@ai-sdk/react";
import { useState, useRef, useEffect } from 'react';
import Header from '../component/Header';
import Inputarea from '../component/Inputarea';
import { Reasoning, ReasoningContent, ReasoningTrigger } from "@/components/ai-elements/reasoning";
import Codeblock from "../component/Codeblock";

interface Message {
  id: number;
  text: string;
  isUser: boolean;
  timestamp: Date;
}

export default function ChatPage() {
  const { messages, sendMessage, status, error, stop, } = useChat();
  const [msg, setMessages] = useState<Message[]>([]);
  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(true);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [showError, setShowError] = useState(false);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    setMessages(messages.map((m:any) => ({
      id: m.id,
      text: m.parts.map((part:any) => part.text).join(''),
      isUser: m.role === 'user',
      timestamp: new Date(m.createdAt || Date.now()),
    })));
  }, [messages]);

  useEffect(() => {
  if (error) {
    setShowError(true);

    const timer = setTimeout(() => {
      setShowError(false);
    }, 7000);

    return () => clearTimeout(timer);
  }
}, [error]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = () => {
    setIsLoading(status === "submitted" || status === "streaming");
    sendMessage({ text: inputMessage });
    setInputMessage("");
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  const handleClearChat = () => {
    stop();
    setMessages([]);
  };

  return (
    <div className={`flex flex-col h-screen transition-colors duration-300 ${isDarkMode ? 'bg-gray-900' : 'bg-linear-to-br from-blue-50 via-purple-50 to-pink-50'}`}>
      {/* Header */}
      <Header isDarkMode={isDarkMode} setIsDarkMode={setIsDarkMode} handleClearChat={handleClearChat} />

      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto px-4 py-6 space-y-6 w-full items-center mx-auto">

        {showError && (
        <div className="fixed top-25 right-50 z-50 fade-in-out bg-red-500/20 text-red-500 px-4 py-3 rounded shadow-lg">
            <div className="flex items-center space-x-3">
            <span>{error?.message}</span>
            </div>
        </div>
        )}

        {msg.map((message) => (
          <div key={message.id} className={`flex items-start space-x-3 animate-fade-in ${message.isUser ? 'flex-row-reverse space-x-reverse' : ''}`}>
            {/* Avatar */}
            <div className={`shrink-0 w-10 h-10 rounded-full flex items-center justify-center text-xs font-semibold shadow-md transition-transform hover:scale-110 ${message.isUser ? 'bg-linear-to-r from-blue-500 to-blue-600 text-white' : 'bg-linear-to-r from-purple-500 to-pink-500 text-white' }`}>
              {message.isUser ? '👤' : '🤖'}
            </div>

            {/* Message Content */}
            <div className={`max-w-[80%] ${ message.isUser ? 'text-right' : ''}`}>
              <div className={`inline-block px-5 py-3 rounded-2xl shadow-md transition-all hover:shadow-lg ${message.isUser ? 'bg-linear-to-r from-blue-500 to-blue-600 text-white rounded-br-none' : isDarkMode ? 'bg-gray-800 border border-gray-700 text-gray-100 rounded-bl-none' : 'bg-white border border-gray-200 text-gray-800 rounded-bl-none'}`}>
                   <Codeblock text={message.text} isDarkMode={isDarkMode} />
              </div>
              <div className={`text-xs mt-1.5 ${isDarkMode ? 'text-gray-500' : 'text-gray-500'} ${message.isUser ? 'text-right' : ''}`}>
                {formatTime(message.timestamp)}
              </div>
            </div>
          </div>
        ))}
        
        {/* Loading Indicator */}
        {(status === "submitted" ) && (
          <div className="flex items-start space-x-3 animate-fade-in">
            <div className="shrink-0 w-10 h-10 rounded-full bg-linear-to-r from-purple-500 to-pink-500 flex items-center justify-center text-xs font-semibold text-white shadow-md">
              🤖
            </div>
            <div className={`rounded-2xl rounded-bl-none px-5 py-4 shadow-md ${isDarkMode ? 'bg-gray-800 border border-gray-700' : 'bg-white border border-gray-200'}`}>
              <div className="flex space-x-1.5">
                <div className={`w-2.5 h-2.5 rounded-full animate-bounce ${isDarkMode ? 'bg-gray-500' : 'bg-gray-400'}`}></div>
                <div className={`w-2.5 h-2.5 rounded-full animate-bounce ${isDarkMode ? 'bg-gray-500' : 'bg-gray-400'}`} style={{ animationDelay: '0.1s' }}></div>
                <div className={`w-2.5 h-2.5 rounded-full animate-bounce ${isDarkMode ? 'bg-gray-500' : 'bg-gray-400'}`} style={{ animationDelay: '0.2s' }}></div>
              </div>
            </div>
          </div>
        )}

        {msg.length === 0 && (
            <div className="flex flex-col items-center justify-center h-[60vh] px-4">
                <div className="relative mb-8">
                    <div className={`w-24 h-24 rounded-2xl flex items-center justify-center shadow-2xl ${isDarkMode ? 'bg-linear-to-br from-blue-600 to-purple-700 shadow-blue-500/20' : 'bg-linear-to-br from-blue-500 to-purple-600 shadow-blue-500/30'}`}>
                        <div className="text-3xl">🤖</div>
                    </div>
                    <div className={`absolute inset-0 rounded-2xl ${isDarkMode ? 'bg-blue-500/20' : 'bg-blue-400/20'} animate-ping`}></div>
                </div>

                <div className="text-center mb-12">
                    <h1 className={`text-4xl font-bold mb-4 bg-linear-to-r ${isDarkMode ? 'from-blue-400 to-purple-400' : 'from-blue-600 to-purple-600'} bg-clip-text text-transparent`}>Welcome to AI Assistant</h1>
                    <p className={`text-lg max-w-md mx-auto ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>Your intelligent companion for answers, ideas, and creative solutions</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto w-full mb-12">
                
                    <div className={`p-6 rounded-2xl border backdrop-blur-sm transition-all hover:scale-105 ${isDarkMode ? 'bg-gray-800/50 border-gray-700 hover:border-blue-500' : 'bg-white/50 border-gray-200 hover:border-blue-400'}`}>
                        <div className="text-2xl mb-3">💡</div>
                        <h3 className={`font-semibold mb-2 ${isDarkMode ? 'text-white' : 'text-gray-800'}`}>Brainstorm Ideas </h3>
                        <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>Get creative suggestions and innovative solutions for your projects</p>
                    </div>

                    <div className={`p-6 rounded-2xl border backdrop-blur-sm transition-all hover:scale-105 ${isDarkMode ? 'bg-gray-800/50 border-gray-700 hover:border-purple-500' : 'bg-white/50 border-gray-200 hover:border-purple-400'}`}>
                        <div className="text-2xl mb-3">📝</div>
                        <h3 className={`font-semibold mb-2 ${isDarkMode ? 'text-white' : 'text-gray-800'}`}>Write & Edit</h3>
                        <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>Craft compelling content, refine your writing, and improve your text</p>
                    </div>

                    <div className={`p-6 rounded-2xl border backdrop-blur-sm transition-all hover:scale-105 ${isDarkMode ? 'bg-gray-800/50 border-gray-700 hover:border-green-500' : 'bg-white/50 border-gray-200 hover:border-green-400'}`}>
                        <div className="text-2xl mb-3">🔍</div>
                        <h3 className={`font-semibold mb-2 ${isDarkMode ? 'text-white' : 'text-gray-800'}`}>Learn & Explore</h3>
                        <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>Get detailed explanations and explore complex topics with ease</p>
                    </div>
                </div>

                <div className="fixed top-1/4 left-1/4 opacity-10">
                    <div className={`w-8 h-8 rounded-full ${isDarkMode ? 'bg-blue-400' : 'bg-blue-500'} animate-bounce`}></div>
                </div>
                <div className="fixed bottom-1/3 right-1/4 opacity-10">
                    <div className={`w-6 h-6 rounded-full ${isDarkMode ? 'bg-purple-400' : 'bg-purple-500'} animate-bounce`} style={{ animationDelay: '0.5s' }}></div>
                </div>
            </div>
            )}  
        
        <div ref={messagesEndRef} />
      </div>

      {/* Quick Actions & Input Area */}
      <Inputarea isDarkMode={isDarkMode} setInputMessage={setInputMessage} inputMessage={inputMessage} isLoading={isLoading}
       handleKeyPress={handleKeyPress} handleSendMessage={handleSendMessage} status={status} stop={stop} />
    </div>
  );
}
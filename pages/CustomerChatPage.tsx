
import React, { useState, useEffect, useRef, useCallback } from 'react';
import { SendHorizontal, Bot, User, LogOut } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';
import { useChat } from '../hooks/useChat';
import { Customer } from '../types';
import { getBotResponse } from '../services/geminiService';

const MessageBubble: React.FC<{ message: { text: string; sender: string; timestamp: number } }> = ({ message }) => {
    const isUser = message.sender === 'customer';
    const alignClass = isUser ? 'items-end' : 'items-start';
    const bubbleClass = isUser ? 'bg-blue-600 text-white rounded-br-none' : 'bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 rounded-bl-none';
    const Icon = message.sender === 'bot' ? Bot : User;

    return (
        <div className={`flex flex-col ${alignClass} mb-4`}>
            <div className="flex items-end gap-2 max-w-xs md:max-w-md">
                 {!isUser && <div className="flex-shrink-0 w-8 h-8 bg-gray-300 dark:bg-gray-600 rounded-full flex items-center justify-center"><Icon size={18} /></div>}
                <div className={`px-4 py-3 rounded-2xl ${bubbleClass} `}>
                    <p className="text-sm">{message.text}</p>
                </div>
            </div>
            <span className={`text-xs text-gray-500 dark:text-gray-400 mt-1 ${isUser ? 'mr-2' : 'ml-10'}`}>
                {new Date(message.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
            </span>
        </div>
    );
};

const CustomerChatPage: React.FC = () => {
    const { currentUser, logout } = useAuth();
    const { tickets, createTicket, addMessage, updateTicketStatus } = useChat();
    const customer = currentUser as Customer;

    const [message, setMessage] = useState('');
    const [isBotTyping, setIsBotTyping] = useState(false);
    const messagesEndRef = useRef<HTMLDivElement>(null);

    const activeTicket = tickets.find(t => t.customerId === customer.id && t.status !== 'resolved') || createTicket(customer.id, customer.name);
    
    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    useEffect(() => {
        scrollToBottom();
    }, [activeTicket?.messages, isBotTyping]);
    
    const handleBotResponse = useCallback(async () => {
        if (!activeTicket) return;

        const conversationHistory = activeTicket.messages.filter(m => m.sender === 'customer' || m.sender === 'bot');
        if (conversationHistory.length === 0 || conversationHistory[conversationHistory.length -1].sender !== 'customer') {
            return;
        }

        setIsBotTyping(true);
        const botText = await getBotResponse(conversationHistory);
        setIsBotTyping(false);

        if (botText.includes('[end_conversation_and_escalate]')) {
            const cleanText = botText.replace('[end_conversation_and_escalate]', '').trim();
            addMessage(activeTicket.id, cleanText, 'bot');
            updateTicketStatus(activeTicket.id, 'escalated-to-human');
        } else {
            addMessage(activeTicket.id, botText, 'bot');
        }
    }, [activeTicket?.id, activeTicket?.messages.length]);
    
    useEffect(() => {
        if (activeTicket?.status === 'new' || activeTicket?.status === 'open') {
             if(activeTicket?.messages.length === 0) {
                setIsBotTyping(true);
                setTimeout(() => {
                    addMessage(activeTicket.id, `Hello ${customer.name}! I'm KruxBot. How can I help you with your loan today?`, 'bot');
                    updateTicketStatus(activeTicket.id, 'open');
                    setIsBotTyping(false);
                }, 1000);
            } else {
                handleBotResponse();
            }
        }
    }, [activeTicket?.status, activeTicket?.messages.length, handleBotResponse]);

    const handleSendMessage = (e: React.FormEvent) => {
        e.preventDefault();
        if (message.trim() && activeTicket && activeTicket.status !== 'resolved') {
            addMessage(activeTicket.id, message, 'customer');
            setMessage('');
        }
    };

    return (
        <div className="flex h-screen bg-gray-100 dark:bg-gray-900 justify-center">
            <div className="flex flex-col w-full max-w-2xl h-full bg-white dark:bg-gray-800 shadow-lg">
                <header className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700">
                    <div>
                        <h2 className="text-xl font-semibold text-gray-800 dark:text-white">KRUX Finance Support</h2>
                        <p className="text-sm text-gray-500 dark:text-gray-400">Chat with {activeTicket?.assignedAgentId ? 'an Agent' : 'KruxBot'}</p>
                    </div>
                    <button onClick={logout} className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-500 dark:text-gray-400">
                        <LogOut size={20} />
                    </button>
                </header>

                <main className="flex-1 p-4 overflow-y-auto">
                    {activeTicket?.messages.map(msg => <MessageBubble key={msg.id} message={msg} />)}
                    {isBotTyping && (
                        <div className="flex items-start mb-4">
                           <div className="flex items-end gap-2 max-w-xs md:max-w-md">
                                <div className="flex-shrink-0 w-8 h-8 bg-gray-300 dark:bg-gray-600 rounded-full flex items-center justify-center"><Bot size={18} /></div>
                                <div className="px-4 py-3 rounded-2xl bg-gray-200 dark:bg-gray-700 rounded-bl-none">
                                    <div className="flex items-center space-x-1">
                                        <div className="w-2 h-2 bg-gray-500 rounded-full animate-pulse"></div>
                                        <div className="w-2 h-2 bg-gray-500 rounded-full animate-pulse delay-150"></div>
                                        <div className="w-2 h-2 bg-gray-500 rounded-full animate-pulse delay-300"></div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}
                    <div ref={messagesEndRef} />
                </main>

                <footer className="p-4 bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700">
                    <form onSubmit={handleSendMessage} className="flex items-center space-x-2">
                        <input
                            type="text"
                            value={message}
                            onChange={(e) => setMessage(e.target.value)}
                            placeholder={activeTicket?.status === 'resolved' ? "This conversation is resolved." : "Type your message..."}
                            disabled={activeTicket?.status === 'resolved'}
                            className="flex-1 px-4 py-2 bg-gray-100 dark:bg-gray-700 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                        <button type="submit" disabled={!message.trim() || activeTicket?.status === 'resolved'} className="p-3 bg-blue-600 text-white rounded-full disabled:bg-gray-400 disabled:cursor-not-allowed hover:bg-blue-700 transition-colors">
                            <SendHorizontal size={20} />
                        </button>
                    </form>
                </footer>
            </div>
        </div>
    );
};

export default CustomerChatPage;

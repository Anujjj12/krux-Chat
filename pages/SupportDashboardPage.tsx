
import React, { useState, useEffect, useRef } from 'react';
import { LogOut, SendHorizontal, Info, Clock, User, MessageSquare, Briefcase, FileText, CheckCircle, ArrowRight, CornerDownLeft } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';
import { useChat } from '../hooks/useChat';
import { Ticket, Message, Agent, Customer } from '../types';
import { QUICK_REPLIES, MOCK_CUSTOMERS } from '../constants';

const statusConfig = {
    new: { color: 'bg-blue-500', label: 'New' },
    open: { color: 'bg-yellow-500', label: 'Open' },
    'in-progress': { color: 'bg-indigo-500', label: 'In Progress' },
    resolved: { color: 'bg-green-500', label: 'Resolved' },
    'escalated-to-human': { color: 'bg-red-500', label: 'Escalated' },
};

const TicketListItem: React.FC<{ ticket: Ticket; isSelected: boolean; onSelect: () => void }> = ({ ticket, isSelected, onSelect }) => {
    const lastMessage = ticket.messages[ticket.messages.length - 1];
    const status = statusConfig[ticket.status] || { color: 'bg-gray-500', label: 'Unknown' };

    return (
        <div onClick={onSelect} className={`p-3 cursor-pointer border-l-4 transition-colors ${isSelected ? 'bg-blue-100 dark:bg-gray-700 border-blue-500' : 'hover:bg-gray-100 dark:hover:bg-gray-700 border-transparent'}`}>
            <div className="flex justify-between items-center">
                <h3 className="font-semibold text-sm text-gray-800 dark:text-white truncate">{ticket.customerName}</h3>
                <span className={`text-xs px-2 py-0.5 rounded-full text-white ${status.color}`}>{status.label}</span>
            </div>
            <p className="text-xs text-gray-500 dark:text-gray-400 truncate mt-1">
                {lastMessage ? `${lastMessage.sender === 'customer' ? 'You: ' : ''}${lastMessage.text}` : 'New conversation...'}
            </p>
            <p className="text-xs text-right text-gray-400 dark:text-gray-500 mt-1">
                {new Date(ticket.lastMessageAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
            </p>
        </div>
    );
};

const ChatMessage: React.FC<{ message: Message }> = ({ message }) => {
    const isAgent = message.sender === 'agent';
    const alignClass = isAgent ? 'items-end' : 'items-start';
    const bubbleClass = isAgent ? 'bg-blue-600 text-white rounded-br-none' : 'bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 rounded-bl-none';
    const Icon = message.sender === 'bot' ? Briefcase : User;

    return (
        <div className={`flex flex-col ${alignClass} mb-4`}>
            <div className="flex items-end gap-2 max-w-xs md:max-w-md">
                {!isAgent && <div className="flex-shrink-0 w-8 h-8 bg-gray-300 dark:bg-gray-600 rounded-full flex items-center justify-center"><Icon size={18} /></div>}
                <div className={`px-4 py-3 rounded-2xl ${bubbleClass}`}>
                    <p className="text-sm">{message.text}</p>
                </div>
            </div>
            <span className={`text-xs text-gray-500 dark:text-gray-400 mt-1 ${isAgent ? 'mr-2' : 'ml-10'}`}>
                {new Date(message.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
            </span>
        </div>
    );
};

const CustomerInfoPanel: React.FC<{ customer: Customer | undefined }> = ({ customer }) => {
    if (!customer) return <div className="p-4 text-center text-gray-500">Select a ticket to see customer details.</div>;
    return (
        <div className="p-4 space-y-4">
            <div className="flex items-center space-x-3">
                <div className="w-12 h-12 bg-blue-200 rounded-full flex items-center justify-center">
                    <User className="text-blue-600" />
                </div>
                <div>
                    <h3 className="font-semibold text-lg">{customer.name}</h3>
                    <p className="text-sm text-gray-500">{customer.phone}</p>
                </div>
            </div>
            <div className="border-t border-gray-200 dark:border-gray-600 pt-4">
                <h4 className="font-semibold mb-2">Loan History</h4>
                {customer.loanHistory && customer.loanHistory.length > 0 ? (
                    <ul className="space-y-2 text-sm">
                        {customer.loanHistory.map(loan => (
                            <li key={loan.id} className="flex items-center justify-between p-2 rounded-md bg-gray-100 dark:bg-gray-700">
                                <div>
                                    <p className="font-medium">{loan.type}</p>
                                    <p className="text-xs text-gray-500">{loan.id}</p>
                                </div>
                                <span className="text-xs font-semibold">{loan.status}</span>
                            </li>
                        ))}
                    </ul>
                ) : (
                    <p className="text-sm text-gray-500">No loan history available.</p>
                )}
            </div>
        </div>
    );
};

const SupportDashboardPage: React.FC = () => {
    const { currentUser, logout } = useAuth();
    const agent = currentUser as Agent;
    const { tickets, addMessage, updateTicketStatus } = useChat();
    const [selectedTicketId, setSelectedTicketId] = useState<string | null>(null);
    const [message, setMessage] = useState('');
    const messagesEndRef = useRef<HTMLDivElement>(null);

    const sortedTickets = [...tickets].sort((a, b) => b.lastMessageAt - a.lastMessageAt);
    const selectedTicket = tickets.find(t => t.id === selectedTicketId);
    const customerDetails = MOCK_CUSTOMERS.find(c => c.id === selectedTicket?.customerId);

    useEffect(() => {
        if (!selectedTicketId && sortedTickets.length > 0) {
            setSelectedTicketId(sortedTickets[0].id);
        }
    }, [sortedTickets, selectedTicketId]);

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [selectedTicket?.messages]);
    
    useEffect(() => {
        if(selectedTicket && selectedTicket.status === 'escalated-to-human'){
             updateTicketStatus(selectedTicket.id, 'in-progress', agent.id);
        }
    }, [selectedTicket?.id, selectedTicket?.status])

    const handleSendMessage = (e: React.FormEvent) => {
        e.preventDefault();
        if (message.trim() && selectedTicket) {
            addMessage(selectedTicket.id, message, 'agent');
            setMessage('');
            if (selectedTicket.status === 'open' || selectedTicket.status === 'escalated-to-human') {
                updateTicketStatus(selectedTicket.id, 'in-progress', agent.id);
            }
        }
    };
    
    const handleResolveTicket = () => {
        if (selectedTicket) {
            updateTicketStatus(selectedTicket.id, 'resolved', agent.id);
            addMessage(selectedTicket.id, "This conversation has been marked as resolved.", 'agent');
        }
    };

    return (
        <div className="flex h-screen text-gray-800 dark:text-gray-200 bg-white dark:bg-gray-800">
            <aside className="w-1/4 min-w-[300px] border-r border-gray-200 dark:border-gray-700 flex flex-col">
                <header className="p-4 border-b border-gray-200 dark:border-gray-700 flex justify-between items-center">
                    <div>
                        <h2 className="text-lg font-semibold">{agent.name}</h2>
                        <p className="text-xs text-gray-500">{agent.role}</p>
                    </div>
                    <button onClick={logout} className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-500 dark:text-gray-400">
                        <LogOut size={20} />
                    </button>
                </header>
                <div className="flex-1 overflow-y-auto">
                    {sortedTickets.map(ticket => (
                        <TicketListItem 
                            key={ticket.id} 
                            ticket={ticket} 
                            isSelected={selectedTicketId === ticket.id}
                            onSelect={() => setSelectedTicketId(ticket.id)}
                        />
                    ))}
                </div>
            </aside>

            <main className="flex-1 flex flex-col">
                {selectedTicket ? (
                    <>
                        <header className="p-4 border-b border-gray-200 dark:border-gray-700 flex justify-between items-center">
                            <div>
                                <h3 className="font-semibold">{selectedTicket.customerName}</h3>
                                <p className="text-xs text-gray-500">Ticket ID: {selectedTicket.id}</p>
                            </div>
                            <button 
                                onClick={handleResolveTicket}
                                disabled={selectedTicket.status === 'resolved'}
                                className="flex items-center gap-2 px-3 py-1.5 text-sm bg-green-500 text-white rounded-md hover:bg-green-600 disabled:bg-gray-400 disabled:cursor-not-allowed">
                                <CheckCircle size={16} />
                                Resolve
                            </button>
                        </header>
                        <div className="flex-1 p-4 overflow-y-auto">
                            {selectedTicket.messages.map(msg => <ChatMessage key={msg.id} message={msg} />)}
                            <div ref={messagesEndRef} />
                        </div>
                        <footer className="p-4 border-t border-gray-200 dark:border-gray-700">
                             <div className="flex space-x-2 mb-2 overflow-x-auto pb-2">
                                {QUICK_REPLIES.map((reply, i) => (
                                    <button key={i} onClick={() => setMessage(reply)} className="flex-shrink-0 text-xs px-3 py-1 bg-gray-200 dark:bg-gray-600 rounded-full hover:bg-gray-300 dark:hover:bg-gray-500">
                                        {reply}
                                    </button>
                                ))}
                            </div>
                            <form onSubmit={handleSendMessage} className="flex items-center space-x-2">
                                <input
                                    type="text"
                                    value={message}
                                    onChange={(e) => setMessage(e.target.value)}
                                    placeholder={selectedTicket.status === 'resolved' ? "This conversation is resolved." : "Type your message..."}
                                    disabled={selectedTicket.status === 'resolved'}
                                    className="flex-1 px-4 py-2 bg-gray-100 dark:bg-gray-700 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500"
                                />
                                <button type="submit" disabled={!message.trim() || selectedTicket.status === 'resolved'} className="p-3 bg-blue-600 text-white rounded-full disabled:bg-gray-400 disabled:cursor-not-allowed hover:bg-blue-700 transition-colors">
                                    <SendHorizontal size={20} />
                                </button>
                            </form>
                        </footer>
                    </>
                ) : (
                    <div className="flex-1 flex items-center justify-center text-gray-500">
                        <p>Select a ticket to start a conversation.</p>
                    </div>
                )}
            </main>

            <aside className="w-1/4 min-w-[300px] border-l border-gray-200 dark:border-gray-700">
                <header className="p-4 border-b border-gray-200 dark:border-gray-700">
                    <h2 className="text-lg font-semibold flex items-center gap-2"><Info size={20} /> Customer Information</h2>
                </header>
                <CustomerInfoPanel customer={customerDetails} />
            </aside>
        </div>
    );
};

export default SupportDashboardPage;

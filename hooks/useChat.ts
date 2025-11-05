
import { useContext } from 'react';
import { AppContext } from '../contexts/AppContext';
import { Ticket, Message, TicketStatus } from '../types';

export const useChat = () => {
  const { state, dispatch } = useContext(AppContext);

  const createTicket = (customerId: string, customerName: string) => {
    const existingTicket = state.tickets.find(t => t.customerId === customerId && t.status !== 'resolved');
    if (existingTicket) {
        return existingTicket;
    }
    const newTicket: Ticket = {
      id: `ticket-${Date.now()}`,
      customerId,
      customerName,
      status: 'new',
      priority: 'medium',
      category: 'General Inquiry',
      messages: [],
      createdAt: Date.now(),
      lastMessageAt: Date.now(),
    };
    dispatch({ type: 'CREATE_TICKET', payload: newTicket });
    return newTicket;
  };

  const addMessage = (ticketId: string, text: string, sender: 'customer' | 'agent' | 'bot') => {
    const newMessage: Message = {
      id: `msg-${Date.now()}`,
      ticketId,
      text,
      sender,
      timestamp: Date.now(),
    };
    dispatch({ type: 'ADD_MESSAGE', payload: newMessage });
  };
  
  const updateTicketStatus = (ticketId: string, status: TicketStatus, agentId?: string) => {
    dispatch({ type: 'UPDATE_TICKET_STATUS', payload: { ticketId, status, agentId } });
  };

  return {
    tickets: state.tickets,
    createTicket,
    addMessage,
    updateTicketStatus,
  };
};

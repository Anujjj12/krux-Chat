
export interface Customer {
  id: string;
  name: string;
  phone: string;
  type: 'customer';
  loanHistory?: { id: string; type: string; status: string }[];
}

export interface Agent {
  id: string;
  name: string;
  username: string;
  type: 'agent';
  role: 'Support Agent' | 'Senior Agent';
}

export type User = Customer | Agent;

export interface Message {
  id: string;
  text: string;
  sender: 'customer' | 'agent' | 'bot';
  timestamp: number;
  ticketId: string;
}

export type TicketStatus = 'new' | 'open' | 'in-progress' | 'resolved' | 'escalated-to-human';
export type TicketPriority = 'low' | 'medium' | 'high';
export type TicketCategory = 'Loan Application' | 'Documents' | 'Status Check' | 'General Inquiry';

export interface Ticket {
  id: string;
  customerId: string;
  customerName: string;
  status: TicketStatus;
  priority: TicketPriority;
  category: TicketCategory;
  messages: Message[];
  assignedAgentId?: string;
  createdAt: number;
  lastMessageAt: number;
}

export type AppAction =
  | { type: 'LOGIN'; payload: User }
  | { type: 'LOGOUT' }
  | { type: 'CREATE_TICKET'; payload: Ticket }
  | { type: 'ADD_MESSAGE'; payload: Message }
  | { type: 'UPDATE_TICKET_STATUS'; payload: { ticketId: string; status: TicketStatus, agentId?: string } };

export interface AppState {
  tickets: Ticket[];
  currentUser: User | null;
}

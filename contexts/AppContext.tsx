
import React, { createContext, useReducer, useEffect, ReactNode } from 'react';
import { AppState, AppAction, User, Ticket, Message, TicketStatus } from '../types';

const LOCAL_STORAGE_KEY = 'KRUX_FINANCE_SUPPORT_STATE';

const initialState: AppState = {
  tickets: [],
  currentUser: null,
};

const appReducer = (state: AppState, action: AppAction): AppState => {
  switch (action.type) {
    case 'LOGIN':
      return { ...state, currentUser: action.payload };
    case 'LOGOUT':
      return { ...state, currentUser: null };
    case 'CREATE_TICKET': {
      const existingTicket = state.tickets.find(t => t.customerId === action.payload.customerId && t.status !== 'resolved');
      if (existingTicket) return state;
      return { ...state, tickets: [...state.tickets, action.payload] };
    }
    case 'ADD_MESSAGE': {
      return {
        ...state,
        tickets: state.tickets.map(ticket =>
          ticket.id === action.payload.ticketId
            ? { ...ticket, messages: [...ticket.messages, action.payload], lastMessageAt: Date.now() }
            : ticket
        ),
      };
    }
    case 'UPDATE_TICKET_STATUS': {
        return {
            ...state,
            tickets: state.tickets.map(ticket =>
                ticket.id === action.payload.ticketId
                ? { ...ticket, status: action.payload.status, assignedAgentId: action.payload.agentId || ticket.assignedAgentId }
                : ticket
            ),
        };
    }
    default:
      return state;
  }
};

const AppContext = createContext<{
  state: AppState;
  dispatch: React.Dispatch<AppAction>;
}>({
  state: initialState,
  dispatch: () => null,
});

const AppProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [state, dispatch] = useReducer(appReducer, initialState, (initial) => {
    try {
      const storedState = localStorage.getItem(LOCAL_STORAGE_KEY);
      return storedState ? JSON.parse(storedState) : initial;
    } catch (error) {
      console.error("Error parsing state from localStorage", error);
      return initial;
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(state));
    } catch (error) {
      console.error("Error saving state to localStorage", error);
    }
  }, [state]);

  return (
    <AppContext.Provider value={{ state, dispatch }}>
      {children}
    </AppContext.Provider>
  );
};

export { AppContext, AppProvider };

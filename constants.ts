
import { Customer, Agent } from './types';

export const MOCK_CUSTOMERS: Customer[] = [
  {
    id: 'cust-1',
    name: 'Rahul Sharma',
    phone: '+919876543210',
    type: 'customer',
    loanHistory: [
      { id: 'KRUX12345', type: 'Personal Loan', status: 'Under Review' },
    ],
  },
  {
    id: 'cust-2',
    name: 'Priya Patel',
    phone: '+919876543211',
    type: 'customer',
    loanHistory: [
      { id: 'KRUX67890', type: 'Business Loan', status: 'Approved' },
    ],
  },
];

export const MOCK_AGENTS: Agent[] = [
  {
    id: 'agent-1',
    name: 'Amit Kumar',
    username: 'amit.kumar',
    type: 'agent',
    role: 'Support Agent',
  },
  {
    id: 'agent-2',
    name: 'Sneha Singh',
    username: 'sneha.singh',
    type: 'agent',
    role: 'Senior Agent',
  },
];

export const QUICK_REPLIES: string[] = [
  "Hello! How can I assist you with your loan application today?",
  "Could you please provide your Application ID so I can check the status for you?",
  "Thank you for providing the details. Please allow me a moment to review your case.",
  "Is there anything else I can help you with today?",
];

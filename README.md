# Krux Finance Dual Chatbot System

This repository contains a small React + TypeScript demo for a dual chatbot system (customer + support agent).

## Folder structure

Root files:

- `App.tsx` — main app component
- `index.tsx` — app entry and ReactDOM bootstrap
- `index.html` — base HTML template
- `vite.config.ts` — Vite dev server config
- `package.json` / `tsconfig.json` / `README.md` — project metadata and config
- `constants.ts` — mock data used by the app (customers, agents, quick replies)
- `types.ts` — shared TypeScript types
- `metadata.json` — additional project metadata

Directories:

- `contexts/`
	- `AppContext.tsx` — React context providing app-level state
- `hooks/`
	- `useAuth.ts` — authentication helper hook
	- `useChat.ts` — chat state and helpers
- `pages/`
	- `CustomerChatPage.tsx` — customer-facing chat UI
	- `LandingPage.tsx` — marketing / landing page
	- `LoginPage.tsx` — login UI
	- `SupportDashboardPage.tsx` — agent dashboard UI
- `services/`
	- `geminiService.ts` — (example) external AI/service integration

## Mock credentials and data (from `constants.ts`)

The project uses mock/test data in `constants.ts`. Below are the mock customers, agents and quick replies included in that file:

Customers:

- id: `cust-1`
	- name: `Rahul Sharma`
	- phone: `+919876543210`
	- loanHistory: `[{ id: 'KRUX12345', type: 'Personal Loan', status: 'Under Review' } ]`

- id: `cust-2`
	- name: `Priya Patel`
	- phone: `+919876543211`
	- loanHistory: `[{ id: 'KRUX67890', type: 'Business Loan', status: 'Approved' } ]`

Agents (mock users):

- id: `agent-1`
	- name: `Amit Kumar`
	- username: `amit.kumar`
	- role: `Support Agent`

- id: `agent-2`
	- name: `Sneha Singh`
	- username: `sneha.singh`
	- role: `Senior Agent`

Quick replies included:

- "Hello! How can I assist you with your loan application today?"
- "Could you please provide your Application ID so I can check the status for you?"
- "Thank you for providing the details. Please allow me a moment to review your case."
- "Is there anything else I can help you with today?"

> Note: The above values are mock/test data bundled with the project for development and demo purposes. Do not use them for production.


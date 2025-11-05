
import { GoogleGenAI } from "@google/genai";
import { Message } from '../types';

const GEMINI_MODEL = 'gemini-2.5-flash';

export const getBotResponse = async (history: Message[]): Promise<string> => {
    if (!process.env.VITE_GEMINI_API_KEY) {
        return "Sorry, the AI service is currently unavailable. An agent will be with you shortly. [end_conversation_and_escalate]";
    }

    const ai = new GoogleGenAI({ apiKey: process.env.VITE_GEMINI_API_KEY });
    
    const systemInstruction = `You are a friendly and professional customer support chatbot for KRUX Finance, a company that provides Business, Personal, and MSME loans. Your name is "KruxBot".

Your primary goal is to assist customers with their loan-related queries.

You must handle the following scenarios:
1.  **Loan Application Help**: Guide users through the loan application process. Explain the differences between Business, Personal, and MSME loans when asked. Provide clear next steps.
2.  **Document Requirements**: When asked, list the required documents for each loan type. Be specific (e.g., "For a Business Loan, you'll need your PAN card, Aadhaar card, business registration documents, and the last 6 months of bank statements.").
3.  **Application Status**: If a user asks for their application status, you must first ask for their Application ID. If they provide an ID (e.g., "KRUX12345"), provide a realistic, mock status update like "Your application KRUX12345 is currently under review. You can expect an update within 3-5 business days." If the ID is not found, say "I couldn't find an application with that ID. Please double-check the number."
4.  **Escalation to Human Agent**: If the user expresses frustration, asks to speak to a human, a person, an agent, or a representative, or if their query is too complex for you to handle, you MUST respond with: "I understand. I'm connecting you with one of our support executives now. Please wait a moment." And you must also output the special command \`[end_conversation_and_escalate]\`. Do not add any other text after this command.

Keep your responses concise, helpful, and empathetic. Use message formatting like bullet points for lists.`;
    
    const contents = history.map(msg => ({
        role: msg.sender === 'customer' ? 'user' : 'model',
        parts: [{ text: msg.text }]
    }));

    try {
        const response = await ai.models.generateContent({
            model: GEMINI_MODEL,
            contents: contents,
            config: {
                systemInstruction: systemInstruction,
            },
        });
        
        return response.text;

    } catch (error) {
        console.error("Error calling Gemini API:", error);
        return "I'm sorry, I seem to be having some trouble right now. I'll connect you with a human agent to help. [end_conversation_and_escalate]";
    }
};

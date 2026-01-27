import React, { createContext, useContext, useState, useCallback, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { 
  JeromeSettings, 
  JeromeChatMessage, 
  JeromeContextualGuidance,
  JeromeTip 
} from '@/lib/jerome-types';
import { 
  defaultJeromeSettings, 
  getGuidanceForRoute,
  getRandomTips,
  jeromeQuickReplies,
  findAnswerForQuestion
} from '@/lib/jerome-mock-data';

interface JeromeContextType {
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
  settings: JeromeSettings;
  updateSettings: (settings: Partial<JeromeSettings>) => void;
  chatMessages: JeromeChatMessage[];
  sendMessage: (message: string) => void;
  clearChat: () => void;
  currentGuidance: JeromeContextualGuidance[];
  tips: JeromeTip[];
  hasNewGuidance: boolean;
  markGuidanceRead: () => void;
  activeTab: 'chat' | 'guidance' | 'tips' | 'settings';
  setActiveTab: (tab: 'chat' | 'guidance' | 'tips' | 'settings') => void;
}

const JeromeContext = createContext<JeromeContextType | undefined>(undefined);

export function JeromeProvider({ children }: { children: React.ReactNode }) {
  const location = useLocation();
  const [isOpen, setIsOpen] = useState(false);
  const [settings, setSettings] = useState<JeromeSettings>(defaultJeromeSettings);
  const [chatMessages, setChatMessages] = useState<JeromeChatMessage[]>([
    {
      id: 'welcome',
      role: 'jerome',
      content: "Hello! I'm Jerome, powered by Dr. Swartz's accounting expertise. I'm here to help with your accounting questions and provide contextual guidance. How can I assist you today?",
      timestamp: new Date(),
    }
  ]);
  const [currentGuidance, setCurrentGuidance] = useState<JeromeContextualGuidance[]>([]);
  const [tips] = useState<JeromeTip[]>(getRandomTips(5));
  const [hasNewGuidance, setHasNewGuidance] = useState(false);
  const [activeTab, setActiveTab] = useState<'chat' | 'guidance' | 'tips' | 'settings'>('chat');

  // Update guidance when route changes
  useEffect(() => {
    const guidance = getGuidanceForRoute(location.pathname);
    setCurrentGuidance(guidance);
    if (guidance.length > 0) {
      setHasNewGuidance(true);
    }
  }, [location.pathname]);

  const updateSettings = useCallback((newSettings: Partial<JeromeSettings>) => {
    setSettings(prev => ({ ...prev, ...newSettings }));
  }, []);

  const sendMessage = useCallback((message: string) => {
    // Add user message
    const userMessage: JeromeChatMessage = {
      id: `user-${Date.now()}`,
      role: 'user',
      content: message,
      timestamp: new Date(),
    };
    setChatMessages(prev => [...prev, userMessage]);

    // Find answer from quick replies or generate a default response
    setTimeout(() => {
      const quickReply = findAnswerForQuestion(message);
      let response: string;

      if (quickReply) {
        response = quickReply.answer;
      } else {
        // Default responses based on keywords
        const lowerMessage = message.toLowerCase();
        if (lowerMessage.includes('vat')) {
          response = "For VAT-related questions, I recommend checking your VAT section in the dashboard. The current VAT rate is 15%. Would you like me to explain VAT treatments for specific items?";
        } else if (lowerMessage.includes('tax')) {
          response = "I can help with tax queries! Please specify if you're asking about provisional tax, income tax (IT14), PAYE, or capital gains tax.";
        } else if (lowerMessage.includes('payroll') || lowerMessage.includes('employee')) {
          response = "For payroll assistance, navigate to the Payroll section. I can help with adding employees, calculating PAYE, or understanding UIF contributions.";
        } else if (lowerMessage.includes('help') || lowerMessage.includes('hello') || lowerMessage.includes('hi')) {
          response = "I'm here to help! You can ask me about:\n• Categorizing transactions\n• VAT treatments\n• Tax deadlines\n• Payroll questions\n• Downloading reports\n\nJust type your question!";
        } else {
          response = "I understand you're asking about something important. While I'm still learning, I recommend consulting the guidance tips or reaching out to your accountant for specific advice. Is there anything else I can help with?";
        }
      }

      const jeromeMessage: JeromeChatMessage = {
        id: `jerome-${Date.now()}`,
        role: 'jerome',
        content: response,
        timestamp: new Date(),
      };
      setChatMessages(prev => [...prev, jeromeMessage]);
    }, 800);
  }, []);

  const clearChat = useCallback(() => {
    setChatMessages([{
      id: 'welcome',
      role: 'jerome',
      content: "Chat cleared. How can I help you today?",
      timestamp: new Date(),
    }]);
  }, []);

  const markGuidanceRead = useCallback(() => {
    setHasNewGuidance(false);
  }, []);

  return (
    <JeromeContext.Provider
      value={{
        isOpen,
        setIsOpen,
        settings,
        updateSettings,
        chatMessages,
        sendMessage,
        clearChat,
        currentGuidance,
        tips,
        hasNewGuidance,
        markGuidanceRead,
        activeTab,
        setActiveTab,
      }}
    >
      {children}
    </JeromeContext.Provider>
  );
}

export function useJerome() {
  const context = useContext(JeromeContext);
  if (context === undefined) {
    throw new Error('useJerome must be used within a JeromeProvider');
  }
  return context;
}

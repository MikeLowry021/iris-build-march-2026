import React, { createContext, useContext, useState, useCallback, useEffect, useRef } from 'react';
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
} from '@/lib/jerome-mock-data';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';

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
  isLoading: boolean;
  isVoiceEnabled: boolean;
  setIsVoiceEnabled: (enabled: boolean) => void;
}

const JeromeContext = createContext<JeromeContextType | undefined>(undefined);

export function JeromeProvider({ children }: { children: React.ReactNode }) {
  const location = useLocation();
  const { user } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const [settings, setSettings] = useState<JeromeSettings>(defaultJeromeSettings);
  const [chatMessages, setChatMessages] = useState<JeromeChatMessage[]>([
    {
      id: 'welcome',
      role: 'jerome',
      content: "Hello! I'm Jerome, powered by Dr. Swartz's accounting expertise. I'm here to help with your South African tax and accounting questions. How can I assist you today?",
      timestamp: new Date(),
    }
  ]);
  const [currentGuidance, setCurrentGuidance] = useState<JeromeContextualGuidance[]>([]);
  const [tips] = useState<JeromeTip[]>(getRandomTips(5));
  const [hasNewGuidance, setHasNewGuidance] = useState(false);
  const [activeTab, setActiveTab] = useState<'chat' | 'guidance' | 'tips' | 'settings'>('chat');
  const [isLoading, setIsLoading] = useState(false);
  const [isVoiceEnabled, setIsVoiceEnabled] = useState(false);
  const abortControllerRef = useRef<AbortController | null>(null);

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

  const sendMessage = useCallback(async (message: string) => {
    // Cancel any ongoing request
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }

    // Add user message
    const userMessage: JeromeChatMessage = {
      id: `user-${Date.now()}`,
      role: 'user',
      content: message,
      timestamp: new Date(),
    };
    setChatMessages(prev => [...prev, userMessage]);

    // Add placeholder for Jerome's response
    const jeromeMessageId = `jerome-${Date.now()}`;
    const jeromeMessage: JeromeChatMessage = {
      id: jeromeMessageId,
      role: 'jerome',
      content: '',
      timestamp: new Date(),
      isStreaming: true,
    };
    setChatMessages(prev => [...prev, jeromeMessage]);
    setIsLoading(true);

    try {
      abortControllerRef.current = new AbortController();
      
      // Get conversation history (last 10 messages for context)
      const conversationHistory = chatMessages
        .slice(-10)
        .map(m => ({ role: m.role, content: m.content }));
      conversationHistory.push({ role: 'user', content: message });

      const response = await supabase.functions.invoke('jerome-chat', {
        body: { 
          messages: conversationHistory,
          userId: user?.id,
          userRole: user?.role,
        },
      });

      if (response.error) {
        throw new Error(response.error.message);
      }

      // Handle streaming response
      const reader = response.data?.getReader?.();
      
      if (reader) {
        const decoder = new TextDecoder();
        let fullContent = '';

        while (true) {
          const { done, value } = await reader.read();
          if (done) break;

          const chunk = decoder.decode(value, { stream: true });
          const lines = chunk.split('\n');

          for (const line of lines) {
            if (line.startsWith('data: ')) {
              const data = line.slice(6);
              if (data === '[DONE]') continue;

              try {
                const parsed = JSON.parse(data);
                if (parsed.content) {
                  fullContent += parsed.content;
                  setChatMessages(prev =>
                    prev.map(m =>
                      m.id === jeromeMessageId
                        ? { ...m, content: fullContent }
                        : m
                    )
                  );
                }
              } catch {
                // Skip malformed JSON
              }
            }
          }
        }

        // Mark as complete
        setChatMessages(prev =>
          prev.map(m =>
            m.id === jeromeMessageId
              ? { ...m, isStreaming: false }
              : m
          )
        );
      } else {
        // Non-streaming fallback
        const data = response.data;
        if (typeof data === 'string') {
          setChatMessages(prev =>
            prev.map(m =>
              m.id === jeromeMessageId
                ? { ...m, content: data, isStreaming: false }
                : m
            )
          );
        } else if (data?.content) {
          setChatMessages(prev =>
            prev.map(m =>
              m.id === jeromeMessageId
                ? { ...m, content: data.content, isStreaming: false }
                : m
            )
          );
        }
      }
    } catch (error) {
      console.error('Jerome chat error:', error);
      
      // Update with error message
      setChatMessages(prev =>
        prev.map(m =>
          m.id === jeromeMessageId
            ? { 
                ...m, 
                content: "I'm having trouble connecting right now. Please try again in a moment, or check out the Tips tab for helpful information!",
                isStreaming: false 
              }
            : m
        )
      );
    } finally {
      setIsLoading(false);
      abortControllerRef.current = null;
    }
  }, [chatMessages, user]);

  const clearChat = useCallback(() => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }
    setChatMessages([{
      id: 'welcome',
      role: 'jerome',
      content: "Chat cleared. How can I help you today?",
      timestamp: new Date(),
    }]);
    setIsLoading(false);
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
        isLoading,
        isVoiceEnabled,
        setIsVoiceEnabled,
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

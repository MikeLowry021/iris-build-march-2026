import { useState, useRef, useEffect } from 'react';
import { useJerome } from '@/contexts/JeromeContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { cn } from '@/lib/utils';
import { Send, Trash2 } from 'lucide-react';
import { JeromeAvatar } from './JeromeAvatar';
import { JeromeTypingIndicator } from './JeromeTypingIndicator';
import { JeromeVoiceControls, JeromeSpeakerButton } from './JeromeVoiceControls';

const quickReplyButtons = [
  'How do I categorize this transaction?',
  'What\'s the VAT treatment for petrol?',
  'When is my tax due?',
  'How do I download my payslip?',
];

export function JeromeChatWidget() {
  const { chatMessages, sendMessage, clearChat, isLoading, isVoiceEnabled } = useJerome();
  const [input, setInput] = useState('');
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [chatMessages]);

  const handleSend = () => {
    if (input.trim() && !isLoading) {
      sendMessage(input.trim());
      setInput('');
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleQuickReply = (question: string) => {
    if (!isLoading) {
      sendMessage(question);
    }
  };

  const handleVoiceTranscription = (text: string) => {
    setInput(text);
  };

  return (
    <div className="flex h-full flex-col">
      {/* Chat header */}
      <div className="flex items-center justify-between border-b border-border p-3">
        <div className="flex items-center gap-2">
          <JeromeAvatar size="sm" />
          <div>
            <p className="text-sm font-semibold">Chat with Iris AI</p>
            <p className="text-xs text-muted-foreground">AI-powered accounting assistant</p>
          </div>
        </div>
        <Button
          variant="ghost"
          size="icon"
          onClick={clearChat}
          className="h-8 w-8"
          disabled={isLoading}
        >
          <Trash2 className="h-4 w-4" />
        </Button>
      </div>

      {/* Messages */}
      <ScrollArea className="flex-1 p-3" ref={scrollRef}>
        <div className="space-y-4">
          {chatMessages.map((message) => (
            <div
              key={message.id}
              className={cn(
                'flex gap-2',
                message.role === 'user' ? 'flex-row-reverse' : 'flex-row'
              )}
            >
              {message.role === 'jerome' && <JeromeAvatar size="sm" />}
              <div
                className={cn(
                  'max-w-[80%] rounded-lg px-3 py-2 text-sm',
                  message.role === 'user'
                    ? 'bg-primary text-primary-foreground'
                    : 'bg-muted text-foreground'
                )}
              >
                <p className="whitespace-pre-wrap">{message.content}</p>
                {message.isStreaming && (
                  <span className="inline-block w-1 h-4 ml-1 bg-foreground/50 animate-pulse" />
                )}
                <div className="flex items-center justify-between mt-1 gap-2">
                  <p
                    className={cn(
                      'text-xs',
                      message.role === 'user'
                        ? 'text-primary-foreground/70'
                        : 'text-muted-foreground'
                    )}
                  >
                    {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </p>
                  {message.role === 'jerome' && !message.isStreaming && message.content && (
                    <JeromeSpeakerButton text={message.content} isVoiceEnabled={isVoiceEnabled} />
                  )}
                </div>
              </div>
            </div>
          ))}
          {isLoading && chatMessages[chatMessages.length - 1]?.content === '' && (
            <div className="flex gap-2">
              <JeromeAvatar size="sm" />
              <div className="bg-muted rounded-lg px-3 py-2">
                <JeromeTypingIndicator />
              </div>
            </div>
          )}
        </div>
      </ScrollArea>

      {/* Quick replies */}
      <div className="border-t border-border p-2">
        <p className="mb-2 text-xs text-muted-foreground">Quick questions:</p>
        <div className="flex flex-wrap gap-1">
          {quickReplyButtons.map((question, index) => (
            <Button
              key={index}
              variant="outline"
              size="sm"
              className="h-auto px-2 py-1 text-xs"
              onClick={() => handleQuickReply(question)}
              disabled={isLoading}
            >
              {question.length > 30 ? question.slice(0, 30) + '...' : question}
            </Button>
          ))}
        </div>
      </div>

      {/* Input */}
      <div className="border-t border-border p-3">
        <div className="flex gap-2">
          <JeromeVoiceControls 
            onTranscription={handleVoiceTranscription}
            isVoiceEnabled={isVoiceEnabled}
          />
          <Input
            placeholder="Type your question..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={handleKeyPress}
            className="flex-1"
            disabled={isLoading}
          />
          <Button onClick={handleSend} size="icon" disabled={!input.trim() || isLoading}>
            <Send className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}

import { useJerome } from '@/contexts/JeromeContext';
import { cn } from '@/lib/utils';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { MessageSquare, Lightbulb, Compass, Settings } from 'lucide-react';
import { JeromeAvatar } from './JeromeAvatar';
import { JeromeChatWidget } from './JeromeChatWidget';
import { JeromeGuidancePanel } from './JeromeGuidancePanel';
import { JeromeTipsPanel } from './JeromeTipsPanel';
import { JeromeSettingsPanel } from './JeromeSettingsPanel';

export function JeromePanel() {
  const { isOpen, activeTab, setActiveTab, currentGuidance } = useJerome();

  return (
    <div
      className={cn(
        'fixed bottom-24 right-6 z-50 w-[380px] max-h-[600px]',
        'rounded-xl border border-border bg-card shadow-2xl',
        'transition-all duration-300 ease-out',
        'flex flex-col overflow-hidden',
        isOpen
          ? 'opacity-100 translate-y-0 scale-100'
          : 'opacity-0 translate-y-4 scale-95 pointer-events-none'
      )}
    >
      {/* Header */}
      <div className="flex items-center gap-3 border-b border-border bg-gradient-to-r from-primary/10 to-transparent p-4">
        <JeromeAvatar size="md" />
        <div className="flex-1">
          <h2 className="font-semibold text-foreground">Jerome</h2>
          <p className="text-xs text-muted-foreground">
            AI Assistant • Powered by Dr. Swartz's expertise
          </p>
        </div>
      </div>

      {/* Tabs */}
      <Tabs
        value={activeTab}
        onValueChange={(value) => setActiveTab(value as typeof activeTab)}
        className="flex flex-1 flex-col overflow-hidden"
      >
        <TabsList className="grid w-full grid-cols-4 rounded-none border-b border-border bg-transparent p-1">
          <TabsTrigger
            value="chat"
            className="gap-1.5 data-[state=active]:bg-primary/10"
          >
            <MessageSquare className="h-4 w-4" />
            <span className="hidden sm:inline">Chat</span>
          </TabsTrigger>
          <TabsTrigger
            value="guidance"
            className="relative gap-1.5 data-[state=active]:bg-primary/10"
          >
            <Compass className="h-4 w-4" />
            <span className="hidden sm:inline">Guide</span>
            {currentGuidance.length > 0 && (
              <span className="absolute -right-1 -top-1 flex h-4 w-4 items-center justify-center rounded-full bg-primary text-[10px] text-primary-foreground">
                {currentGuidance.length}
              </span>
            )}
          </TabsTrigger>
          <TabsTrigger
            value="tips"
            className="gap-1.5 data-[state=active]:bg-primary/10"
          >
            <Lightbulb className="h-4 w-4" />
            <span className="hidden sm:inline">Tips</span>
          </TabsTrigger>
          <TabsTrigger
            value="settings"
            className="gap-1.5 data-[state=active]:bg-primary/10"
          >
            <Settings className="h-4 w-4" />
            <span className="hidden sm:inline">Settings</span>
          </TabsTrigger>
        </TabsList>

        <TabsContent
          value="chat"
          className="flex-1 overflow-hidden m-0 data-[state=inactive]:hidden"
        >
          <JeromeChatWidget />
        </TabsContent>

        <TabsContent
          value="guidance"
          className="flex-1 overflow-hidden m-0 data-[state=inactive]:hidden"
        >
          <JeromeGuidancePanel />
        </TabsContent>

        <TabsContent
          value="tips"
          className="flex-1 overflow-hidden m-0 data-[state=inactive]:hidden"
        >
          <JeromeTipsPanel />
        </TabsContent>

        <TabsContent
          value="settings"
          className="flex-1 overflow-hidden m-0 data-[state=inactive]:hidden"
        >
          <JeromeSettingsPanel />
        </TabsContent>
      </Tabs>
    </div>
  );
}

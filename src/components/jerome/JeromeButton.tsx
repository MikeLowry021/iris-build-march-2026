import { useState } from 'react';
import { cn } from '@/lib/utils';
import { useJerome } from '@/contexts/JeromeContext';
import { Bot, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@/components/ui/tooltip';

export function JeromeButton() {
  const { isOpen, setIsOpen, hasNewGuidance } = useJerome();
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div className="fixed bottom-6 right-6 z-50">
      <Tooltip>
        <TooltipTrigger asChild>
          <Button
            onClick={() => setIsOpen(!isOpen)}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
            className={cn(
              'relative h-14 w-14 rounded-full shadow-lg transition-all duration-300',
              'bg-gradient-to-br from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70',
              'hover:scale-105 hover:shadow-xl',
              isOpen && 'rotate-180'
            )}
          >
            {isOpen ? (
              <X className="h-6 w-6 text-primary-foreground" />
            ) : (
              <Bot className="h-6 w-6 text-primary-foreground" />
            )}
            
            {/* Notification dot */}
            {hasNewGuidance && !isOpen && (
              <span className="absolute -right-1 -top-1 flex h-4 w-4">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-warning opacity-75" />
                <span className="relative inline-flex h-4 w-4 rounded-full bg-warning" />
              </span>
            )}
          </Button>
        </TooltipTrigger>
        <TooltipContent side="left" className="max-w-xs">
          <div className="text-center">
            <p className="font-semibold">Jerome Assistant</p>
            <p className="text-xs text-muted-foreground">
              AI-powered accounting assistant. I'm here to help!
            </p>
          </div>
        </TooltipContent>
      </Tooltip>

      {/* Expanded label on hover */}
      <div
        className={cn(
          'absolute right-16 top-1/2 -translate-y-1/2 whitespace-nowrap',
          'rounded-lg bg-card px-3 py-2 shadow-lg border border-border',
          'transition-all duration-200',
          isHovered && !isOpen ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-2 pointer-events-none'
        )}
      >
        <p className="text-sm font-medium">Need help?</p>
        <p className="text-xs text-muted-foreground">Click to chat with Jerome</p>
      </div>
    </div>
  );
}

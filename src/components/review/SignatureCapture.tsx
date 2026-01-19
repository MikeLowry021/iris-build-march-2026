import { useRef, useState, useEffect, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Eraser, Check } from 'lucide-react';
import { cn } from '@/lib/utils';

interface SignatureCaptureProps {
  onSignatureChange: (dataUrl: string | null) => void;
  disabled?: boolean;
  className?: string;
}

export function SignatureCapture({ onSignatureChange, disabled = false, className }: SignatureCaptureProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [hasSignature, setHasSignature] = useState(false);
  const [lastPos, setLastPos] = useState<{ x: number; y: number } | null>(null);

  // Initialize canvas
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Set canvas size
    const rect = canvas.getBoundingClientRect();
    canvas.width = rect.width * window.devicePixelRatio;
    canvas.height = rect.height * window.devicePixelRatio;
    ctx.scale(window.devicePixelRatio, window.devicePixelRatio);

    // Set drawing style
    ctx.strokeStyle = 'hsl(var(--foreground))';
    ctx.lineWidth = 2;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';

    // Fill with white background
    ctx.fillStyle = 'hsl(var(--background))';
    ctx.fillRect(0, 0, rect.width, rect.height);
  }, []);

  const getPosition = useCallback((e: React.MouseEvent | React.TouchEvent) => {
    const canvas = canvasRef.current;
    if (!canvas) return { x: 0, y: 0 };

    const rect = canvas.getBoundingClientRect();
    
    if ('touches' in e) {
      const touch = e.touches[0];
      return {
        x: touch.clientX - rect.left,
        y: touch.clientY - rect.top,
      };
    } else {
      return {
        x: e.clientX - rect.left,
        y: e.clientY - rect.top,
      };
    }
  }, []);

  const startDrawing = useCallback((e: React.MouseEvent | React.TouchEvent) => {
    if (disabled) return;
    e.preventDefault();
    
    const pos = getPosition(e);
    setIsDrawing(true);
    setLastPos(pos);
  }, [disabled, getPosition]);

  const draw = useCallback((e: React.MouseEvent | React.TouchEvent) => {
    if (!isDrawing || disabled || !lastPos) return;
    e.preventDefault();

    const canvas = canvasRef.current;
    const ctx = canvas?.getContext('2d');
    if (!canvas || !ctx) return;

    const currentPos = getPosition(e);

    ctx.beginPath();
    ctx.moveTo(lastPos.x, lastPos.y);
    ctx.lineTo(currentPos.x, currentPos.y);
    ctx.stroke();

    setLastPos(currentPos);
    setHasSignature(true);
  }, [isDrawing, disabled, lastPos, getPosition]);

  const stopDrawing = useCallback(() => {
    if (isDrawing && hasSignature) {
      const canvas = canvasRef.current;
      if (canvas) {
        const dataUrl = canvas.toDataURL('image/png');
        onSignatureChange(dataUrl);
      }
    }
    setIsDrawing(false);
    setLastPos(null);
  }, [isDrawing, hasSignature, onSignatureChange]);

  const clearSignature = useCallback(() => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext('2d');
    if (!canvas || !ctx) return;

    const rect = canvas.getBoundingClientRect();
    ctx.fillStyle = 'hsl(var(--background))';
    ctx.fillRect(0, 0, rect.width, rect.height);

    setHasSignature(false);
    onSignatureChange(null);
  }, [onSignatureChange]);

  return (
    <div className={cn('space-y-3', className)}>
      <div className="flex items-center justify-between">
        <p className="text-sm font-medium text-foreground">Digital Signature</p>
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={clearSignature}
          disabled={disabled || !hasSignature}
        >
          <Eraser className="mr-1.5 h-3.5 w-3.5" />
          Clear
        </Button>
      </div>

      <Card className={cn(
        'overflow-hidden',
        disabled && 'opacity-50 cursor-not-allowed'
      )}>
        <CardContent className="p-0">
          <div className="relative">
            <canvas
              ref={canvasRef}
              className={cn(
                'w-full h-32 touch-none',
                !disabled && 'cursor-crosshair'
              )}
              onMouseDown={startDrawing}
              onMouseMove={draw}
              onMouseUp={stopDrawing}
              onMouseLeave={stopDrawing}
              onTouchStart={startDrawing}
              onTouchMove={draw}
              onTouchEnd={stopDrawing}
            />
            {!hasSignature && !disabled && (
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                <p className="text-sm text-muted-foreground">Sign here</p>
              </div>
            )}
          </div>
          <div className="flex items-center justify-between border-t border-border bg-muted/50 px-3 py-1.5">
            <p className="text-xs text-muted-foreground">
              Draw your signature above
            </p>
            {hasSignature && (
              <div className="flex items-center gap-1 text-xs text-success">
                <Check className="h-3 w-3" />
                Signed
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

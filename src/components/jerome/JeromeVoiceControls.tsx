import { useState, useRef, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Mic, MicOff, Volume2, VolumeX, Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

interface JeromeVoiceControlsProps {
  onTranscription: (text: string) => void;
  isVoiceEnabled: boolean;
}

export function JeromeVoiceControls({ onTranscription, isVoiceEnabled }: JeromeVoiceControlsProps) {
  const [isRecording, setIsRecording] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);

  const startRecording = useCallback(async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream, { mimeType: 'audio/webm' });
      mediaRecorderRef.current = mediaRecorder;
      audioChunksRef.current = [];

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data);
        }
      };

      mediaRecorder.onstop = async () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/webm' });
        stream.getTracks().forEach(track => track.stop());
        
        setIsProcessing(true);
        try {
          const formData = new FormData();
          formData.append('audio', audioBlob, 'recording.webm');

          const { data, error } = await supabase.functions.invoke('elevenlabs-stt', {
            body: formData,
          });

          if (error) throw error;
          
          if (data?.text) {
            onTranscription(data.text);
          } else if (data?.error) {
            toast.error(data.message || 'Voice transcription failed');
          }
        } catch (error) {
          console.error('Transcription error:', error);
          toast.error('Failed to transcribe audio. Voice features may not be configured.');
        } finally {
          setIsProcessing(false);
        }
      };

      mediaRecorder.start();
      setIsRecording(true);
    } catch (error) {
      console.error('Failed to start recording:', error);
      toast.error('Microphone access denied');
    }
  }, [onTranscription]);

  const stopRecording = useCallback(() => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
    }
  }, [isRecording]);

  const toggleRecording = () => {
    if (isRecording) {
      stopRecording();
    } else {
      startRecording();
    }
  };

  if (!isVoiceEnabled) {
    return null;
  }

  return (
    <Button
      variant={isRecording ? 'destructive' : 'outline'}
      size="icon"
      onClick={toggleRecording}
      disabled={isProcessing}
      className={cn(
        'relative',
        isRecording && 'animate-pulse'
      )}
      title={isRecording ? 'Stop recording' : 'Start voice input'}
    >
      {isProcessing ? (
        <Loader2 className="h-4 w-4 animate-spin" />
      ) : isRecording ? (
        <MicOff className="h-4 w-4" />
      ) : (
        <Mic className="h-4 w-4" />
      )}
      {isRecording && (
        <span className="absolute -right-1 -top-1 h-2 w-2 rounded-full bg-destructive" />
      )}
    </Button>
  );
}

interface JeromeSpeakerButtonProps {
  text: string;
  isVoiceEnabled: boolean;
}

export function JeromeSpeakerButton({ text, isVoiceEnabled }: JeromeSpeakerButtonProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const playAudio = async () => {
    if (isPlaying && audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
      setIsPlaying(false);
      return;
    }

    setIsLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke('elevenlabs-tts', {
        body: { text },
      });

      if (error) throw error;
      
      // Check if we got an error response
      if (data?.error) {
        toast.error(data.message || 'Text-to-speech failed');
        return;
      }

      // Create audio from blob
      const audioBlob = new Blob([data], { type: 'audio/mpeg' });
      const audioUrl = URL.createObjectURL(audioBlob);
      
      if (audioRef.current) {
        audioRef.current.pause();
      }
      
      const audio = new Audio(audioUrl);
      audioRef.current = audio;
      
      audio.onended = () => {
        setIsPlaying(false);
        URL.revokeObjectURL(audioUrl);
      };
      
      audio.onerror = () => {
        setIsPlaying(false);
        toast.error('Failed to play audio');
      };

      await audio.play();
      setIsPlaying(true);
    } catch (error) {
      console.error('TTS error:', error);
      toast.error('Failed to generate speech. Voice features may not be configured.');
    } finally {
      setIsLoading(false);
    }
  };

  if (!isVoiceEnabled) {
    return null;
  }

  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={playAudio}
      disabled={isLoading}
      className="h-6 w-6"
      title={isPlaying ? 'Stop' : 'Listen'}
    >
      {isLoading ? (
        <Loader2 className="h-3 w-3 animate-spin" />
      ) : isPlaying ? (
        <VolumeX className="h-3 w-3" />
      ) : (
        <Volume2 className="h-3 w-3" />
      )}
    </Button>
  );
}

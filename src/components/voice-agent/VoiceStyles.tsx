import React from 'react';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { useToast } from '@/components/ui/use-toast';
import { Speaker } from 'lucide-react';
import { supabase } from "@/integrations/supabase/client";

// Voice configuration mapping
const voiceConfig = {
  friendly: {
    voiceId: 'cjVigY5qzO86Huf0OWal', // Eric
    message: "Hi there, I will answer your calls in a friendly and helpful manner"
  },
  energetic: {
    voiceId: 'cgSgspJ2msm6clMCkdW9', // Jessica
    message: "Hi there, I will answer your calls with an enthusiastic and energetic style"
  },
  professional: {
    voiceId: 'iP95p4xoKVk53GoZ742B', // Chris
    message: "Hi there, I will answer your calls efficiently and in an understanding and professional tone"
  },
  calm: {
    voiceId: 'CwhRBWXzGAHq8TQ4Fs17', // Roger
    message: "Hi there, I will answer your calls calmly and in an understanding and easy to get along with demeanor"
  }
};

interface VoiceStylesProps {
  value: string;
  onChange: (value: string) => void;
}

export const VoiceStyles = ({ value, onChange }: VoiceStylesProps) => {
  const { toast } = useToast();

  const playVoiceSample = async (style: string) => {
    try {
      const { data, error: secretError } = await supabase.rpc('get_secret', {
        name: 'ELEVENLABS_API_KEY'
      });

      if (secretError || !data) {
        console.error('Error fetching API key:', secretError);
        throw new Error('Could not fetch API key');
      }

      const config = voiceConfig[style as keyof typeof voiceConfig];
      const response = await fetch(`https://api.elevenlabs.io/v1/text-to-speech/${config.voiceId}`, {
        method: 'POST',
        headers: {
          'xi-api-key': data,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          text: config.message,
          model_id: "eleven_turbo_v2",
          voice_settings: {
            stability: 0.5,
            similarity_boost: 0.8,
          }
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        console.error('ElevenLabs API error:', errorData);
        throw new Error('Failed to generate voice sample');
      }

      const audioBlob = await response.blob();
      const audioUrl = URL.createObjectURL(audioBlob);
      const audio = new Audio(audioUrl);
      await audio.play();

      toast({
        title: "Playing voice sample",
        description: `Playing ${style} voice style sample`,
      });
    } catch (error) {
      console.error('Error playing voice sample:', error);
      toast({
        title: "Error",
        description: "Could not play voice sample. Please ensure the API key is set correctly.",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="space-y-4">
      <Label>Voice Style</Label>
      <RadioGroup
        value={value}
        onValueChange={onChange}
        className="grid grid-cols-2 gap-4"
      >
        {['friendly', 'professional', 'energetic', 'calm'].map((style) => (
          <div key={style} className="flex items-center space-x-2">
            <RadioGroupItem value={style} id={style} />
            <Label htmlFor={style} className="capitalize flex items-center gap-2">
              {style}
              <Button
                variant="ghost"
                size="sm"
                className="p-1"
                onClick={(e) => {
                  e.preventDefault();
                  playVoiceSample(style);
                }}
              >
                <Speaker className="h-4 w-4" />
              </Button>
            </Label>
          </div>
        ))}
      </RadioGroup>
    </div>
  );
};
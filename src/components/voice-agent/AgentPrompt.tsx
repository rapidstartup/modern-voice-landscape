import React from 'react';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';

interface AgentPromptProps {
  businessName: string;
  agentName: string;
  prompt: string;
  welcomeMessage: string;
  onPromptChange: (value: string) => void;
  onWelcomeMessageChange: (value: string) => void;
}

export const AgentPrompt = ({
  businessName,
  agentName,
  prompt,
  welcomeMessage,
  onPromptChange,
  onWelcomeMessageChange,
}: AgentPromptProps) => {
  const useDefaultPrompt = () => {
    const defaultPrompt = `You are an inbound Customer Service representative for ${businessName} and your name is ${agentName}. You will be relaxed, calm, professional and helpful to callers who are calling to raise a support request. You will take their details, confirming, and raise a ticket to the support desk on their behalf with the details of their issue and let them know we will follow up with them asap`;
    onPromptChange(defaultPrompt);
  };

  const useDefaultWelcome = () => {
    const defaultWelcome = `Hi, thank you for calling ${businessName}, my name is ${agentName}, how can I assist you today?`;
    onWelcomeMessageChange(defaultWelcome);
  };

  return (
    <div className="space-y-4">
      <div>
        <Label htmlFor="prompt">Agent Personality & Role</Label>
        <Textarea
          id="prompt"
          value={prompt}
          onChange={(e) => onPromptChange(e.target.value)}
          placeholder="Describe how your agent should behave and handle customer service inquiries..."
          className="h-32"
        />
        <button
          onClick={useDefaultPrompt}
          className="text-sm text-primary hover:underline mt-2"
        >
          Use default: Professional MSP Support Agent prompt
        </button>
      </div>
      <div>
        <Label htmlFor="welcomeMessage">Welcome Message</Label>
        <Input
          id="welcomeMessage"
          value={welcomeMessage}
          onChange={(e) => onWelcomeMessageChange(e.target.value)}
          placeholder="Enter the first message your agent will say"
        />
        <button
          onClick={useDefaultWelcome}
          className="text-sm text-primary hover:underline mt-2"
        >
          Use default: Professional greeting message
        </button>
      </div>
    </div>
  );
};
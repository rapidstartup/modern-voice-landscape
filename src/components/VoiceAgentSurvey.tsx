import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/components/ui/use-toast';
import { useNavigate } from 'react-router-dom';
import { VoiceStyles } from './voice-agent/VoiceStyles';
import { AgentPrompt } from './voice-agent/AgentPrompt';
import { supabase } from "@/integrations/supabase/client";

const steps = [
  { id: 1, title: "Business Details" },
  { id: 2, title: "Agent Configuration" },
  { id: 3, title: "Voice Selection" },
  { id: 4, title: "Knowledge Base" },
  { id: 5, title: "Review & Create" }
];

export const VoiceAgentSurvey = () => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState({
    businessName: '',
    agentName: '',
    primaryLanguage: 'en',
    voiceType: 'eleven_turbo_v2',
    voiceStyle: 'friendly',
    prompt: '',
    knowledgeBase: null as File | null,
    welcomeMessage: '',
  });

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setFormData(prev => ({ ...prev, knowledgeBase: file }));
      toast({
        title: "File uploaded",
        description: `${file.name} has been added to the knowledge base`,
      });
    }
  };

  const handleNext = async () => {
    if (currentStep < steps.length) {
      setCurrentStep(prev => prev + 1);
    } else {
      await handleCreateAgent();
    }
  };

  const handleCreateAgent = async () => {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session) {
        localStorage.setItem('pendingAgent', JSON.stringify(formData));
        toast({
          title: "Create an Account",
          description: "Please create an account to save and deploy your agent.",
        });
        navigate('/signup');
        return;
      }

      // Create agent with ElevenLabs
      const response = await fetch('/functions/v1/create_elevenlabs_agent', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${session.access_token}`
        },
        body: JSON.stringify({
          businessName: formData.businessName,
          agentName: formData.agentName,
          voiceStyle: formData.voiceStyle,
          prompt: formData.prompt,
          welcomeMessage: formData.welcomeMessage
        })
      });

      const { agent_id, error } = await response.json();
      
      if (error) throw new Error(error);

      // Save agent to database
      const { error: dbError } = await supabase.from('agents').insert({
        user_id: session.user.id,
        name: formData.businessName,
        business_name: formData.businessName,
        agent_name: formData.agentName,
        voice_style: formData.voiceStyle,
        prompt: formData.prompt,
        welcome_message: formData.welcomeMessage,
        elevenlabs_agent_id: agent_id
      });

      if (dbError) throw dbError;

      toast({
        title: "Agent Created Successfully",
        description: "Your agent has been saved and is ready for deployment.",
      });
      navigate('/dashboard');
    } catch (error) {
      console.error('Error creating agent:', error);
      toast({
        title: "Error",
        description: "Failed to create agent. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handlePrevious = () => {
    if (currentStep > 1) {
      setCurrentStep(prev => prev - 1);
    }
  };

  return (
    <div className="w-full max-w-2xl mx-auto bg-white rounded-xl shadow-lg p-8 animate-fade-up">
      <div className="mb-8">
        <div className="flex justify-between mb-4">
          {steps.map((step) => (
            <div
              key={step.id}
              className={`flex flex-col items-center ${
                step.id === currentStep ? 'text-primary' : 'text-muted'
              }`}
            >
              <div className={`w-3 h-3 rounded-full mb-2 ${
                step.id === currentStep ? 'bg-primary' : 'bg-muted'
              }`} />
              <span className="text-xs hidden md:block">{step.title}</span>
            </div>
          ))}
        </div>
        <h3 className="text-2xl font-semibold">{steps[currentStep - 1].title}</h3>
      </div>

      <div className="space-y-6">
        {currentStep === 1 && (
          <div className="space-y-4">
            <div>
              <Label htmlFor="businessName">Business Name</Label>
              <Input
                id="businessName"
                value={formData.businessName}
                onChange={(e) => setFormData({ ...formData, businessName: e.target.value })}
                placeholder="Enter your MSP business name"
              />
            </div>
            <div>
              <Label htmlFor="agentName">Agent Name</Label>
              <Input
                id="agentName"
                value={formData.agentName}
                onChange={(e) => setFormData({ ...formData, agentName: e.target.value })}
                placeholder="What would you like to name your agent?"
              />
            </div>
          </div>
        )}

        {currentStep === 2 && (
          <AgentPrompt
            businessName={formData.businessName}
            agentName={formData.agentName}
            prompt={formData.prompt}
            welcomeMessage={formData.welcomeMessage}
            onPromptChange={(value) => setFormData({ ...formData, prompt: value })}
            onWelcomeMessageChange={(value) => setFormData({ ...formData, welcomeMessage: value })}
          />
        )}

        {currentStep === 3 && (
          <VoiceStyles
            value={formData.voiceStyle}
            onChange={(value) => setFormData({ ...formData, voiceStyle: value })}
          />
        )}

        {currentStep === 4 && (
          <div className="space-y-4">
            <Label htmlFor="knowledgeBase">Upload Knowledge Base Documents</Label>
            <Input
              id="knowledgeBase"
              type="file"
              onChange={handleFileChange}
              accept=".pdf,.doc,.docx,.txt"
              className="cursor-pointer"
            />
            <p className="text-sm text-muted-foreground">
              Upload documentation about your services, common issues, and procedures.
              Supported formats: PDF, DOC, DOCX, TXT
            </p>
          </div>
        )}

        {currentStep === 5 && (
          <div className="space-y-4">
            <h4 className="font-semibold">Review Your Configuration</h4>
            <div className="space-y-2">
              <p><span className="font-medium">Business:</span> {formData.businessName}</p>
              <p><span className="font-medium">Agent Name:</span> {formData.agentName}</p>
              <p><span className="font-medium">Voice Style:</span> {formData.voiceStyle}</p>
              <p><span className="font-medium">Knowledge Base:</span> {formData.knowledgeBase?.name || 'No file uploaded'}</p>
            </div>
            <div className="mt-6">
              <p className="text-sm text-muted-foreground mb-4">
                Click "Create Agent" to save your configuration and proceed to create your account.
                Your agent will be ready for deployment after signup.
              </p>
            </div>
          </div>
        )}

        <div className="flex justify-between mt-8">
          <Button
            variant="outline"
            onClick={handlePrevious}
            disabled={currentStep === 1}
          >
            Previous
          </Button>
          <Button onClick={handleNext}>
            {currentStep === steps.length ? 'Create Agent' : 'Next'}
          </Button>
        </div>
      </div>
    </div>
  );
};

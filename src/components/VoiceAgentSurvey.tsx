import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { useToast } from '@/components/ui/use-toast';

const steps = [
  { id: 1, title: "Business Details" },
  { id: 2, title: "Agent Configuration" },
  { id: 3, title: "Voice Selection" },
  { id: 4, title: "Knowledge Base" },
  { id: 5, title: "Review & Create" }
];

export const VoiceAgentSurvey = () => {
  const { toast } = useToast();
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

  const handleNext = () => {
    if (currentStep < steps.length) {
      setCurrentStep(prev => prev + 1);
    } else {
      handleCreateAgent();
    }
  };

  const handlePrevious = () => {
    if (currentStep > 1) {
      setCurrentStep(prev => prev - 1);
    }
  };

  const handleCreateAgent = () => {
    // This will be implemented once we have authentication set up
    toast({
      title: "Authentication Required",
      description: "Please create an account to save your agent configuration.",
      variant: "default",
    });
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
          <div className="space-y-4">
            <div>
              <Label htmlFor="prompt">Agent Personality & Role</Label>
              <Textarea
                id="prompt"
                value={formData.prompt}
                onChange={(e) => setFormData({ ...formData, prompt: e.target.value })}
                placeholder="Describe how your agent should behave and handle customer service inquiries..."
                className="h-32"
              />
            </div>
            <div>
              <Label htmlFor="welcomeMessage">Welcome Message</Label>
              <Input
                id="welcomeMessage"
                value={formData.welcomeMessage}
                onChange={(e) => setFormData({ ...formData, welcomeMessage: e.target.value })}
                placeholder="Enter the first message your agent will say"
              />
            </div>
          </div>
        )}

        {currentStep === 3 && (
          <div className="space-y-4">
            <Label>Voice Style</Label>
            <RadioGroup
              value={formData.voiceStyle}
              onValueChange={(value) => setFormData({ ...formData, voiceStyle: value })}
              className="grid grid-cols-2 gap-4"
            >
              {['friendly', 'professional', 'energetic', 'calm'].map((style) => (
                <div key={style} className="flex items-center space-x-2">
                  <RadioGroupItem value={style} id={style} />
                  <Label htmlFor={style} className="capitalize">{style}</Label>
                </div>
              ))}
            </RadioGroup>
          </div>
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
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

const steps = [
  { id: 1, title: "Name your agent" },
  { id: 2, title: "Choose a voice" },
  { id: 3, title: "Define personality" },
];

export const VoiceAgentSurvey = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState({
    name: '',
    voice: 'friendly',
    personality: '',
  });

  const handleNext = () => {
    if (currentStep < steps.length) {
      setCurrentStep(prev => prev + 1);
    }
  };

  const handlePrevious = () => {
    if (currentStep > 1) {
      setCurrentStep(prev => prev - 1);
    }
  };

  return (
    <div className="w-full max-w-md mx-auto bg-white rounded-xl shadow-lg p-8 animate-fade-up">
      <div className="mb-8">
        <div className="flex justify-between mb-4">
          {steps.map((step) => (
            <div
              key={step.id}
              className={`w-3 h-3 rounded-full ${
                step.id === currentStep ? 'bg-primary' : 'bg-muted'
              }`}
            />
          ))}
        </div>
        <h3 className="text-xl font-semibold">{steps[currentStep - 1].title}</h3>
      </div>

      <div className="space-y-6">
        {currentStep === 1 && (
          <div className="space-y-4">
            <Label htmlFor="name">Agent Name</Label>
            <Input
              id="name"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              placeholder="Enter agent name"
            />
          </div>
        )}

        {currentStep === 2 && (
          <div className="space-y-4">
            <Label>Voice Type</Label>
            <div className="grid grid-cols-2 gap-4">
              {['friendly', 'professional', 'energetic', 'calm'].map((voice) => (
                <Button
                  key={voice}
                  variant={formData.voice === voice ? "default" : "outline"}
                  onClick={() => setFormData({ ...formData, voice })}
                  className="capitalize"
                >
                  {voice}
                </Button>
              ))}
            </div>
          </div>
        )}

        {currentStep === 3 && (
          <div className="space-y-4">
            <Label htmlFor="personality">Personality Description</Label>
            <textarea
              id="personality"
              value={formData.personality}
              onChange={(e) => setFormData({ ...formData, personality: e.target.value })}
              className="w-full h-32 p-2 border rounded-md"
              placeholder="Describe your agent's personality..."
            />
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
            {currentStep === steps.length ? 'Finish' : 'Next'}
          </Button>
        </div>
      </div>
    </div>
  );
};
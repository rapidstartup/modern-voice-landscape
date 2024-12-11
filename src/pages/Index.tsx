import React from 'react';
import { MovableHeadline } from '@/components/MovableHeadline';
import { VoiceAgentSurvey } from '@/components/VoiceAgentSurvey';
import { Button } from '@/components/ui/button';

const Index = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-white to-muted">
      {/* Hero Section */}
      <header className="container mx-auto px-4 py-20 text-center">
        <MovableHeadline />
        <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
          Build lifelike AI voices in minutes. Perfect for virtual assistants,
          storytelling, and educational content.
        </p>
        <Button size="lg" className="bg-accent hover:bg-accent/90">
          Get Started Free
        </Button>
      </header>

      {/* Survey Section */}
      <section className="container mx-auto px-4 py-20">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold mb-4">Create Your Voice Agent</h2>
          <p className="text-gray-600">
            Follow these simple steps to bring your AI assistant to life
          </p>
        </div>
        <VoiceAgentSurvey />
      </section>

      {/* Features Section */}
      <section className="container mx-auto px-4 py-20 bg-white">
        <div className="grid md:grid-cols-3 gap-8">
          {[
            {
              title: "Natural Conversations",
              description: "AI-powered voices that sound incredibly human-like",
            },
            {
              title: "Custom Personalities",
              description: "Design unique character traits and speaking styles",
            },
            {
              title: "Easy Integration",
              description: "Simple API to add voice capabilities to any project",
            },
          ].map((feature) => (
            <div
              key={feature.title}
              className="p-6 rounded-xl bg-muted hover:shadow-lg transition-shadow duration-300"
            >
              <h3 className="text-xl font-semibold mb-3">{feature.title}</h3>
              <p className="text-gray-600">{feature.description}</p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA Section */}
      <section className="container mx-auto px-4 py-20 text-center">
        <h2 className="text-3xl font-bold mb-4">Ready to Get Started?</h2>
        <p className="text-xl text-gray-600 mb-8">
          Join thousands of creators building the next generation of voice AI
        </p>
        <Button size="lg" className="bg-accent hover:bg-accent/90">
          Start Creating Now
        </Button>
      </section>
    </div>
  );
};

export default Index;
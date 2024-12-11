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
          Transform your business operations with AI-powered virtual employees. 
          From intelligent phone systems to automated workflow management, 
          deploy enterprise-grade AI agents that work 24/7.
        </p>
        <Button size="lg" className="bg-accent hover:bg-accent/90">
          Deploy Your First Agent
        </Button>
      </header>

      {/* Survey Section */}
      <section className="container mx-auto px-4 py-20">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold mb-4">Configure Your Enterprise Agent</h2>
          <p className="text-gray-600">
            Customize your AI agent's capabilities, knowledge base, and communication style
          </p>
        </div>
        <VoiceAgentSurvey />
      </section>

      {/* Features Section */}
      <section className="container mx-auto px-4 py-20 bg-white">
        <div className="grid md:grid-cols-3 gap-8">
          {[
            {
              title: "24/7 Phone Support",
              description: "Handle customer calls, schedule appointments, and manage support tickets automatically",
            },
            {
              title: "Workflow Automation",
              description: "Streamline operations with AI agents that handle repetitive tasks and complex workflows",
            },
            {
              title: "Enterprise Integration",
              description: "Seamlessly connect with your existing tools, CRM, and business systems",
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
        <h2 className="text-3xl font-bold mb-4">Ready to Transform Your Operations?</h2>
        <p className="text-xl text-gray-600 mb-8">
          Join leading enterprises using AI agents to scale their business
        </p>
        <Button size="lg" className="bg-accent hover:bg-accent/90">
          Deploy Now
        </Button>
      </section>
    </div>
  );
};

export default Index;
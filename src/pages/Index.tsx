import React from 'react';
import { MovableHeadline } from '@/components/MovableHeadline';
import { VoiceAgentSurvey } from '@/components/VoiceAgentSurvey';
import { Button } from '@/components/ui/button';

const Index = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-white to-muted flex flex-col">
      <div className="flex-grow">
        {/* Hero Section */}
        <header className="container mx-auto px-4 py-20 text-center">
          <MovableHeadline />
          <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
            Transform your MSP operations with AI-powered virtual employees. 
            From intelligent phone systems to automated PSA ticket management, 
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
              Customize your AI agent's capabilities, PSA integration, and communication style
            </p>
          </div>
          <VoiceAgentSurvey />
        </section>

        {/* Features Section */}
        <section className="container mx-auto px-4 py-20 bg-white">
          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                title: "24/7 MSP Help Desk",
                description: "Handle client support calls and automatically create & update tickets in your PSA system",
              },
              {
                title: "PSA Integration",
                description: "Seamlessly connects with ConnectWise, Autotask, and other leading PSA platforms",
              },
              {
                title: "Workflow Automation",
                description: "Streamline MSP operations with AI agents that handle L1 support and routine maintenance",
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
          <h2 className="text-3xl font-bold mb-4">Ready to Transform Your MSP?</h2>
          <p className="text-xl text-gray-600 mb-8">
            Join leading MSPs using AI agents to scale their support operations
          </p>
          <Button size="lg" className="bg-accent hover:bg-accent/90">
            Deploy Now
          </Button>
        </section>
      </div>

      {/* Footer */}
      <footer className="bg-dark text-white py-16">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <h3 className="font-bold text-lg mb-4">Platform</h3>
              <ul className="space-y-2">
                <li>AI Phone Agents</li>
                <li>PSA Integration</li>
                <li>Workflow Automation</li>
                <li>Enterprise Security</li>
              </ul>
            </div>
            <div>
              <h3 className="font-bold text-lg mb-4">PSA Integrations</h3>
              <ul className="space-y-2">
                <li>ConnectWise Manage</li>
                <li>Datto Autotask</li>
                <li>Kaseya BMS</li>
                <li>HaloPSA</li>
              </ul>
            </div>
            <div>
              <h3 className="font-bold text-lg mb-4">Resources</h3>
              <ul className="space-y-2">
                <li>Documentation</li>
                <li>API Reference</li>
                <li>MSP Success Stories</li>
                <li>Support Center</li>
              </ul>
            </div>
            <div>
              <h3 className="font-bold text-lg mb-4">Company</h3>
              <ul className="space-y-2">
                <li>About Us</li>
                <li>Contact</li>
                <li>Privacy Policy</li>
                <li>Terms of Service</li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-700 mt-12 pt-8 text-center text-sm">
            <p>© 2024 AI Voice Agents for MSPs. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from "@/integrations/supabase/client";
import { useQuery } from '@tanstack/react-query';

const Dashboard = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const checkAuth = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        navigate('/signup');
      }
    };
    checkAuth();
  }, [navigate]);

  const { data: agents, isLoading } = useQuery({
    queryKey: ['agents'],
    queryFn: async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) return [];
      
      const { data, error } = await supabase
        .from('agents')
        .select('*')
        .eq('user_id', session.user.id);
        
      if (error) throw error;
      return data;
    }
  });

  useEffect(() => {
    // Load the ElevenLabs widget script
    const script = document.createElement('script');
    script.src = 'https://elevenlabs.io/convai-widget/index.js';
    script.async = true;
    document.body.appendChild(script);

    return () => {
      document.body.removeChild(script);
    };
  }, []);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Your Voice Agents</h1>
      
      {agents?.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-lg text-muted-foreground mb-4">You haven't created any voice agents yet.</p>
          <button
            onClick={() => navigate('/')}
            className="inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-primary text-primary-foreground hover:bg-primary/90 h-10 px-4 py-2"
          >
            Create Your First Agent
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-6">
          {agents?.map((agent) => (
            <div
              key={agent.id}
              className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow"
            >
              <h3 className="text-xl font-semibold mb-2">{agent.name}</h3>
              <p className="text-muted-foreground mb-4">Business: {agent.business_name}</p>
              <div className="space-y-2 mb-4">
                <p><span className="font-medium">Agent Name:</span> {agent.agent_name}</p>
                <p><span className="font-medium">Voice Style:</span> {agent.voice_style}</p>
              </div>
              <div className="mt-4 p-4 bg-gray-50 rounded-lg">
                <h4 className="font-medium mb-2">Embed Code</h4>
                <div 
                  dangerouslySetInnerHTML={{ 
                    __html: `<elevenlabs-convai agent-id="${agent.id}"></elevenlabs-convai>`
                  }} 
                />
                <div className="mt-4">
                  <p className="text-sm text-muted-foreground">
                    Copy this code to embed your agent on your website:
                  </p>
                  <pre className="mt-2 p-3 bg-gray-100 rounded text-sm overflow-x-auto">
                    {`<elevenlabs-convai agent-id="${agent.id}"></elevenlabs-convai>\n<script src="https://elevenlabs.io/convai-widget/index.js" async type="text/javascript"></script>`}
                  </pre>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Dashboard;
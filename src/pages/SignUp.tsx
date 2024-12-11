import { Auth } from '@supabase/auth-ui-react';
import { ThemeSupa } from '@supabase/auth-ui-shared';
import { supabase } from '@/integrations/supabase/client';
import { useNavigate } from 'react-router-dom';
import { useEffect } from 'react';
import { useToast } from '@/components/ui/use-toast';

const SignUp = () => {
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      console.log('Auth state changed:', event, session?.user?.id);
      
      if (event === 'SIGNED_IN') {
        const pendingAgent = localStorage.getItem('pendingAgent');
        
        if (pendingAgent) {
          console.log('Found pending agent, creating it now');
          try {
            const agentData = JSON.parse(pendingAgent);
            
            // Create agent with ElevenLabs
            const response = await fetch('/functions/v1/create_elevenlabs_agent', {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${session.access_token}`
              },
              body: JSON.stringify({
                businessName: agentData.businessName,
                agentName: agentData.agentName,
                voiceStyle: agentData.voiceStyle,
                prompt: agentData.prompt,
                welcomeMessage: agentData.welcomeMessage
              })
            });

            if (!response.ok) {
              throw new Error('Failed to create ElevenLabs agent');
            }

            const { agent_id } = await response.json();

            // Save agent to database
            const { error: dbError } = await supabase.from('agents').insert({
              user_id: session.user.id,
              name: agentData.businessName,
              business_name: agentData.businessName,
              agent_name: agentData.agentName,
              voice_style: agentData.voiceStyle,
              prompt: agentData.prompt,
              welcome_message: agentData.welcomeMessage,
              elevenlabs_agent_id: agent_id
            });

            if (dbError) throw dbError;

            localStorage.removeItem('pendingAgent');
            toast({
              title: "Agent Created Successfully",
              description: "Your agent has been created and saved to your account.",
            });
          } catch (error) {
            console.error('Error creating pending agent:', error);
            toast({
              title: "Error",
              description: "Failed to create your pending agent. Please try again from the dashboard.",
              variant: "destructive",
            });
          }
        }
        
        navigate('/dashboard');
      }
    });

    return () => subscription.unsubscribe();
  }, [navigate, toast]);

  return (
    <div className="max-w-md mx-auto mt-20 p-8 bg-white rounded-xl shadow-lg">
      <h1 className="text-2xl font-bold mb-8 text-center">Create Your Account</h1>
      <Auth
        supabaseClient={supabase}
        appearance={{ theme: ThemeSupa }}
        theme="light"
        providers={[]}
      />
    </div>
  );
};

export default SignUp;
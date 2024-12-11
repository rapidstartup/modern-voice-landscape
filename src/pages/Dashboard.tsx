import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from "@/integrations/supabase/client";
import { useQuery, useQueryClient } from '@tanstack/react-query';
import type { Database } from '@/integrations/supabase/types';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { Pencil, Trash2 } from 'lucide-react';

type Agent = Database['public']['Tables']['agents']['Row'];

const Dashboard = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [editingAgent, setEditingAgent] = useState<Agent | null>(null);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);

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
      return data as Agent[];
    }
  });

  const handleEdit = async (formData: Partial<Agent>) => {
    try {
      if (!editingAgent) return;

      const { error } = await supabase
        .from('agents')
        .update({
          name: formData.name,
          business_name: formData.business_name,
          agent_name: formData.agent_name,
          prompt: formData.prompt,
          welcome_message: formData.welcome_message
        })
        .eq('id', editingAgent.id);

      if (error) throw error;

      toast({
        title: "Success",
        description: "Agent updated successfully",
      });

      queryClient.invalidateQueries({ queryKey: ['agents'] });
      setIsEditDialogOpen(false);
      setEditingAgent(null);
    } catch (error) {
      console.error('Error updating agent:', error);
      toast({
        title: "Error",
        description: "Failed to update agent",
        variant: "destructive",
      });
    }
  };

  const handleDelete = async (agentId: string) => {
    if (!window.confirm('Are you sure you want to delete this agent?')) return;

    try {
      const { error } = await supabase
        .from('agents')
        .delete()
        .eq('id', agentId);

      if (error) throw error;

      toast({
        title: "Success",
        description: "Agent deleted successfully",
      });

      queryClient.invalidateQueries({ queryKey: ['agents'] });
    } catch (error) {
      console.error('Error deleting agent:', error);
      toast({
        title: "Error",
        description: "Failed to delete agent",
        variant: "destructive",
      });
    }
  };

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
          <Button onClick={() => navigate('/')}>
            Create Your First Agent
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-6">
          {agents?.map((agent) => (
            <div
              key={agent.id}
              className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow"
            >
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="text-xl font-semibold">{agent.name}</h3>
                  <p className="text-muted-foreground">Business: {agent.business_name}</p>
                </div>
                <div className="flex gap-2">
                  <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
                    <DialogTrigger asChild>
                      <Button
                        variant="outline"
                        size="icon"
                        onClick={() => setEditingAgent(agent)}
                      >
                        <Pencil className="h-4 w-4" />
                      </Button>
                    </DialogTrigger>
                    {editingAgent && (
                      <DialogContent>
                        <DialogHeader>
                          <DialogTitle>Edit Agent</DialogTitle>
                        </DialogHeader>
                        <form
                          onSubmit={(e) => {
                            e.preventDefault();
                            const formData = new FormData(e.currentTarget);
                            handleEdit({
                              name: formData.get('name') as string,
                              business_name: formData.get('business_name') as string,
                              agent_name: formData.get('agent_name') as string,
                              prompt: formData.get('prompt') as string,
                              welcome_message: formData.get('welcome_message') as string,
                            });
                          }}
                          className="space-y-4"
                        >
                          <div>
                            <Label htmlFor="name">Name</Label>
                            <Input
                              id="name"
                              name="name"
                              defaultValue={editingAgent.name}
                              required
                            />
                          </div>
                          <div>
                            <Label htmlFor="business_name">Business Name</Label>
                            <Input
                              id="business_name"
                              name="business_name"
                              defaultValue={editingAgent.business_name}
                              required
                            />
                          </div>
                          <div>
                            <Label htmlFor="agent_name">Agent Name</Label>
                            <Input
                              id="agent_name"
                              name="agent_name"
                              defaultValue={editingAgent.agent_name}
                              required
                            />
                          </div>
                          <div>
                            <Label htmlFor="prompt">Prompt</Label>
                            <Textarea
                              id="prompt"
                              name="prompt"
                              defaultValue={editingAgent.prompt || ''}
                            />
                          </div>
                          <div>
                            <Label htmlFor="welcome_message">Welcome Message</Label>
                            <Input
                              id="welcome_message"
                              name="welcome_message"
                              defaultValue={editingAgent.welcome_message || ''}
                            />
                          </div>
                          <Button type="submit" className="w-full">
                            Save Changes
                          </Button>
                        </form>
                      </DialogContent>
                    )}
                  </Dialog>
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => handleDelete(agent.id)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
              <div className="space-y-2 mb-4">
                <p><span className="font-medium">Agent Name:</span> {agent.agent_name}</p>
                <p><span className="font-medium">Voice Style:</span> {agent.voice_style}</p>
              </div>
              {agent.elevenlabs_agent_id && (
                <div className="mt-4 p-4 bg-gray-50 rounded-lg">
                  <h4 className="font-medium mb-2">Embed Code</h4>
                  <div className="mt-4">
                    <p className="text-sm text-muted-foreground">
                      Copy this code to embed your agent on your website:
                    </p>
                    <pre className="mt-2 p-3 bg-gray-100 rounded text-sm overflow-x-auto">
                      {`<elevenlabs-convai agent-id="${agent.elevenlabs_agent_id}"></elevenlabs-convai>\n<script src="https://elevenlabs.io/convai-widget/index.js" async type="text/javascript"></script>`}
                    </pre>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Dashboard;
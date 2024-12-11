import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const { businessName, agentName, voiceStyle, prompt, welcomeMessage } = await req.json()
    
    // Get ElevenLabs API key from secrets
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    )

    const { data: secretData } = await supabaseClient
      .from('secrets')
      .select('value')
      .eq('name', 'ELEVENLABS_API_KEY')
      .single()

    if (!secretData?.value) {
      throw new Error('ElevenLabs API key not found')
    }

    // Voice IDs mapping
    const voiceIds = {
      friendly: 'cjVigY5qzO86Huf0OWal',
      energetic: 'cgSgspJ2msm6clMCkdW9',
      professional: 'iP95p4xoKVk53GoZ742B',
      calm: 'CwhRBWXzGAHq8TQ4Fs17'
    }

    // Create agent configuration
    const agentConfig = {
      conversation_config: {
        agent: {
          prompt: {
            prompt: prompt || `You are ${agentName}, a helpful AI assistant for ${businessName}.`,
            llm: "gpt-4o-mini",
            temperature: 0,
            max_tokens: -1
          },
          first_message: welcomeMessage || `Hello! I'm ${agentName}, how can I help you today?`,
          language: "en"
        },
        asr: {
          quality: "high",
          provider: "elevenlabs",
          user_input_audio_format: "pcm_16000"
        },
        tts: {
          model_id: "eleven_turbo_v2",
          voice_id: voiceIds[voiceStyle as keyof typeof voiceIds],
          agent_output_audio_format: "pcm_16000",
          stability: 0.5,
          similarity_boost: 0.8
        },
        conversation: {
          max_duration_seconds: 600
        }
      },
      platform_settings: {
        auth: {
          enable_auth: false
        },
        widget: {
          variant: "compact",
          avatar: {
            type: "orb",
            color_1: "#2792dc",
            color_2: "#9ce6e6"
          }
        }
      },
      name: agentName
    }

    // Create agent using ElevenLabs API
    const response = await fetch('https://api.elevenlabs.io/v1/convai/agents/create', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'xi-api-key': secretData.value
      },
      body: JSON.stringify(agentConfig)
    })

    const data = await response.json()

    return new Response(
      JSON.stringify(data),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      },
    )
  } catch (error) {
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 400,
      },
    )
  }
})
import { useConversation } from '@elevenlabs/react';
import { useState, useEffect, useRef } from 'react';

interface AgentChatProps {
  agentId: string;
}

export const AgentChat = ({ agentId }: AgentChatProps) => {
  const [status, setStatus] = useState<'idle' | 'connecting' | 'connected' | 'disconnected'>('idle');
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [transcript, setTranscript] = useState<string[]>([]);
  const [showTranscript, setShowTranscript] = useState(true);
  const transcriptRef = useRef<HTMLDivElement>(null);

  // Auto-scroll transcript to bottom
  useEffect(() => {
    if (transcriptRef.current) {
      transcriptRef.current.scrollTop = transcriptRef.current.scrollHeight;
    }
  }, [transcript]);

  const conversation = useConversation({
    // Client tool for agent to end conversation
    clientTools: {
      endConversation: () => {
        console.log('Agent ended conversation');
        handleEndConversation();
        return 'Conversation ended successfully';
      },
    },
    onConnect: () => {
      console.log('Agent connected');
      setStatus('connected');
      setTranscript([]); // Clear transcript on new connection
    },
    onDisconnect: () => {
      console.log('Agent disconnected');
      setStatus('disconnected');
    },
    onMessage: (message) => {
      console.log('Message received:', message);
      if (message.message) {
        setTranscript(prev => [...prev, message.message]);
      }
    },
    onError: (error) => {
      console.error('Agent error:', error);
    },
    onModeChange: (mode) => {
      console.log('Mode changed:', mode);
      setIsSpeaking(mode.mode === 'speaking');
    },
  });

  const handleStartConversation = async () => {
    try {
      setStatus('connecting');
      // Request microphone permission
      await navigator.mediaDevices.getUserMedia({ audio: true });

      // Start conversation with agent
      await conversation.startSession({
        agentId: agentId,
        connectionType: 'webrtc',
      });
    } catch (error) {
      console.error('Failed to start conversation:', error);
      setStatus('idle');
      alert('Failed to start conversation. Please check microphone permissions.');
    }
  };

  const handleEndConversation = async () => {
    await conversation.endSession();
    setStatus('idle');
  };

  return (
    <div className="flex flex-col items-center gap-6 w-full max-w-2xl mx-auto p-6">
      {/* Status Bar */}
      <div className="w-full flex justify-between items-center">
        <span className="text-sm font-medium text-white/60">Agent Status:</span>
        <div className="flex gap-3 items-center">
          {transcript.length > 0 && (
            <button
              onClick={() => setShowTranscript(!showTranscript)}
              className="px-3 py-1 rounded-full text-xs font-medium bg-white/10 hover:bg-white/20 text-white/80 transition-colors"
            >
              {showTranscript ? 'Hide Transcript' : 'Show Transcript'}
            </button>
          )}
          <span className={`px-3 py-1 rounded-full text-xs font-medium ${status === 'connected' ? 'bg-green-500/20 text-green-400' :
            status === 'connecting' ? 'bg-yellow-500/20 text-yellow-400' :
              'bg-gray-500/20 text-gray-400'
            }`}>
            {status.toUpperCase()}
          </span>
        </div>
      </div>

      {/* Conversation Transcript */}
      {transcript.length > 0 && showTranscript && (
        <div
          ref={transcriptRef}
          className="w-full bg-black/40 backdrop-blur-xl border border-white/10 rounded-2xl p-6 max-h-96 overflow-y-auto scroll-smooth"
        >
          <div className="space-y-3">
            {transcript.map((msg, i) => (
              <div key={i} className="text-white/80 text-sm leading-relaxed">
                {msg}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Microphone Control */}
      <div className="relative group">
        {/* Glow Effect */}
        <div className={`absolute -inset-6 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full blur-2xl opacity-30 group-hover:opacity-50 transition-opacity duration-500 ${isSpeaking ? 'opacity-60 animate-pulse' : ''
          }`}></div>

        <button
          onClick={status === 'connected' ? handleEndConversation : handleStartConversation}
          disabled={status === 'connecting'}
          className={`relative w-24 h-24 md:w-32 md:h-32 rounded-full flex items-center justify-center transition-all duration-300 transform hover:scale-105 active:scale-95 border-2 ${status === 'connected'
            ? 'bg-red-600 hover:bg-red-700 border-red-400 shadow-2xl shadow-red-500/50'
            : 'bg-gradient-to-br from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 border-white/20 shadow-2xl shadow-blue-500/30'
            } disabled:opacity-50 disabled:cursor-not-allowed`}
        >
          {status === 'connecting' ? (
            <div className="w-8 h-8 border-4 border-white/30 border-t-white rounded-full animate-spin" />
          ) : status === 'connected' ? (
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-12 h-12 text-white">
              <path strokeLinecap="round" strokeLinejoin="round" d="M5.25 7.5A2.25 2.25 0 017.5 5.25h9a2.25 2.25 0 012.25 2.25v9a2.25 2.25 0 01-2.25 2.25h-9a2.25 2.25 0 01-2.25-2.25v-9z" />
            </svg>
          ) : (
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-12 h-12 text-white">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 18.75a6 6 0 006-6v-1.5m-6 7.5a6 6 0 01-6-6v-1.5m6 7.5v3.75m-3.75 0h7.5M12 1.5a6 6 0 00-6 6v1.5a6 6 0 006 6 6 6 0 006-6v-1.5a6 6 0 00-6-6z" />
            </svg>
          )}
        </button>
      </div>

      <p className="text-white/40 text-sm font-light tracking-widest uppercase">
        {status === 'connected' ? (isSpeaking ? 'Speaking...' : 'Listening...') : 'Click to Start'}
      </p>

      {/* Hint */}
      {status === 'connected' && (
        <p className="text-white/30 text-xs text-center max-w-md">
          💡 Say "goodbye" or "thank you" and Kora will intelligently end the conversation
        </p>
      )}
    </div>
  );
};

import { useState } from 'react'
import { AgentChat } from './components/AgentChat'

function App() {
  const [agentId, setAgentId] = useState<string>('')
  const [isConfigured, setIsConfigured] = useState(false)

  const handleSetAgentId = () => {
    if (agentId.trim()) {
      setIsConfigured(true)
    }
  }

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white flex flex-col font-sans overflow-hidden">
      {/* Dynamic Background Aura */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-900/10 via-purple-900/10 to-transparent pointer-events-none" />

      {/* Header */}
      <header className="absolute top-6 w-full flex justify-center z-10">
        <div className="px-6 py-2 rounded-full backdrop-blur-md border border-white/10 bg-white/5">
          <h1 className="text-xl md:text-2xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
            Kora Voice Assistant
          </h1>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 flex flex-col items-center justify-center px-4 relative z-0">
        {!isConfigured ? (
          <div className="max-w-md w-full space-y-6 bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-8">
            <div>
              <h2 className="text-2xl font-bold mb-2">Configure Agent</h2>
              <p className="text-sm text-white/60">
                Enter your ElevenLabs Agent ID to get started
              </p>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2 text-white/80">
                  Agent ID
                </label>
                <input
                  type="text"
                  value={agentId}
                  onChange={(e) => setAgentId(e.target.value)}
                  placeholder="Enter your agent ID"
                  className="w-full px-4 py-3 bg-black/40 border border-white/10 rounded-lg text-white placeholder-white/30 focus:outline-none focus:ring-2 focus:ring-blue-500/50"
                  onKeyPress={(e) => e.key === 'Enter' && handleSetAgentId()}
                />
              </div>

              <button
                onClick={handleSetAgentId}
                className="w-full py-3 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 rounded-lg font-medium transition-all duration-200 transform hover:scale-105"
              >
                Start Kora
              </button>
            </div>

            <div className="pt-4 border-t border-white/10">
              <p className="text-xs text-white/40">
                Don't have an agent ID?{' '}
                <a
                  href="https://elevenlabs.io/app/agents"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-400 hover:text-blue-300 underline"
                >
                  Create one in ElevenLabs
                </a>
              </p>
            </div>
          </div>
        ) : (
          <AgentChat agentId={agentId} />
        )}
      </main>

      {/* Footer */}
      <footer className="absolute bottom-4 w-full flex justify-center z-10">
        <p className="text-xs text-white/30">
          Powered by ElevenLabs Conversational AI + Google Gemini
        </p>
      </footer>
    </div>
  )
}

export default App

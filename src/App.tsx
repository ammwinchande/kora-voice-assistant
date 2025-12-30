import { useState, useEffect, useRef } from 'react'
import { useAudioRecorder } from './hooks/useAudioRecorder'
import { AudioVisualizer } from './components/AudioVisualizer'

interface Message {
  type: 'text' | 'audio' | 'end_of_turn' | 'transcript';
  content?: string;
}

function App() {
  const [messages, setMessages] = useState<string[]>([])
  const [status, setStatus] = useState<string>('Disconnected')
  const wsRef = useRef<WebSocket | null>(null)

  // Audio Queue Management
  const audioQueueRef = useRef<string[]>([])
  const isPlayingRef = useRef(false)

  // Transcript Visibility
  const [showTranscript, setShowTranscript] = useState(false);

  // Function to play next audio in queue
  const playNextAudio = async () => {
    if (isPlayingRef.current || audioQueueRef.current.length === 0) return

    isPlayingRef.current = true
    const audioContent = audioQueueRef.current.shift()

    if (audioContent) {
      try {
        const audioData = atob(audioContent)
        const arrayBuffer = new ArrayBuffer(audioData.length)
        const view = new Uint8Array(arrayBuffer)
        for (let i = 0; i < audioData.length; i++) {
          view[i] = audioData.charCodeAt(i)
        }
        const blob = new Blob([arrayBuffer], { type: 'audio/mpeg' })
        const url = URL.createObjectURL(blob)
        const audio = new Audio(url)

        audio.onended = () => {
          isPlayingRef.current = false
          playNextAudio() // Play next chunk
        }

        await audio.play()
      } catch (e) {
        console.error("Error playing audio chunk", e)
        isPlayingRef.current = false
        playNextAudio()
      }
    } else {
      isPlayingRef.current = false
    }
  }

  const handleAudioData = (blob: Blob) => {
    if (wsRef.current && wsRef.current.readyState === WebSocket.OPEN) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64Audio = (reader.result as string).split(',')[1];
        wsRef.current?.send(JSON.stringify({
          type: 'audio_input',
          content: base64Audio
        }));
      };
      reader.readAsDataURL(blob);
    }
  };

  const { isRecording, startRecording, stopRecording, analyser } = useAudioRecorder({ onAudioData: handleAudioData });

  const handleStopRecording = () => {
    stopRecording()
    if (wsRef.current?.readyState === WebSocket.OPEN) {
      setTimeout(() => {
        wsRef.current?.send(JSON.stringify({ type: 'end_of_speech' }))
      }, 250)
    }
  }

  useEffect(() => {
    // Connect to WebSocket
    const ws = new WebSocket('ws://localhost:8001/ws/chat')
    wsRef.current = ws

    ws.onopen = () => {
      setStatus('Connected')
      console.log('Connected to WebSocket')
    }

    ws.onmessage = (event) => {
      try {
        const data: Message = JSON.parse(event.data)

        if (data.type === 'text' && data.content) {
          setMessages((prev) => [...prev, `AI: ${data.content}`])
        } else if (data.type === 'transcript' && data.content) {
          setMessages((prev) => [...prev, `You: ${data.content}`])
        } else if (data.type === 'audio' && data.content) {
          audioQueueRef.current.push(data.content)
          playNextAudio()
        } else if (data.type === 'end_of_turn') {
          console.log("End of turn")
        }
      } catch (e) {
        console.log("Received raw text:", event.data)
      }
    }

    ws.onclose = () => {
      setStatus('Disconnected')
      console.log('Disconnected from WebSocket')
    }

    return () => {
      ws.close()
    }
  }, [])

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white flex flex-col font-sans overflow-hidden">
      {/* Dynamic Background Aura */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-900/10 via-purple-900/10 to-transparent pointer-events-none" />

      {/* Header / Status Pill */}
      <header className="absolute top-6 w-full flex justify-center z-10">
        <div className={`px-4 py-1.5 rounded-full backdrop-blur-md border border-white/10 text-xs font-medium tracking-wide
            ${status === 'Connected' ? 'bg-green-500/10 text-green-400' : 'bg-red-500/10 text-red-400'}`}>
          {status === 'Connected' ? 'KORA ONLINE' : 'OFFLINE'}
        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col items-center justify-end pb-12 relative px-4 z-0">

        {/* Transcript Overlay (Collapsible) */}
        {showTranscript && messages.length > 0 && (
          <div className="absolute top-20 bottom-80 w-full max-w-2xl bg-black/40 backdrop-blur-xl border border-white/10 rounded-2xl p-6 overflow-y-auto mb-8 shadow-2xl animate-fade-in-up">
            <div className="space-y-4 font-light text-sm md:text-base">
              {messages.map((msg, i) => (
                <div key={i} className={`flex ${msg.startsWith('You:') ? 'justify-end' : 'justify-start'}`}>
                  <div className={`max-w-[80%] rounded-2xl px-4 py-3 ${msg.startsWith('You:') ? 'bg-white/10 rounded-br-none' : 'bg-blue-600/20 rounded-bl-none text-blue-100'}`}>
                    {msg.replace(/^(You:|AI:)\s*/, '')}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Floating Toggle for Transcript */}
        {messages.length > 0 && (
          <button
            onClick={() => setShowTranscript(!showTranscript)}
            className="absolute top-24 right-4 md:right-12 p-2 bg-white/5 hover:bg-white/10 rounded-full transition-colors text-white/50 hover:text-white"
          >
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 12.76c0 1.6 1.123 2.994 2.707 3.227 1.068.157 2.148.279 3.238.364.466.037.893.281 1.153.671L12 21l2.652-3.978c.26-.39.687-.634 1.153-.67 1.09-.086 2.17-.208 3.238-.365 1.584-.233 2.707-1.626 2.707-3.228V6.741c0-1.602-1.123-2.995-2.707-3.228A48.394 48.394 0 0012 3c-2.392 0-4.744.175-7.043.513C3.373 3.746 2.25 5.14 2.25 6.741v6.018z" />
            </svg>
          </button>
        )}


        {/* Visualizer & Controls Container */}
        <div className="w-full max-w-lg mx-auto flex flex-col items-center gap-8">

          {/* Audio Visualizer */}
          <div className="w-full h-40 flex items-center justify-center pointer-events-none">
            <AudioVisualizer isRecording={isRecording} analyser={analyser} />
          </div>

          {/* Mic Interaction Area */}
          <div className="relative group">
            {/* Glow Effect */}
            <div className={`absolute -inset-4 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full blur-xl opacity-20 group-hover:opacity-40 transition-opacity duration-500 ${isRecording ? 'opacity-60 animate-pulse' : ''}`}></div>

            <button
              onMouseDown={startRecording}
              onMouseUp={handleStopRecording}
              onTouchStart={startRecording}
              onTouchEnd={handleStopRecording}
              disabled={status !== 'Connected'}
              className={`relative w-20 h-20 md:w-24 md:h-24 rounded-full flex items-center justify-center transition-all duration-300 transform active:scale-95 border border-white/10
                        ${isRecording
                  ? 'bg-white text-black scale-105 shadow-2xl shadow-white/20'
                  : 'bg-white/5 hover:bg-white/10 text-white backdrop-blur-md'
                } disabled:opacity-30 disabled:cursor-not-allowed`}
            >
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={isRecording ? 2.5 : 1.5} stroke="currentColor" className="w-8 h-8 md:w-10 md:h-10">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 18.75a6 6 0 006-6v-1.5m-6 7.5a6 6 0 01-6-6v-1.5m6 7.5v3.75m-3.75 0h7.5M12 1.5a6 6 0 00-6 6v1.5a6 6 0 006 6 6 6 0 006-6v-1.5a6 6 0 00-6-6z" />
              </svg>
            </button>
          </div>

          <p className="text-white/40 text-sm font-light tracking-widest uppercase">
            {isRecording ? 'Listening...' : 'Hold to Speak'}
          </p>

        </div>
      </main>
    </div>
  )
}

export default App

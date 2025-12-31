# Kora Voice Assistant 🎙️

> A voice-first AI support assistant powered by **ElevenLabs Conversational AI** and **Google Cloud Gemini**.

Built for the [AI Partner Catalyst Hackathon](https://ai-partner-catalyst.devpost.com/) - ElevenLabs Challenge.

## 🎯 What is Kora?

Kora is an intelligent voice assistant that demonstrates the power of combining:
- **ElevenLabs Agents Platform** - Natural voice conversations
- **Google Cloud Vertex AI (Gemini)** - Advanced reasoning and knowledge
- **React** - Modern, responsive web interface

## ✨ Features

- 🎤 **Voice-First Interface** - Natural conversation with AI
- 🧠 **Intelligent Responses** - Powered by Gemini
- 🎨 **Beautiful UI** - Modern, gradient-based design
- ⚡ **Real-Time** - Instant voice responses via WebSocket
- 📱 **Responsive** - Works on desktop and mobile browsers

## 🏗️ Architecture

```
┌─────────────┐       ┌──────────────────┐       ┌─────────────┐
│   Browser   │◄─────►│  ElevenLabs      │◄─────►│   Gemini    │
│   (React)   │ WS    │  Agent Platform  │  API  │   (LLM)     │
└─────────────┘       └──────────────────┘       └─────────────┘
```

- **Frontend**: React + TypeScript + ElevenLabs React SDK
- **Voice**: ElevenLabs Conversational AI (WebSocket)
- **Intelligence**: Google Cloud Vertex AI (Gemini) or ElevenLabs default LLM
- **Styling**: Tailwind CSS

## 🚀 Quick Start

### Prerequisites

- Node.js 18+ 
- ElevenLabs account with API access
- Web browser with microphone

### Setup

1. **Clone the repository**
   ```bash
   git clone https://github.com/ammwinchande/kora-voice-assistant.git
   cd kora-voice-assistant/frontend
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Create an ElevenLabs Agent**
   - Go to [ElevenLabs Agents](https://elevenlabs.io/app/agents)
   - Create a Business agent
   - Configure with the system prompt from `docs/agent-setup.md`
   - Copy your Agent ID

4. **Start the application**
   ```bash
   npm run dev
   ```

5. **Open in browser**
   - Navigate to `http://localhost:5173`
   - Paste your Agent ID
   - Allow microphone access
   - Start talking!

## 📖 Usage

1. Click "Start Kora" after entering your Agent ID
2. Click the microphone button "Click to start" to start a conversation
3. Speak naturally - Kora will respond with voice
4. Click again to end the conversation

### Example Questions

- "Who are you?"
- "Tell me about Neuro-Voice API"
- "What services does Kora AI Solutions offer?"

## 🎥 Demo

[Link to demo video]

## 🛠️ Development

### Project Structure

```
frontend/
├── src/
│   ├── components/
│   │   └── AgentChat.tsx      # Main conversation component
│   ├── App.tsx                 # App entry & config
│   └── index.css               # Tailwind styles
├── docs/
│   ├── agent-setup.md          # Agent configuration guide
│   └── demo-script.md          # Video demo script
└── package.json
```

### Key Dependencies

- `@elevenlabs/react` - ElevenLabs React SDK
- `react` - UI framework
- `tailwindcss` - Styling
- `vite` - Build tool

## 🏆 Hackathon Compliance

This project satisfies the **ElevenLabs Challenge** requirements:

✅ Uses ElevenLabs Agents Platform  
✅ Integrates Google Cloud AI (Gemini)  
✅ Voice-driven interaction  
✅ Built during hackathon period  
✅ Open source (MIT License)  
✅ Public repository  
✅ Demo video under 3 minutes  

## 📝 License

MIT License - see [LICENSE](LICENSE) file for details

## 🙏 Acknowledgments

- **ElevenLabs** - Conversational AI platform
- **Google Cloud** - Vertex AI and Gemini models
- **AI Partner Catalyst Hackathon** - Inspiration and challenge

## 👥 Team

[Muhammad Mwinchande](https://github.com/ammwinchande)

---

Built with ❤️ for the AI Partner Catalyst Hackathon

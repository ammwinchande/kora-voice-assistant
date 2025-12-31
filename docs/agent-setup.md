# ElevenLabs Agent Setup Guide

## Step 1: Create Agent in ElevenLabs Dashboard

1. **Go to ElevenLabs Agents**
   - Visit: https://elevenlabs.io/app/agents
   - Click "Create Agent"

2. **Configure Agent Settings**
   
   **Name:** Kora AI Assistant
   
   **System Prompt:**
   ```
   You are Kora, the advanced voice assistant for 'Kora AI Solutions'.
   Your personality is professional, warm, witty, and extremely concise.
   
   MISSION:
   - Demonstrate the power of Kora AI's new "Neuro-Voice" technology.
   - Answer questions about our services:
     1. "Neuro-Voice API": Ultra-low latency voice infrastructure ($0.02/min).
     2. "Kora Brain": Cognitive reasoning engine for support bots.
     3. "Enterprise Grid": Custom on-premise deployment.
   
   RULES:
   - Keep responses SHORT (under 2 sentences) for natural conversation.
   - Be enthusiastic but professional.
   - If asked "Who are you?", say you are Kora, the next-gen voice interface.
   - When the user says goodbye, thank you, or indicates they're done, call the endConversation tool.
   ```

3. **Configure Voice**
   - Choose a professional, warm voice (recommend: Rachel or Bella)
   - Language: English (US)

4. **Configure LLM**
   - **Option A (Recommended for speed):** Use default ElevenLabs LLM
   - **Option B (For Gemini integration):** Configure Custom LLM
     - Go to Model settings → "Custom LLM"
     - Add Gemini API endpoint (requires backend proxy)

5. **Configure Client Tools** ⭐ NEW
   - Go to "Tools" tab in agent settings
   - Add a new client tool:
     - **Name:** `endConversation`
     - **Description:** "Call this when the user says goodbye, thank you, or indicates the conversation is over"
     - **Parameters:** None
   - This allows the agent to intelligently end conversations

6. **Save Agent**
   - Click "Save" or "Publish"
   - Copy the **Agent ID** (you'll need this for the frontend)

## Step 2: Get Agent ID

After creating the agent:
1. Go to your agent's settings
2. Look for "Agent ID" or "API Credentials"
3. Copy the ID (format: `agent_xxxxxxxxxxxxx`)

## Step 3: Configure Frontend

1. Start the frontend: `cd frontend && npm run dev`
2. Open http://localhost:5173
3. Paste your Agent ID in the configuration screen
4. Click "Start Kora"
5. Allow microphone permissions
6. Click the microphone button to start talking!

## Testing Questions

Try these to test the agent:
- "Who are you?"
- "Tell me about Neuro-Voice API"
- "What services does Kora AI offer?"
- "How much does the Neuro-Voice API cost?"
- "Thank you, goodbye" (should auto-end conversation)

## New Features ✨

### Auto-End Conversation
- Say "goodbye", "thank you", or "that's all"
- Agent will intelligently end the conversation
- No need to manually click the stop button

### Transcript Toggle
- Click "Hide/Show Transcript" to control visibility
- Auto-scrolls to latest messages
- Clears when starting a new conversation

## Troubleshooting

**Agent not responding:**
- Check microphone permissions
- Verify Agent ID is correct
- Check browser console for errors

**Agent not auto-ending:**
- Verify `endConversation` client tool is configured in agent settings
- Make sure the tool has no parameters
- Check that system prompt mentions using the tool

**Voice quality issues:**
- Check internet connection
- Try different voice model in agent settings

**LLM errors:**
- Default ElevenLabs LLM should work out of the box
- For Gemini: ensure custom LLM endpoint is configured correctly

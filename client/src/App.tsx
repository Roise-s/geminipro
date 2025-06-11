import React, { useState, useRef, useEffect } from 'react'
import './App.css'
import { GoogleGenAI } from "@google/genai";
import Header from './sections/Header'

const apiKey = import.meta.env.VITE_GEMINI_API_KEY

const ai = new GoogleGenAI({ apiKey: apiKey });

interface Message {
  role: 'user' | 'ai'
  content: string
}

function App() {
  const [messages, setMessages] = useState<Message[]>([])
  const [input, setInput] = useState('')
  const messagesEndRef = useRef<HTMLDivElement | null>(null)

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

 async function handleSend(e: React.FormEvent<HTMLFormElement>) {
  e.preventDefault()
 
  if (!input.trim()) return
    setMessages([...messages, { role: 'user', content: input }])
     const response = await ai.models.generateContent({
    model: "gemini-2.0-flash",
    contents: input,
  });
    setInput('')
    // Placeholder for AI response
    setTimeout(() => {
      setMessages(msgs => [
        ...msgs,
        { role: 'ai', content: response.text || "I'm not sure how to respond to that." }
      ])
    }, 800)
}

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-[#f8fafc] to-[#e0e7ef]">
      {/* Header */}
      <Header />

      {/* Chat area */}
      <main
        className="flex-1 flex flex-col items-center justify-center px-2"
        style={{ backgroundColor: '#1f1f1f' }}
      >
        <div className="w-full max-w-2xl flex flex-col flex-1 bg-[#1f1f1f] rounded-xl shadow-lg mt-8 mb-4 overflow-hidden">
          <div className="flex-1 overflow-y-auto px-6 py-4 space-y-4" style={{ minHeight: 400 }}>
            {messages.length === 0 && (
              <div className="text-center text-gray-400 mt-24">
                <p className="text-lg">Hello! Ask me anything.</p>
              </div>
            )}
            {messages.map((msg, idx) => (
              <div
                key={idx}
                className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`px-4 py-2 rounded-2xl max-w-[75%] text-base ${
                    msg.role === 'user'
                      ? 'bg-blue-500 text-white rounded-br-none'
                      : 'bg-gray-100 text-gray-800 rounded-bl-none'
                  }`}
                >
                  {msg.content}
                </div>
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>
          {/* Input */}
          <form
            onSubmit={handleSend}
            className="flex items-center gap-2 border-t px-4 py-3"
            style={{ backgroundColor: '#1f1f1f' }}
          >
            <input
              type="text"
              className="flex-1 px-4 py-2 rounded-full border border-gray-700 bg-[#232323] text-white focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
              placeholder="Type your message..."
              value={input}
              onChange={e => setInput(e.target.value)}
            />
            <button
              type="submit"
              className="bg-blue-500 hover:bg-blue-600 text-white px-5 py-2 rounded-full font-semibold transition"
              disabled={!input.trim()}
            >
              Send
            </button>
          </form>
        </div>
      </main>
      {/* Footer */}
      <footer
        className="text-center text-gray-400 py-4 text-sm"
        style={{ backgroundColor: '#1f1f1f' }}
      >
        Gemini Pro &copy; {new Date().getFullYear()} Kgaugelo.dev
      </footer>
    </div>
  )
}

export default App

'use client'

import { useState, useEffect } from 'react'
import { MessageCircle, X, Send } from 'lucide-react'

const WHATSAPP_NUMBER = '917978974823'
const WHATSAPP_URL = `https://wa.me/${WHATSAPP_NUMBER}`

const QUICK_ACTIONS = [
  { label: '📦 Track My Order', message: 'Hi! I want to track my order.' },
  { label: '🎁 Gift Suggestions', message: 'Hi! I need gift suggestions.' },
  { label: '💬 Corporate Inquiry', message: 'Hi! I have a corporate gifting inquiry.' },
  { label: '❓ General Help', message: 'Hi! I need help with something.' },
]

export function WhatsAppChat() {
  const [isOpen, setIsOpen] = useState(false)
  const [message, setMessage] = useState('')
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  const handleSend = () => {
    if (!message.trim()) return
    const encoded = encodeURIComponent(message)
    window.open(`https://wa.me/${WHATSAPP_NUMBER}?text=${encoded}`, '_blank')
    setMessage('')
    setIsOpen(false)
  }

  const handleQuickAction = (msg: string) => {
    const encoded = encodeURIComponent(msg)
    window.open(`https://wa.me/${WHATSAPP_NUMBER}?text=${encoded}`, '_blank')
    setIsOpen(false)
  }

  if (!mounted) return null

  return (
    <>
      {/* Chat Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed bottom-6 right-6 z-50 flex h-14 w-14 items-center justify-center rounded-full bg-green-500 text-white shadow-lg transition-all hover:bg-green-600 hover:scale-110 active:scale-95"
        aria-label="Chat on WhatsApp"
      >
        {isOpen ? (
          <X className="h-6 w-6" />
        ) : (
          <MessageCircle className="h-7 w-7" />
        )}
      </button>

      {/* Chat Popup */}
      {isOpen && (
        <div className="fixed bottom-24 right-6 z-50 w-80 sm:w-96 animate-in slide-in-from-bottom-5 fade-in duration-200">
          <div className="rounded-2xl bg-white shadow-2xl border border-gray-100 overflow-hidden">
            {/* Header */}
            <div className="bg-green-500 p-4 text-white">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-full bg-white/20 flex items-center justify-center text-lg">
                  💬
                </div>
                <div>
                  <h3 className="font-semibold text-sm">Symphony Enterprise</h3>
                  <p className="text-xs text-green-100">Typically replies within 1 hour</p>
                </div>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="p-3 bg-gray-50 border-b border-gray-100">
              <p className="text-xs text-gray-500 mb-2 font-medium">QUICK ACTIONS</p>
              <div className="flex flex-wrap gap-2">
                {QUICK_ACTIONS.map((action) => (
                  <button
                    key={action.label}
                    onClick={() => handleQuickAction(action.message)}
                    className="text-xs bg-white border border-gray-200 rounded-full px-3 py-1.5 text-gray-700 hover:bg-green-50 hover:border-green-200 hover:text-green-700 transition-colors"
                  >
                    {action.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Message Input */}
            <div className="p-3">
              <div className="flex gap-2">
                <input
                  type="text"
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                  placeholder="Type a message..."
                  className="flex-1 rounded-full border border-gray-200 px-4 py-2 text-sm outline-none focus:border-green-400 focus:ring-1 focus:ring-green-400 transition-colors"
                />
                <button
                  onClick={handleSend}
                  disabled={!message.trim()}
                  className="flex h-10 w-10 items-center justify-center rounded-full bg-green-500 text-white disabled:opacity-40 hover:bg-green-600 transition-colors"
                >
                  <Send className="h-4 w-4" />
                </button>
              </div>
              <p className="text-[10px] text-gray-400 mt-2 text-center">
                Chat with us on WhatsApp • Free & Secure
              </p>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
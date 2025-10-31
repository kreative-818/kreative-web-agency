
'use client'

import { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { MessageCircle, X, Send, User, Zap, Headphones, CheckCircle, Loader2, ExternalLink } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { cn } from '@/lib/utils'
import { useRouter } from 'next/navigation'
import { LeadCaptureForm } from './lead-capture-form'

interface Message {
  id: string
  role: 'user' | 'assistant' | 'support'
  content: string
  timestamp: Date
  isStreaming?: boolean
}

interface AgentAction {
  type: 'continue' | 'close_deal' | 'transfer_to_human'
  data?: {
    service?: string
    price?: string
    description?: string
    reason?: string
    summary?: string
  }
}

interface LeadData {
  firstName: string
  email: string
}

export function AIChatbot() {
  const router = useRouter()
  const [isOpen, setIsOpen] = useState(false)
  const [showLeadForm, setShowLeadForm] = useState(false)
  const [leadData, setLeadData] = useState<LeadData | null>(null)
  const [contactId, setContactId] = useState<string | null>(null)
  const [conversationId, setConversationId] = useState<string | null>(null)
  const [messages, setMessages] = useState<Message[]>([])
  const [input, setInput] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [isTyping, setIsTyping] = useState(false)
  const [transferredToHuman, setTransferredToHuman] = useState(false)
  const [dealClosed, setDealClosed] = useState(false)
  const [checkoutUrl, setCheckoutUrl] = useState<string | null>(null)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)
  const abortControllerRef = useRef<AbortController | null>(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages, isTyping])

  useEffect(() => {
    if (isOpen && inputRef.current && !dealClosed && !transferredToHuman) {
      inputRef.current.focus()
    }
  }, [isOpen, dealClosed, transferredToHuman])

  useEffect(() => {
    // Cleanup on unmount
    return () => {
      if (abortControllerRef.current) {
        abortControllerRef.current.abort()
      }
    }
  }, [])

  // Check for existing conversation on mount
  useEffect(() => {
    const storedConvId = localStorage.getItem('chatbot_conversation_id')
    const storedLeadData = localStorage.getItem('chatbot_lead_data')
    
    if (storedConvId && storedLeadData) {
      // Try to load existing conversation
      loadExistingConversation(storedConvId, JSON.parse(storedLeadData))
    }
  }, [])

  // Save conversation when messages change
  useEffect(() => {
    if (conversationId && leadData && messages.length > 0) {
      saveConversation()
    }
  }, [messages, conversationId, leadData])

  const loadExistingConversation = async (convId: string, lead: LeadData) => {
    try {
      const response = await fetch(`/api/conversations/${convId}`)
      const data = await response.json()
      
      if (data.conversation && !data.isExpired) {
        // Load existing conversation
        setConversationId(convId)
        setLeadData(lead)
        setContactId(data.conversation.contactId)
        
        const parsedMessages = JSON.parse(data.conversation.messages)
        setMessages(parsedMessages)
      } else {
        // Conversation expired, clear storage
        localStorage.removeItem('chatbot_conversation_id')
        localStorage.removeItem('chatbot_lead_data')
      }
    } catch (error) {
      console.error('Failed to load conversation:', error)
      // Clear invalid data
      localStorage.removeItem('chatbot_conversation_id')
      localStorage.removeItem('chatbot_lead_data')
    }
  }

  const saveConversation = async () => {
    if (!conversationId || !leadData) return

    try {
      await fetch('/api/conversations', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          conversationId,
          contactId,
          firstName: leadData.firstName,
          email: leadData.email,
          messages
        })
      })
    } catch (error) {
      console.error('Failed to save conversation:', error)
    }
  }

  const handleLeadFormSubmit = async (data: LeadData) => {
    setLeadData(data)
    setShowLeadForm(false)
    
    // Generate conversation ID
    const newConvId = `conv_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
    setConversationId(newConvId)
    
    // Store in localStorage for persistence
    localStorage.setItem('chatbot_conversation_id', newConvId)
    localStorage.setItem('chatbot_lead_data', JSON.stringify(data))
    
    // Fetch contact ID from the contact creation
    try {
      const response = await fetch('/api/contacts')
      const contactsData = await response.json()
      const contact = contactsData.contacts?.find((c: any) => c.email === data.email)
      if (contact) {
        setContactId(contact.id)
      }
    } catch (error) {
      console.error('Failed to fetch contact ID:', error)
    }
    
    // Initialize conversation with personalized greeting
    setMessages([{
      id: '1',
      role: 'assistant',
      content: `Hi ${data.firstName}! 👋 I'm your personal strategist from Kreative Intelligence—we build intelligent digital solutions that multiply revenue. Whether you need a high-converting website, custom web application, or AI automation that works 24/7, I'm here to help. What's your biggest challenge right now?`,
      timestamp: new Date()
    }])
  }

  const handleChatOpen = () => {
    if (!leadData) {
      // Show lead capture form first
      setShowLeadForm(true)
    }
    setIsOpen(true)
  }

  const handleSendMessage = async () => {
    if (!input.trim() || isLoading || dealClosed || transferredToHuman) return

    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: input,
      timestamp: new Date()
    }

    setMessages(prev => [...prev, userMessage])
    const messageContent = input
    setInput('')
    setIsLoading(true)
    setIsTyping(true)

    try {
      // Build conversation history for the AI agent
      const conversationHistory = [
        ...messages.map(m => ({ role: m.role, content: m.content })),
        { role: 'user', content: messageContent }
      ]

      // Create abort controller for this request
      abortControllerRef.current = new AbortController()

      const response = await fetch('/api/ai-agent', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          messages: conversationHistory
        }),
        signal: abortControllerRef.current.signal
      })

      if (!response.ok) throw new Error('Failed to get response')

      const reader = response.body?.getReader()
      const decoder = new TextDecoder()
      let assistantContent = ''
      let buffer = ''
      let finalDecision: any = null

      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: '',
        timestamp: new Date(),
        isStreaming: true
      }

      setMessages(prev => [...prev, assistantMessage])

      // Function to animate text character by character with smooth delay
      const animateText = async (text: string) => {
        for (let i = 0; i < text.length; i++) {
          await new Promise(resolve => setTimeout(resolve, 20)) // 20ms delay per character
          assistantContent += text[i]
          setMessages(prev => {
            const newMessages = [...prev]
            if (newMessages[newMessages.length - 1]?.isStreaming) {
              newMessages[newMessages.length - 1].content = assistantContent
            }
            return newMessages
          })
        }
      }

      let partialRead = ''

      while (true) {
        const { done, value } = await reader!.read()
        if (done) break

        partialRead += decoder.decode(value, { stream: true })
        let lines = partialRead.split('\n')
        partialRead = lines.pop() || ''

        for (const line of lines) {
          if (line.startsWith('data: ')) {
            const data = line.slice(6).trim()
            if (!data) continue

            try {
              const parsed = JSON.parse(data)
              
              if (parsed.type === 'chunk') {
                const content = parsed.content || ''
                if (content) {
                  buffer += content
                  // Process buffer for smoother animation
                  if (buffer.length >= 2 || content.includes(' ') || content.includes('\n')) {
                    await animateText(buffer)
                    buffer = ''
                  }
                }
              } else if (parsed.type === 'complete') {
                // Animate any remaining buffer
                if (buffer) {
                  await animateText(buffer)
                  buffer = ''
                }
                
                finalDecision = parsed.decision
              }
            } catch (e) {
              console.error('Parse error:', e)
            }
          }
        }
      }

      // Animate any remaining buffer
      if (buffer) {
        await animateText(buffer)
      }

      // Mark message as complete
      setMessages(prev => {
        const newMessages = [...prev]
        if (newMessages[newMessages.length - 1]?.isStreaming) {
          newMessages[newMessages.length - 1].isStreaming = false
        }
        return newMessages
      })

      // Handle agent decision
      if (finalDecision) {
        await handleAgentAction(finalDecision)
      }

    } catch (error: any) {
      if (error.name === 'AbortError') {
        console.log('Request aborted')
        return
      }
      
      console.error('Error:', error)
      setMessages(prev => {
        // Remove the streaming message if it exists
        const newMessages = prev.filter(m => !m.isStreaming)
        return [...newMessages, {
          id: Date.now().toString(),
          role: 'assistant',
          content: "I apologize, but I'm having trouble connecting. Please try again or call us directly at (984) 400-9443.",
          timestamp: new Date()
        }]
      })
    } finally {
      setIsLoading(false)
      setIsTyping(false)
      abortControllerRef.current = null
    }
  }

  const handleAgentAction = async (decision: any) => {
    const { action, closeDetails, transferDetails } = decision

    if (action === 'CLOSE_DEAL' && closeDetails) {
      // Create a quote and get checkout URL
      try {
        const response = await fetch('/api/create-quote', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            service: closeDetails.service,
            price: closeDetails.price,
            description: closeDetails.description,
            conversationHistory: messages
          }),
        })

        if (response.ok) {
          const data = await response.json()
          setCheckoutUrl(data.checkoutUrl)
          setDealClosed(true)
          
          // Add a success message
          setMessages(prev => [...prev, {
            id: Date.now().toString(),
            role: 'assistant',
            content: "🎉 Perfect! I've prepared your order. Click the button below to complete your purchase!",
            timestamp: new Date()
          }])
        }
      } catch (error) {
        console.error('Failed to create quote:', error)
      }
    } else if (action === 'TRANSFER_TO_HUMAN' && transferDetails) {
      // Transfer to human agent
      try {
        const response = await fetch('/api/transfer-to-human', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            reason: transferDetails.reason,
            summary: transferDetails.summary,
            conversationHistory: messages
          }),
        })

        if (response.ok) {
          const data = await response.json()
          setTransferredToHuman(true)
          
          // Add transfer confirmation message
          setMessages(prev => [...prev, {
            id: Date.now().toString(),
            role: 'assistant',
            content: `🔄 ${data.message || 'I\'ve notified our team. A senior consultant will reach out to you shortly at the contact information you provided. In the meantime, feel free to call us directly at (984) 400-9443!'}`,
            timestamp: new Date()
          }])
        }
      } catch (error) {
        console.error('Failed to transfer to human:', error)
      }
    }
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSendMessage()
    }
  }

  const handleGoToCheckout = () => {
    if (checkoutUrl) {
      window.location.href = checkoutUrl
    }
  }

  return (
    <>
      {/* Lead Capture Form */}
      <AnimatePresence>
        {showLeadForm && (
          <LeadCaptureForm
            onSubmit={handleLeadFormSubmit}
            onClose={() => {
              setShowLeadForm(false)
              setIsOpen(false)
            }}
          />
        )}
      </AnimatePresence>

      {/* Chat Button */}
      <AnimatePresence>
        {!isOpen && (
          <motion.div
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0, opacity: 0 }}
            className="fixed bottom-6 right-6 z-50"
          >
            <Button
              onClick={handleChatOpen}
              size="lg"
              className="h-16 w-16 rounded-full shadow-2xl bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 transition-all duration-300 hover:scale-110"
            >
              <MessageCircle className="h-7 w-7" />
            </Button>
            <motion.div
              className="absolute -top-1 -right-1 h-4 w-4 bg-green-500 rounded-full border-2 border-white"
              animate={{ scale: [1, 1.2, 1] }}
              transition={{ repeat: Infinity, duration: 2 }}
            />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Chat Window */}
      <AnimatePresence>
        {isOpen && leadData && !showLeadForm && (
          <motion.div
            initial={{ opacity: 0, y: 100, scale: 0.8 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 100, scale: 0.8 }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            className="fixed bottom-6 right-6 z-50 w-[420px] h-[650px] bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 rounded-2xl shadow-2xl border border-slate-700/50 flex flex-col overflow-hidden"
          >
            {/* Header */}
            <div className="bg-gradient-to-r from-purple-600 to-blue-600 p-5 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="relative">
                  <div className="h-10 w-10 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center">
                    <Zap className="h-5 w-5 text-white" />
                  </div>
                  <motion.div
                    className="absolute -bottom-0.5 -right-0.5 h-3 w-3 bg-green-400 rounded-full border-2 border-white"
                    animate={{ scale: [1, 1.3, 1] }}
                    transition={{ repeat: Infinity, duration: 2 }}
                  />
                </div>
                <div>
                  <h3 className="font-semibold text-white text-lg">Kreative Intelligence</h3>
                  <p className="text-xs text-white/80">Premium Sales Strategist • 24/7</p>
                </div>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsOpen(false)}
                className="text-white hover:bg-white/20 rounded-full h-8 w-8 p-0"
              >
                <X className="h-5 w-5" />
              </Button>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4 scrollbar-thin scrollbar-thumb-slate-600 scrollbar-track-transparent">
              {messages.map((message, index) => (
                <motion.div
                  key={message.id}
                  initial={{ opacity: 0, y: 20, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  transition={{ 
                    delay: index * 0.1,
                    type: 'spring',
                    damping: 20,
                    stiffness: 300
                  }}
                  className={cn(
                    'flex gap-3',
                    message.role === 'user' ? 'flex-row-reverse' : 'flex-row'
                  )}
                >
                  <div
                    className={cn(
                      'h-8 w-8 rounded-full flex items-center justify-center flex-shrink-0',
                      message.role === 'user'
                        ? 'bg-gradient-to-br from-blue-500 to-purple-500'
                        : message.role === 'support'
                        ? 'bg-gradient-to-br from-green-500 to-emerald-500'
                        : 'bg-gradient-to-br from-purple-500 to-pink-500'
                    )}
                  >
                    {message.role === 'user' ? (
                      <User className="h-4 w-4 text-white" />
                    ) : message.role === 'support' ? (
                      <Headphones className="h-4 w-4 text-white" />
                    ) : (
                      <Zap className="h-4 w-4 text-white" />
                    )}
                  </div>
                  <motion.div
                    className={cn(
                      'max-w-[75%] rounded-2xl px-4 py-3 shadow-lg',
                      message.role === 'user'
                        ? 'bg-gradient-to-br from-blue-600 to-purple-600 text-white'
                        : message.role === 'support'
                        ? 'bg-gradient-to-br from-green-600 to-emerald-600 text-white border-2 border-green-400/50'
                        : 'bg-slate-800 text-slate-100 border border-slate-700/50'
                    )}
                    initial={{ scale: 0.9 }}
                    animate={{ scale: 1 }}
                    transition={{ type: 'spring', damping: 20 }}
                  >
                    {message.role === 'support' && (
                      <p className="text-xs font-semibold text-green-200 mb-1">Live Support Agent</p>
                    )}
                    <p className="text-sm leading-relaxed font-medium break-words">
                      {message.content}
                    </p>
                    <p className={cn(
                      'text-xs mt-1.5',
                      message.role === 'user' ? 'text-white/70' : message.role === 'support' ? 'text-green-200' : 'text-slate-400'
                    )}>
                      {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </p>
                  </motion.div>
                </motion.div>
              ))}

              {isTyping && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="flex gap-3"
                >
                  <div className="h-8 w-8 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center flex-shrink-0">
                    <Zap className="h-4 w-4 text-white" />
                  </div>
                  <div className="bg-slate-800 rounded-2xl px-4 py-3 border border-slate-700/50">
                    <div className="flex gap-1.5">
                      <motion.div
                        className="h-2 w-2 bg-purple-400 rounded-full"
                        animate={{ y: [0, -8, 0] }}
                        transition={{ repeat: Infinity, duration: 0.8, delay: 0 }}
                      />
                      <motion.div
                        className="h-2 w-2 bg-blue-400 rounded-full"
                        animate={{ y: [0, -8, 0] }}
                        transition={{ repeat: Infinity, duration: 0.8, delay: 0.2 }}
                      />
                      <motion.div
                        className="h-2 w-2 bg-pink-400 rounded-full"
                        animate={{ y: [0, -8, 0] }}
                        transition={{ repeat: Infinity, duration: 0.8, delay: 0.4 }}
                      />
                    </div>
                  </div>
                </motion.div>
              )}

              <div ref={messagesEndRef} />
            </div>

            {/* Action Buttons */}
            {dealClosed && checkoutUrl && (
              <div className="px-4 pb-2">
                <Button
                  onClick={handleGoToCheckout}
                  className="w-full bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white font-semibold"
                  size="lg"
                >
                  <CheckCircle className="mr-2 h-5 w-5" />
                  Complete Your Order
                  <ExternalLink className="ml-2 h-4 w-4" />
                </Button>
              </div>
            )}

            {transferredToHuman && (
              <div className="px-4 pb-2">
                <div className="bg-gradient-to-r from-yellow-600/20 to-orange-600/20 border border-yellow-500/50 rounded-lg p-3 text-center">
                  <Headphones className="h-5 w-5 mx-auto mb-2 text-yellow-400" />
                  <p className="text-xs text-yellow-200 font-medium">
                    Our team has been notified and will reach out shortly!
                  </p>
                </div>
              </div>
            )}

            {/* Input */}
            <div className="p-4 bg-slate-900/80 backdrop-blur-sm border-t border-slate-700/50">
              {!dealClosed && !transferredToHuman ? (
                <div className="flex gap-2">
                  <Input
                    ref={inputRef}
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyPress={handleKeyPress}
                    placeholder="Type your message..."
                    disabled={isLoading}
                    className="flex-1 bg-slate-800 border-slate-700 text-white placeholder:text-slate-400 focus:border-purple-500 focus:ring-purple-500/20"
                  />
                  <Button
                    onClick={handleSendMessage}
                    disabled={!input.trim() || isLoading}
                    size="icon"
                    className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 transition-all duration-300 disabled:opacity-50"
                  >
                    <Send className="h-4 w-4" />
                  </Button>
                </div>
              ) : (
                <div className="text-center">
                  <p className="text-sm text-slate-400">
                    {dealClosed 
                      ? 'Ready to complete your order!' 
                      : 'Waiting for our team to connect with you'}
                  </p>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
